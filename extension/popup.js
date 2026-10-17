(() => {
  "use strict";
  const language = globalThis.chrome?.i18n?.getUILanguage?.() || navigator.language;
  if (/^ko\b/i.test(language)) return;
  document.documentElement.lang = "en";
  document.title = "Pause Before Comments";
  document.querySelector("header span").textContent = "Pause Before Comments";
  document.querySelector("h1").replaceChildren("Video first.", document.createElement("br"), "Your thoughts first.");
  document.querySelector("body > p").textContent = "YouTube comments stay hidden by default. Choose “Yes, show comments” in the comment area to reveal them for this video only.";
  document.querySelector(".status").replaceChildren(document.createElement("span"), "A fresh pause for the next video");
  document.querySelector(".note").textContent = "Research insights and short questions add a little room to a familiar scrolling habit.";
  document.querySelector("footer").replaceChildren("YouTube Comment Block · 0.1.0", document.createElement("br"), "No external data transmission · Independent of YouTube");
})();
