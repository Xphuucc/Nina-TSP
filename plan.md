# Nina Agency Hub — Implementation Plan

## Product approach
Nina Agency Hub is a **local-only Vietnamese demonstration workstation** for Phuc Nguyen’s TikTok Shop agency. It is implemented as a static React/Vite application with no server, credentials, external APIs, messages, or transactions. A single deterministic synthetic data module generates 90 days of orders and supplies eight shops, sixteen creators, twelve products, five TAP campaigns, and reconciliation records. Every visible financial total, chart, table, export, and role/time filter is derived from this model. The BOD Assistant is a deterministic Vietnamese simulation that explains the active figures and freshness state without a live Gemma or TikTok connection.

Supported local interactions are intentionally reversible: table search and sorting; role and time filtering; analysis tabs; client creation and editing; creator profile changes; campaign edits and demo status changes; product edits with numeric validation and before/after review; filtered CSV export; a reset-demo action that clears local browser storage; and explanatory integration/status dialogs. User-entered strings are rendered as text nodes, and price/stock fields are validated as nonnegative integers.

## Design direction

- **Design movement — Editorial financial workstation:** inspired by a compact analyst terminal and a modern Vietnamese operations ledger rather than a consumer dashboard.
- **Core principles:** financial clarity before decoration; compact hierarchy that rewards scanning; consistently explicit data state; purposeful controls with no speculative AI scoring.
- **Color philosophy:** a warm off-white workspace (`#F7F8FA`) softens extended review sessions, while a slate sidebar (`#111827`) establishes an operational frame. Nina Orange (`#FF5401`) sampled from the supplied primary logo denotes active actions and chart highlights; amber (`#B45309`) signals review attention without alarm fatigue; charcoal (`#172033`) carries precise numeric content.
- **Layout paradigm:** a persistent left operational rail and a compact command header form a desktop “ledger frame”; content is assembled as irregular editorial bands rather than a centered hero or decorative card grid. On smaller screens, the rail becomes a horizontal mobile navigator and tables retain horizontal scroll within their own containers.
- **Signature elements:** supplied Nina logo artwork; small uppercase ledger labels above important values; thin orange active edge markers and muted dot/status chips.
- **Interaction philosophy:** every control communicates a demonstrable local effect. Form saves surface as local-demo confirmation and never imply an external API call.
- **Animation:** short 120–180ms opacity/translate transitions for dialogs, drawers, and tab changes only; data views avoid animated numeric counters so financial values remain steady and comparable.
- **Typography system:** Inter / system sans-serif. Compact 11–12px uppercase metadata, 13–14px table text, 15–16px operational labels, and 26–32px tabular financial figures. `font-variant-numeric: tabular-nums` is used on numeric fields.
- **Brand essence:** *Nina Agency Hub is the disciplined review desk for a Vietnam-based TikTok Shop agency’s creator, partner, and shop operations.* Personality: precise, grounded, calm.
- **Brand voice:** short Vietnamese operational microcopy that distinguishes demo state from live actions. Examples: “Kho cần xử lý trước phiên LIVE.” and “Thay đổi chỉ lưu trong trình duyệt này.”
- **Wordmark & logo:** use the supplied Nina primary logo artwork with original proportions; use white on the dark sidebar and black/orange variants on light assistant surfaces.
- **Signature brand color:** Nina Orange `#FF5401`, sampled from `Primary_Orange.webp`.

## Information architecture

1. **Tổng quan agency** — a review-first landing view with KPIs, gross/eligible/refund distinction, stacked daily channel chart, revenue mix, leaderboards, and operational alerts.
2. **Phân tích** — filter-aware client/creator/product/campaign tabs with sortable/searchable tables and channel, conversion, orders, and rank context.
3. **Khách hàng** — client operations table, add/edit local modal, and details drawer.
4. **Creator & đối tác** — creator/partner records with attribution, commissions, deliverables, relationship status, and local profile edit drawer.
5. **Chiến dịch TAP** — campaign list, contextual detail, local edit/create, and Draft/Active/Completed status controls with an explicit no-API notice.
6. **Sản phẩm** — catalog, constrained editing for title/description/price/stock/commission, before/after review, and local audit entry.
7. **Tài chính** — commission-state reconciliation, order-level ledger, explicit revenue/profit definition, and cost lines that avoid double counting.
8. **Kết nối & quyền** — synthetic authorization records, capability separation, demo sync timestamp, and future-only integration explainer.

## Project structure

- `client/src/data/demoData.ts` — typed deterministic demo entities, seeded order generation, filtering, aggregation, formatting, and CSV builders.
- `client/src/App.tsx` — application shell, all local state, responsive navigation, page views, tables, charts, modals, drawers, and demo persistence.
- `client/src/index.css` — Nina visual system, responsive layout, compact table treatment, chart, dialog, and BOD Assistant styles.
- `client/public/manus-routes.json` — application route manifest for the SPA shell.
- `README.md` — setup, synthetic-data limitations, local persistence, and future API mapping.
- `TODO.md` — acceptance-oriented delivery checklist for this mockup.

## Serving and release

The application uses the provided static Vite workflow (`pnpm dev:static`, `pnpm build:static`). It intentionally has no database or server feature because all data is generated in the browser and local edits use `localStorage`. The published static artifact is `dist/public`.
