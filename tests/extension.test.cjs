const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const extension = path.join(__dirname, "../extension");
const read = name => fs.readFileSync(path.join(extension, name), "utf8");
const markup = `<ytd-watch-flexy><div id="below"><ytd-comments id="comments"><p>SECRET COMMENT</p></ytd-comments></div></ytd-watch-flexy>`;
function setup(html = markup, url = "https://www.youtube.com/watch?v=first") {
  const dom = new JSDOM(`<html lang="ko"><head><style>${read("content.css")}</style></head><body>${html}</body></html>`, { url, runScripts: "outside-only" });
  dom.window.eval(read("insights.js"));
  dom.window.eval(read("content.js"));
  return dom;
}
const flush = () => new Promise(resolve => setImmediate(resolve));
function close(dom) {
  dom.window.dispatchEvent(new dom.window.Event("pagehide"));
  dom.window.close();
}
const click = (dom, label) => {
  const control = [...dom.window.document.querySelectorAll(".ycb-gate button")].find(node => node.textContent === label);
  assert.ok(control, `Expected control: ${label}`);
  control.click();
};
const hidden = dom => dom.window.getComputedStyle(dom.window.document.querySelector("ytd-comments")).display === "none";

test("comments stay hidden until explicit Yes; choosing focus offers no accidental reveal", () => {
  const dom = setup();
  try {
    assert.equal(hidden(dom), true);
    click(dom, "영상에 집중하기");
    assert.equal(hidden(dom), true);
    click(dom, "댓글 보기 선택");
    assert.equal(hidden(dom), true);
    click(dom, "예, 댓글 보기");
    assert.equal(hidden(dom), false);
    click(dom, "다시 숨기기");
    assert.equal(hidden(dom), true);
  } finally { close(dom); }
});

test("new videos, browser history, and returning to a video always require fresh consent", async () => {
  const dom = setup();
  const w = dom.window;
  try {
    click(dom, "예, 댓글 보기");
    w.document.dispatchEvent(new w.Event("yt-navigate-start"));
    assert.equal(hidden(dom), true);
    w.history.pushState(null, "", "/watch?v=second");
    w.document.dispatchEvent(new w.Event("yt-navigate-finish"));
    await flush();
    assert.equal(hidden(dom), true);
    assert.ok(w.document.querySelector(".ycb-question"));
    click(dom, "예, 댓글 보기");
    w.history.replaceState(null, "", "/watch?v=first");
    w.dispatchEvent(new w.Event("popstate"));
    await flush();
    assert.equal(hidden(dom), true);
  } finally { close(dom); }
});

test("early CSS blocks delayed comment DOM before the observer mounts the gate", async () => {
  const dom = setup("<ytd-watch-flexy><div id='below'></div></ytd-watch-flexy>");
  const w = dom.window;
  try {
    w.document.querySelector("#below").innerHTML = "<ytd-comments>Delayed comment</ytd-comments>";
    assert.equal(hidden(dom), true);
    await flush();
    assert.equal(w.document.querySelectorAll(".ycb-gate").length, 1);
    w.document.querySelector("ytd-comments").replaceWith(w.document.createElement("ytd-comments"));
    await flush();
    assert.equal(w.document.querySelectorAll(".ycb-gate").length, 1);
    assert.equal(hidden(dom), true);
  } finally { close(dom); }
});

test("SPA entry from home mounts protection; leaving watch removes gates", async () => {
  const dom = setup(markup, "https://www.youtube.com/");
  const w = dom.window;
  try {
    assert.equal(w.document.querySelector(".ycb-gate"), null);
    w.history.pushState(null, "", "/watch?v=first");
    w.document.dispatchEvent(new w.Event("yt-navigate-finish"));
    await flush();
    assert.equal(w.document.querySelectorAll(".ycb-gate").length, 1);
    click(dom, "예, 댓글 보기");
    w.document.dispatchEvent(new w.Event("yt-navigate-start"));
    w.history.pushState(null, "", "/results?search_query=hello");
    w.document.dispatchEvent(new w.Event("yt-navigate-finish"));
    await flush();
    assert.equal(w.document.querySelector(".ycb-gate"), null);
    assert.equal(w.document.documentElement.dataset.ycbState, "blocked");
  } finally { close(dom); }
});

test("side panel requires consent, shares video consent and avoids duplicate nested gates", () => {
  const dom = setup(markup + `<ytd-engagement-panel-section-list-renderer target-id="engagement-panel-comments-section"><div id="content"><ytd-comments>Panel comment</ytd-comments></div></ytd-engagement-panel-section-list-renderer>`);
  const w = dom.window;
  const content = w.document.querySelector("ytd-engagement-panel-section-list-renderer #content");
  try {
    assert.equal(w.document.querySelectorAll(".ycb-gate").length, 2);
    assert.equal(w.getComputedStyle(content).display, "none");
    click(dom, "예, 댓글 보기");
    assert.notEqual(w.getComputedStyle(content).display, "none");
    click(dom, "다시 숨기기");
    assert.equal(w.getComputedStyle(content).display, "none");
  } finally { close(dom); }
});

test("consent cannot be granted during a pending navigation", () => {
  const dom = setup();
  try {
    dom.window.document.dispatchEvent(new dom.window.Event("yt-navigate-start"));
    click(dom, "예, 댓글 보기");
    assert.equal(hidden(dom), true);
  } finally { close(dom); }
});

test("restoring a cached page re-locks comments and resumes observing delayed content", async () => {
  const dom = setup();
  const w = dom.window;
  try {
    click(dom, "예, 댓글 보기");
    w.dispatchEvent(new w.Event("pagehide"));
    assert.equal(hidden(dom), true);
    w.dispatchEvent(new w.Event("pageshow"));
    await flush();
    assert.equal(hidden(dom), true);
    assert.ok(w.document.querySelector(".ycb-question"));
    w.document.querySelector("ytd-comments").replaceWith(w.document.createElement("ytd-comments"));
    await flush();
    assert.equal(w.document.querySelectorAll(".ycb-gate").length, 1);
  } finally { close(dom); }
});

test("language changes keep state, and research links include limits and safe external link attributes", async () => {
  const dom = setup();
  const w = dom.window;
  try {
    for (const insight of w.YCB.insights.filter(item => item.type === "research")) {
      assert.ok(insight.ko.limitation);
      assert.ok(insight.en.limitation);
      assert.match(insight.url, /^https:\/\/doi\.org\//);
    }
    const researchKey = Array.from({ length: 50 }, (_, n) => `study${n}`).find(key => w.YCB.chooseInsight(key).type === "research");
    w.history.replaceState(null, "", "/watch?v=" + researchKey);
    w.document.dispatchEvent(new w.Event("yt-navigate-finish"));
    await flush();
    assert.ok(w.document.querySelector(".ycb-study"));
    assert.equal(w.document.querySelector(".ycb-study a").rel, "noopener noreferrer");
    click(dom, "영상에 집중하기");
    w.document.documentElement.lang = "en";
    await flush();
    assert.match(w.document.querySelector(".ycb-gate").textContent, /Comments can wait/);
    assert.equal(hidden(dom), true);
  } finally { close(dom); }
});

test("video parsing excludes Shorts, home, playlist landing pages and invalid URLs", () => {
  const dom = setup();
  try {
    const parse = dom.window.YCB.videoKey;
    assert.equal(parse("https://www.youtube.com/watch?v=abc&list=123&t=20"), "abc");
    for (const url of ["https://www.youtube.com/", "https://www.youtube.com/shorts/abc", "https://www.youtube.com/playlist?list=x", "https://www.youtube.com/watch", "invalid"]) assert.equal(parse(url), null);
  } finally { close(dom); }
});

test("manifest uses early injection, local assets and no optional API permissions", () => {
  const manifest = JSON.parse(read("manifest.json"));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.content_scripts[0].run_at, "document_start");
  assert.deepEqual(manifest.content_scripts[0].matches, ["https://www.youtube.com/*"]);
  assert.equal(manifest.permissions, undefined);
  for (const asset of [...manifest.content_scripts[0].js, ...manifest.content_scripts[0].css, ...Object.values(manifest.icons), manifest.action.default_popup]) assert.equal(fs.existsSync(path.join(extension, asset)), true, asset);
});
