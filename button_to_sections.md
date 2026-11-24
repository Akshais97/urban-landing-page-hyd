# Button-to-section mappings

Source: `Urban_Rise_Landing_Page.html`. Deployment copy: `index.html`.

This document records the current destinations and behaviors. To change a mapping, update the HTML/JavaScript and synchronize `index.html` as well.

## Hero and main navigation

| Button or link | Location | Destination | Behavior |
| --- | --- | --- | --- |
| Urbanrise logo | Header | Home — `#home` | Returns to the hero. |
| Home | Header / menu | Home — `#home` | Scrolls to the hero. |
| Benchmarks | Header / menu | Home comparison - `#benchmarks` | Scrolls to the typical-home and LifeScape comparison. |
| Calculator | Header / menu | Carbon calculator - `#carbon-calculator` | Scrolls to the household carbon calculator. |
| Vision | Header / menu | Home evolution — `#vision` | Scrolls to the home-evolution section. |
| Residences | Header / menu | Residences — `#residences` | Scrolls to the residences section. |
| Villa features | Hamburger menu | Villa features - `#release` | Scrolls to the LifeScape feature browser. |
| Home check | Hamburger menu | Home diagnostic - `#version` | Scrolls to the questionnaire. |
| Villa layouts | Hamburger menu | Villa layouts - `#lineup` | Scrolls to the three villa layouts. |
| Register Interest | Hero / hamburger menu | Early-access form — `#ov-join` | Opens the existing modal and returns focus to the originating control on close. The hero link goes to `#access` if JavaScript is unavailable. |
| Join Early Access | Footer | Early-access form — `#ov-join` | Opens the existing modal. |
| Early-access notification (`#accessInvitationOpen`) | Fixed top-right, below header | Existing lead form - `#ov-join` | Appears on each page load, including refreshes, after 25 seconds of visible browsing, then becomes a compact bell. Clicking opens the form. Dismiss or Escape removes the invitation. |
| Open / Close menu — `#menuToggle` | Header | Compact dropdown — `#ov-menu` | The glass panel opens from and retracts toward the toggle. Escape, an outside click, or choosing a link closes it. Escape returns focus to the toggle. |
| Explore Residences | Hero | Residences — `#residences` | Scrolls to the residence gallery section. |
| Explore the development | Hero, desktop arrow | Villa features — `#release` | Scrolls to the first section after the hero. |

## Section buttons

| Button | Location | Destination / action |
| --- | --- | --- |
| Search features | Villa features ? `#releaseSearch` | Filters feature tabs by name or description. Escape clears the search; the first matching feature opens if needed. |
| Energy / Water / Air / Mobility / Nature / Community | Villa features ? `#release` | Selects the corresponding `#release-panel-*` within the section. Arrow keys, Home and End also change the selected feature. |
| Show LifeScape switch | Benchmarks ? `#vswitch` | Toggles all six `#bench` tiles between a typical home and LifeScape. Click, Enter or Space toggles the switch. |
| Household sliders | Carbon calculator (`#carbon-calculator`) | Updates annual totals, category breakdown, per-person emissions and savings equivalents using the calculator's fixed planning assumptions. |
| Petrol / Diesel / Already EV | Carbon calculator | Selects current car fuel; Already EV hides the optional EV-switch control. |
| EV switch | Carbon calculator | Models switching household travel to EV in the LifeScape scenario. |
| Share on WhatsApp | Carbon calculator (`#cc-wa`) | Opens WhatsApp with the current indicative result; the user chooses whether to send it. |
| Copy result | Carbon calculator (`#cc-copy`) | Copies the current estimate to the clipboard and reports success or browser restrictions inline. |
| Answer choices | Home check | Selecting an answer fades into the next question; the final answer shows the result. Repeated clicks during the fade cannot skip questions. |
| Back | Home check (`#versionBack`) | Returns to the previous question with its saved answer selected. |
| Retake | Home check result (`#versionRetake`) | Clears answers and restarts the check. |
| Get early access | Home check result | Opens the existing form (`#ov-join`). |
| Preview early access | Inline Early Access (`#accessForm`) | Validates name and mobile number, then shows a local selection preview. No data is sent. |
| Edit my details | Inline Early Access (`#accessEdit`) | Reopens the form with the entered details and preferences retained. |
| Or chat on WhatsApp | Inline Early Access | Opens `https://wa.me/918943214897` in a new tab (user-provided number: `00918943214897`). |
| 3-bedroom / Larger 3-bedroom / 4-bedroom villa cards | Lineup (`#models`) | Selects the model, fills `#accessModel`, reopens the inline form if needed and scrolls to `#access`. Changing the form model updates the selected card. |
| Explore villa layouts | First-release card (`#project-facts`) | Scrolls to the residence lineup (`#lineup`). |
| Explore Residences | Home evolution — `#vision` | Scrolls to Residences — `#residences`. |
| Explore Residences | Residences — `#residences` | Opens the residence view in `#ov-view`. |
| Floor-to-Ceiling Views | Residences gallery | Changes the gallery view; no section navigation. |
| Natural Materials | Residences gallery | Changes the gallery view; no section navigation. |
| Indoor-Outdoor Living | Residences gallery | Changes the gallery view; no section navigation. |

## Intro, film, and modal controls

The Urbanrise EI summary tabs (`#urbanrise .ei-topic`) select Water, Energy, or Carbon and show the matching target and related systems. Arrow keys, Home, and End navigate the tabs. Each system uses an inline disclosure (`.ei-tech`); click or Enter/Space expands its explanation, with one system open per category. "Explore Urbanrise EI" opens the official Environmental Intelligence page in a new tab.

These controls perform actions rather than navigate to a section.

| Button / control | Location | Action |
| --- | --- | --- |
| Parchment reveal | Hero background | The four-second video plays once and hands off to the matching still. Reduced motion and data saving start on the still. |
| Play / Pause — `#vPlay` | Film player in `#vision` | Starts or pauses the preview. |
| Full screen — `#vFull` | Film player | Toggles fullscreen. |
| Join Early Access submit | Early-access form — `#joinForm` | Validates the fields and displays the existing local confirmation — `#joinDone`. No server submission is currently connected. |
| Close early access | `#ov-join` | Closes the form overlay and restores focus to the opening control. |
| Join early access | Header dropdown — `#ov-menu` | Closes the dropdown and opens the existing form — `#ov-join`. |
| Close approach | `#ov-approach` | Closes the approach overlay and restores focus to the opening control. |
| Close viewer | `#ov-view` | Closes the panorama/residence viewer and restores focus to the opening control. |
