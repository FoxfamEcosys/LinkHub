# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Latest splash reference: codex-clipboard-2af2775e-d420-4f3e-9e0e-b62019e3d201.png. Match oversized three-line left heading, pill navigation, full-height right artwork over periwinkle sweep, and wide bottom link bar. Keep supplied Veri artwork byte-identical; do not substitute the pirate character from the reference. Preserve interior window layout and editor behavior.

Links: radial platform icons expand into named pills on hover and keyboard focus; touch first tap reveals, second opens. Use exact destinations recovered from https://verivt.stream/links on 2026-10-07, including event labeled TwitchCon 2025. Preserve the surrounding window and splash.
