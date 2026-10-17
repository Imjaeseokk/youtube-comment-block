# Reviewer notes · 0.1.0

## Single purpose

Hide comments on YouTube watch pages until the user explicitly chooses to view them for the current video. Reflection prompts and cited research insights support that same deliberate choice.

## Host access justification

The static content script runs on `https://www.youtube.com/*` to locate comment containers, hide or reveal them, and insert the choice UI. YouTube navigates from home/search to watch pages within the same document, so the script must also be present on non-watch routes on that host. The current URL’s video ID is used transiently in memory to reset consent on video changes and select a prompt. The script does not run on other hosts and does not extract, store, or transmit comment text or browsing history records.

The manifest declares no `permissions` or `host_permissions` array. If a host justification field is shown for `content_scripts.matches`, use the explanation above. No tabs, storage, scripting, history, cookies, webRequest or activeTab API permissions are used.

## Remote code

No remotely hosted code. All JavaScript, CSS, icon artwork, and prompt text are bundled. There are no remote script/style loads, eval calls, analytics, or AI services. User-clicked DOI links navigate to external research pages; they are not executable extension resources.

## Data disclosure recommendation

Disclose **Web history** and **Website content** for limited on-device processing: the current YouTube URL/video ID and comment-container DOM structure. No full browser history database is accessed, no comment text or author information is extracted into records, no user data is persisted or sent to the developer. Button choices exist only as temporary UI state. No user profiling, advertising, or activity logs.

These are recommended disclosure choices based on the implementation and Chrome’s requirement to disclose local processing. Do not replace them with an unqualified “handles no user data” statement.

## Test instructions

No account or license for the extension is required. Open an ordinary public YouTube watch page with comments enabled after installation; refresh a pre-existing YouTube tab.

1. Scroll to the comments area and verify that comment text is hidden behind the choice UI.
2. Choose Focus on the video. Comments remain hidden.
3. Choose Choose to view comments. The question returns, without revealing comments yet.
4. Choose Yes, show comments. Comments for this video appear.
5. Choose Hide again to restore the question and hide comments.
6. Navigate to another video or use browser history. A fresh choice is required.
7. Research prompts have a Study and source disclosure with context, limitations, and a DOI link. Other prompts are reflection questions. The selected prompt is stable for the current video ID.
8. Test light/dark YouTube themes and the comments side panel.

Shorts, live chat, mobile web and native mobile apps are outside the supported scope. Content visibility is controlled; comment network requests are not blocked.

## Current validation boundary

Automated DOM checks and the local fixture demonstrate the script behavior. The supplied screenshots are visibly labeled local demonstration screens using the actual content scripts. An installed-extension check against live YouTube is still required before final submission.
