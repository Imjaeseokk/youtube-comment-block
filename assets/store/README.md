# Chrome Web Store assets

Prepared 2026-10-17. Specifications: [official image requirements](https://developer.chrome.com/docs/webstore/images).

| File | Format | Purpose |
| --- | --- | --- |
| `store-icon-128.png` | 128×128 RGBA PNG | Required store icon; transparent padding, 96px visible artwork |
| `screenshots/01-choice-light.png` | 1280×800 RGB PNG | Default hidden comments and explicit choice |
| `screenshots/02-research-source.png` | 1280×800 RGB PNG | Expanded research source and limitations |
| `screenshots/03-focus.png` | 1280×800 RGB PNG | Choosing to keep comments hidden |
| `screenshots/04-comments-open.png` | 1280×800 RGB PNG | Comments revealed and Hide again control |
| `screenshots/05-choice-dark.png` | 1280×800 RGB PNG | Dark-theme choice UI |
| `screenshots/en/01-choice-light.png` | 1280×800 RGB PNG | English-language listing screenshot |
| `promotional/small-440x280.png` | 440×280 RGB PNG | Required small promotional tile |
| `promotional/marquee-1400x560.png` | 1400×560 RGB PNG | Optional marquee tile |

## Provenance and status

Screenshots are browser captures of the local demonstration fixture running the **actual** `extension/content.js`, `content.css` and `insights.js`. A visible local-sample label prevents them from being mistaken for live YouTube installation evidence. They accurately demonstrate the choice controls but do not prove compatibility with current live YouTube. Replace with live-site captures after installed-extension validation before final submission if appropriate. `screenshots/provenance.json` records the source and states.

The five icon candidates have transparent backgrounds, no shadows, no rotation and exactly three unequal horizontal comment lines. They use black, white and #FF0033. Promotion tiles and UI captures are opaque canvases for their store slots; their canvases are separate from the transparent icon artwork.

Candidate 04 was selected by the user and is applied to the extension and store assets. Its bubble is about 13% smaller than the previous draft and its prohibition strokes increased from 34 to 38 units (about 12% thicker). Use `npm run assets -- 05` (01–05) to switch, then run `npm run assets:check` and `npm run package`. The canonical SVGs and all export sizes are in `assets/branding/candidates/`. The gallery’s checkerboard is a transparency preview and is not part of the icon files.

Registration answers: `docs/store/submission.ko.md`. Full source ZIPs and the submission kit are generated under `release/0.1.0/`. These files have not been uploaded to the Chrome Web Store.
