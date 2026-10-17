(() => {
  "use strict";
  const { messages, videoKey, chooseInsight } = globalThis.YCB;
  const root = document.documentElement;
  const MAIN = "ytd-watch-flexy ytd-comments";
  const PANEL = 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]';
  let currentVideo = videoKey(location.href);
  let state = "ask";
  let language = getLanguage();
  let queued = false;
  let navigating = false;
  let suspended = false;
  const gates = new Map();
  root.setAttribute("data-ycb-state", "blocked");

  function getLanguage() { return /^ko\b/i.test(root.lang || navigator.language) ? "ko" : "en"; }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function icon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", "M7 10V7a5 5 0 0 1 10 0v3M6 10h12v11H6zM12 14v3");
    svg.append(path);
    return svg;
  }
  function button(text, primary, action) {
    const node = element("button", primary ? "ycb-primary" : "", text);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  }
  function transition(next, focusTarget) {
    // Consent is tied to the current video, including during a pending SPA navigation.
    if (navigating || videoKey(location.href) !== currentVideo) { sync(); return; }
    state = next;
    root.setAttribute("data-ycb-state", next === "open" ? "open" : "blocked");
    renderAll();
    if (focusTarget) {
      const control = focusTarget.querySelector("button");
      if (control) control.focus({ preventScroll: true });
    }
  }
  function render(gate) {
    const t = messages[language];
    gate.replaceChildren();
    gate.setAttribute("aria-label", t.comments);
    if (state !== "ask") {
      const bar = element("div", "ycb-compact");
      const copy = element("div", "ycb-compact-copy");
      copy.append(element("strong", "", state === "open" ? t.viewing : t.hidden));
      copy.append(element("p", "", state === "open" ? t.videoOnly : t.hiddenBody));
      bar.append(icon(), copy, button(state === "open" ? t.hide : t.reconsider, false, () => transition("ask", gate)));
      gate.append(bar);
      return;
    }
    const heading = element("div", "ycb-heading");
    const badge = element("span", "ycb-badge");
    badge.append(icon(), document.createTextNode(t.protected));
    heading.append(element("h2", "", t.comments), badge);
    const card = element("div", "ycb-card");
    card.append(element("h3", "ycb-question", t.question), element("p", "ycb-subtitle", t.introduction));
    const insight = chooseInsight(currentVideo);
    const content = insight[language];
    const note = element("div", "ycb-insight");
    note.append(element("p", "ycb-eyebrow", insight.type === "research" ? t.research : t.reflection));
    note.append(element("p", "ycb-insight-title", content.headline), element("p", "ycb-insight-body", content.body));
    if (insight.type === "research") {
      const details = element("details");
      details.append(element("summary", "", t.details));
      const study = element("div", "ycb-study");
      study.append(element("p", "ycb-citation", insight.citation), element("p", "", content.detail), element("p", "", content.limitation));
      const link = element("a", "", t.source);
      link.href = insight.url;
      link.title = insight.title;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      study.append(link);
      details.append(study);
      note.append(details);
    }
    const actions = element("div", "ycb-actions");
    actions.append(button(t.focus, true, () => transition("hidden", gate)), button(t.reveal, false, () => transition("open", gate)));
    card.append(note, actions);
    gate.append(heading, card);
  }
  function renderAll() { for (const gate of gates.values()) render(gate); }
  function mount(target, placement) {
    let gate = gates.get(target);
    if (!gate) {
      gate = element("section", "ycb-gate");
      gate.dataset.placement = placement;
      gates.set(target, gate);
      render(gate);
    }
    if (gate.nextElementSibling !== target) target.before(gate);
  }
  function sync() {
    queued = false;
    if (suspended) return;
    const nextVideo = videoKey(location.href);
    if (nextVideo !== currentVideo) {
      currentVideo = nextVideo;
      state = "ask";
      root.setAttribute("data-ycb-state", "blocked");
      renderAll();
    }
    const nextLanguage = getLanguage();
    if (nextLanguage !== language) { language = nextLanguage; renderAll(); }
    for (const [target, gate] of gates) {
      if (!target.isConnected || !currentVideo) { gate.remove(); gates.delete(target); }
    }
    if (!currentVideo || navigating) return;
    for (const target of document.querySelectorAll(MAIN)) {
      if (!target.closest(PANEL)) mount(target, "main");
    }
    for (const panel of document.querySelectorAll(PANEL)) {
      const content = panel.querySelector("#content");
      if (content) mount(content, "panel");
    }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    // Run before the next paint, even when a video changes in a background tab.
    queueMicrotask(sync);
  }
  document.addEventListener("yt-navigate-start", () => {
    navigating = true;
    state = "ask";
    root.setAttribute("data-ycb-state", "blocked");
    renderAll();
  });
  document.addEventListener("yt-navigate-finish", () => { navigating = false; schedule(); });
  document.addEventListener("yt-page-data-updated", schedule);
  window.addEventListener("popstate", () => { navigating = false; schedule(); });
  window.addEventListener("pagehide", () => {
    suspended = true;
    state = "ask";
    root.setAttribute("data-ycb-state", "blocked");
    observer.disconnect();
    languageObserver.disconnect();
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    navigating = false;
    observe();
    renderAll();
    schedule();
  });
  const observer = new MutationObserver(records => {
    // Ignore our own rendering and attribute writes to avoid observer feedback.
    if (records.some(record => !record.target.closest?.(".ycb-gate") &&
      (record.type === "attributes" || [...record.addedNodes, ...record.removedNodes].some(node =>
        node.nodeType === 1 && !node.matches?.(".ycb-gate"))))) schedule();
  });
  const languageObserver = new MutationObserver(schedule);
  function observe() {
    observer.observe(root, { childList: true, subtree: true });
    languageObserver.observe(root, { attributes: true, attributeFilter: ["lang"] });
  }
  observe();
  sync();
})();
