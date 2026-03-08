# PRD: Floating Corner Mini-Game Widget

## 1. Product Overview
- Product name: Floating Corner Mini-Game Widget
- Platform: Personal website (`itsharsh_site`, Jekyll static site)
- Primary concept: A small, always-available game launcher icon fixed to the bottom-right corner of the viewport
- Core interaction: Click/tap the icon to open a lightweight mini-game panel without leaving the current page
- Key constraint: Must run smoothly on low-end devices and degrade gracefully

## 2. Problem Statement
- Current site experience is informational and static
- A lightweight interactive element can increase engagement and session time
- Traditional full-page games add friction and may hurt page performance, especially on low-end phones

## 3. Goals
- Add a playful, low-friction mini-game to the site
- Keep the game accessible from any page via bottom-right floating icon
- Maintain fast loading and smooth interaction on low-end hardware
- Avoid regressions to existing navigation, content readability, or Core Web Vitals

## 4. Non-Goals
- No multiplayer
- No backend leaderboard or authentication in v1
- No heavy game engines (e.g., Phaser/Unity)
- No full-screen takeover flow as the default mode

## 5. Target Users
- Recruiters and visitors browsing portfolio pages
- Mobile users on low-to-mid range devices
- Users seeking quick interaction (15-60 seconds)

## 6. User Stories
- As a visitor, I can see a small icon in the bottom-right corner so I know a game is available
- As a visitor, I can open the game without navigating away from the current page
- As a visitor on mobile, I can play using touch controls comfortably
- As a low-end device user, I can play without lag spikes or browser freezing
- As a keyboard user, I can open, play, and close the game using keyboard controls

## 7. Success Metrics
- Widget open rate: percentage of sessions that open the game
- Play start rate: percentage of opens that begin gameplay
- Median play duration
- Completion/retry rate per session
- Performance metrics:
- FPS >= 30 on low-end targets
- No long tasks > 50ms during active gameplay on median devices
- Additional JS payload for widget+game <= 80KB minified (before gzip/brotli)
- No measurable degradation of LCP/CLS on pages where widget is present

## 8. Functional Requirements
- FR-1: Display a floating launcher icon at bottom-right on all primary pages
- FR-2: Launcher remains visible while scrolling
- FR-3: Icon opens a compact game panel (popover/modal sheet) anchored near bottom-right
- FR-4: Panel supports start, pause, restart, and close actions
- FR-5: Game loop supports both keyboard and touch input
- FR-6: Panel traps focus while open and returns focus to launcher on close
- FR-7: Escape key closes panel (desktop)
- FR-8: Persist high score locally using `localStorage`
- FR-9: Lazy-load game code on first open to protect initial page load
- FR-10: Auto-pause on tab hidden, resume on visible

## 9. Non-Functional Requirements
- NFR-1: No third-party game framework in v1
- NFR-2: Use Canvas 2D or DOM primitives only
- NFR-3: Minimize memory churn (object pooling where needed)
- NFR-4: Battery-aware behavior for low-power contexts (reduced effects)
- NFR-5: Respect `prefers-reduced-motion`
- NFR-6: Must function in modern evergreen browsers

## 10. UX Requirements
- Launcher placement:
- Fixed position: bottom-right
- Default offset: 16px from right, 16px from bottom (mobile-safe area aware)
- Size:
- Desktop: 52px touch target minimum
- Mobile: 56px touch target minimum
- Visual behavior:
- Subtle idle animation only on capable devices
- No persistent animation in reduced-motion mode
- Game panel:
- Opens above launcher
- Width: 300-360px desktop, full-width bottom sheet style on narrow mobile viewports
- Includes title, score, controls, close button, and short instructions

## 11. Visual Aesthetic Requirements (Site-Matched)
- Design language: minimal, technical, mono-driven look matching current portfolio style
- Typography:
- Must use existing site font stack (`Space Mono`, monospace)
- Button labels and score text should mirror the existing lowercase style where appropriate
- Color system:
- Must reuse existing CSS variables from `_sass/main.scss`
- `--bg-color` for panel background
- `--text-color` for primary text/icons
- `--text-secondary` for helper text and inactive UI
- `--border-color` for widget and panel outlines
- Surface treatment:
- Use dotted borders to match cards/header (`border: 2px dotted var(--border-color)`)
- Rounded corners should stay subtle (6-8px) consistent with current components
- Motion style:
- Keep animations restrained and utilitarian (no flashy easing or bouncy effects)
- Hover/focus interactions should mirror existing transitions (`0.2s-0.3s ease`)
- Icon styling:
- Launcher icon should appear as a small retro terminal/game glyph in single color line-art
- Avoid gradients, glows, or neon effects in default theme
- Dark mode parity:
- Widget and game panel must automatically inherit dark-mode via root variables
- No separate hardcoded dark palette
- Interaction polish:
- Use underline and dotted-border cues consistent with existing links/cards
- Ensure icon and panel do not visually overpower page content

## 12. Accessibility Requirements
- Keyboard-operable launcher and panel controls
- ARIA labels for launcher and buttons
- Focus order and visible focus ring preserved
- Contrast ratio >= WCAG AA for text and controls
- Reduced-motion compliance
- Announce score updates with polite live region only if non-intrusive

## 13. Performance Strategy for Low-End Devices
- Capability detection inputs:
- `navigator.hardwareConcurrency`
- `navigator.deviceMemory` (if available)
- `window.devicePixelRatio`
- Runtime frame-time sampling
- Adaptive quality tiers:
- Low tier:
- Render scale 0.75
- Reduced entity/effect cap
- Disable expensive shadows/particles
- Target FPS: 30
- Medium tier:
- Render scale 0.9
- Moderate effects
- Target FPS: 45-60
- High tier:
- Full scale
- Full effects budget
- Target FPS: 60
- Main-thread safeguards:
- Fixed timestep loop
- Delta time clamp
- Pause updates when hidden
- Defer non-essential work with `requestIdleCallback` fallback

## 14. Technical Design (v1)
- Files:
- `itsharsh_site/_includes/floating-game-widget.html`
- `itsharsh_site/assets/js/floating-game-widget.js`
- `itsharsh_site/assets/js/mini-game.js` (lazy-loaded)
- `itsharsh_site/_sass/main.scss` additions for widget/panel styles
- Integration points:
- Include widget partial in `_layouts/default.html`
- Keep existing global scripts unchanged; game scripts isolated
- Data persistence:
- `localStorage` keys:
- `mini_game_high_score`
- `mini_game_quality_tier`

- Required style contract:
- Add `.floating-game-widget` and `.floating-game-panel` selectors in `_sass/main.scss`
- Reference only shared CSS variables for colors and borders
- Keep z-index below critical overlays but above content cards

## 15. Analytics and Observability
- Events (privacy-safe, no PII):
- `game_widget_impression`
- `game_widget_open`
- `game_start`
- `game_end`
- `game_restart`
- `game_close`
- Perf diagnostics (sampled):
- average frame time
- dropped frame count
- selected quality tier

## 16. Edge Cases
- Small viewport with virtual keyboard open
- iOS safe-area overlap with home indicator
- User disables JavaScript
- `localStorage` unavailable/private mode restrictions
- Background tab throttling

## 17. Rollout Plan
- Phase 1: Internal implementation behind feature flag (`enableMiniGame: false` default)
- Phase 2: Enable on desktop only, monitor performance and UX
- Phase 3: Enable on mobile with conservative default quality tier
- Phase 4: Optimize based on frame-time and interaction data

## 18. Acceptance Criteria
- AC-1: Floating icon is visible and clickable on all core pages
- AC-2: Game opens within 300ms after first code load and under 100ms on subsequent opens
- AC-3: Low-end Android test device maintains >= 30 FPS median during 60-second session
- AC-4: No layout shift introduced by icon/panel mount (CLS neutral)
- AC-5: Keyboard-only user can open, play basic loop, and close without pointer
- AC-6: Reduced-motion mode disables non-essential animation
- AC-7: If game fails to initialize, UI recovers and allows close without page refresh
- AC-8: Widget/panel colors, borders, and typography match existing site theme in both light and dark modes

## 19. Risks and Mitigations
- Risk: Global script contention causing jank
- Mitigation: Strict lazy-loading and isolated event listeners
- Risk: Floating widget obstructs content/actions on small screens
- Mitigation: Responsive offsets, collision checks, and optional minimize behavior
- Risk: Battery drain from continuous animation
- Mitigation: Idle animation throttling and pause when hidden/inactive

- Risk: Game UI looks visually disconnected from the portfolio brand
- Mitigation: Enforce shared variable usage and style review checklist before release

## 20. Open Questions
- Should launcher be shown on every page or excluded on content-dense pages?
- Should high score be visible in launcher tooltip when panel is closed?
- Should game state persist between page navigations in same session?
- Should this be discoverable through nav, or remain an ambient hidden gem only?

## 21. Proposed v1 Scope Lock
- Single mini-game mode
- Floating launcher + compact panel
- Local high score only
- Adaptive quality with at least 2 tiers (low/default)
- No backend dependencies
