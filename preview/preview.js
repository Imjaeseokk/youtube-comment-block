(() => {
  let index = 0;
  document.querySelector("#theme").addEventListener("click", event => {
    const dark = document.documentElement.toggleAttribute("dark");
    event.target.textContent = dark ? "밝은 테마" : "어두운 테마";
  });
  document.querySelector("#next").addEventListener("click", () => {
    document.dispatchEvent(new Event("yt-navigate-start"));
    history.pushState(null, "", "/watch?v=example-video-" + ++index);
    document.dispatchEvent(new Event("yt-navigate-finish"));
  });
  document.querySelector("#panel").addEventListener("click", () => {
    const panel = document.querySelector("ytd-engagement-panel-section-list-renderer");
    panel.hidden = !panel.hidden;
  });
  document.querySelector("#language").addEventListener("click", event => {
    const english = document.documentElement.lang !== "en";
    document.documentElement.lang = english ? "en" : "ko";
    event.target.textContent = english ? "한국어" : "English";
  });
})();
