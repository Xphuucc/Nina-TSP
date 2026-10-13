# Nina Agency Hub — data update phases

Status: implementation specification; ingestion and live API sync are not implemented by this document.

## Goal

Phase 1 accepts manually uploaded reports and agency-owned financial entries. Phase 2 adds authorized TikTok Shop API synchronization. Both feed a canonical data layer used by dashboards and the BOD assistant. Preserve Nina orange branding and keep synthetic demo records isolated from real records.

## Current repository

The dashboard lives in client/src/App.tsx and derives figures from client/src/data/demoData.ts. Edits persist in browser localStorage. drizzle/schema.ts currently contains only the user table. The BOD assistant is a deterministic simulation. Shared production storage, ingestion, and live model connectivity must be implemented and verified before claiming real-data support.

## Phase 1: manual update

Add a Data Updates screen with Manual Import and API Connection tabs. The manual flow is: choose client/account and report type, upload CSV/XLSX, map columns, validate, preview inserted/updated/skipped/conflicting rows and control totals, then confirm. Start implementation with canonical UTF-8 CSV templates; add native TikTok export mappings and XLSX parsing after inspecting representative anonymized files. Do not claim arbitrary TikTok exports are supported before verifying their columns and semantics.

Supported domains: order lines, daily shop metrics, product catalog, creator/campaign attribution, commission records, and agency fee/cost ledger. Each report template declares its grain, required fields, source account, reporting period, currency, and timestamp semantics. Missing metrics remain null/unavailable, never fabricated or converted to zero. Conversion rate requires defined numerator/denominator; do not sum or average per-row percentages without weighting.

Validate headers, exact identifiers as strings, dates/timezone, currency precision, monetary units, status mappings, duplicate keys and cross-entity links. Unknown shops/creators enter an explicit mapping step. No ambiguous matches by display name. Restrict file size/type, render imported strings as text and neutralize spreadsheet formula injection on CSV export. Perform authoritative validation on the server.

Persist batches, source file digest, actor, mapping version, row errors, import time, source report period and original records in shared storage. Commit validated data atomically. Reimporting the same file must be idempotent. Corrected reports produce revisions. Rollback restores prior revisions only where no subsequent accepted update would be overwritten; otherwise show conflicts. Restrict imports/rollback to authorized roles.

Keep management fees, booking/service revenue, creator costs, ad costs and production/LIVE costs in an agency-owned ledger with effective dates and currency. They remain manually maintainable after Phase 2.

## Canonical data contract

Separate entity tables (clients, shops, creators, partners, products/SKUs, campaigns) from facts (order lines, commission entries, daily analytics, agency ledger). Store a client-shop relationship allowing multiple shops per client. Associate each fact with source, account/market, external identifiers, observation time, effective time, reporting timezone/currency, batch/run and lineage. Keep business-line attribution explicit: a shop can participate in multiple business lines, so role-specific views must not duplicate orders in the agency total.

Maintain raw observations and normalized revisions separately. Store money as exact decimal or integer minor units with currency; never use floating-point arithmetic for the production ledger. Store large TikTok IDs as strings.

A canonical order-line key uses market, shop identifier, order identifier and the platform line-item identifier. If a report has no stable line-item ID, use a documented source-specific grain or quarantine ambiguity; order+SKU alone can collapse multiple distinct lines. API/CSV adapter names must not form part of the canonical identity, otherwise the same order would be counted twice. Attribution and commission may be separate facts linked to that order line.

Daily aggregates do not add to order-line totals. Select one compatible source per metric and period. Define GMV semantics, refunds/cancellations and order-count grain per source before reconciling. Estimated/pending/settled/ineligible/frozen commissions remain distinct. GMV is not agency revenue; settlement is not the same as revenue recognition.

Dashboard and assistant show reporting period, source coverage, last successful update, missing-data warnings and links to supporting facts. Demo mode and real mode never mix.

## Phase 2: authorized API sync

Create separate seller, creator and partner authorization connections. Keep tokens encrypted server-side, refresh them, verify granted scopes and account identities, and honor revocation. Never commit credentials or include them in browser bundles.

The supplied Get Authorized Category Assets endpoint is GET /authorization/202405/category_assets. It requires partner.authorization.info and a partner access token (user_type=3), plus signed requests. It returns category assets with cipher, category and target_market; it does not return sales/GMV/orders/commissions. Reference: https://partner.tiktokshop.com/docv2/page/get-authorized-category-assets-202405

Use the returned asset cipher only for applicable partner APIs. Seller shop_cipher and creator authorization are distinct. Confirm VN availability, approved scopes, current endpoint versions, pagination and historical limits before implementing each adapter. Do not assume Partner Center UI access implies API access.

Discover authorized assets/accounts, then backfill verified order/commission/catalog/analytics endpoints in supported date windows. Run incremental sync in a background worker, checkpoint successful pages/windows, use bounded retries with backoff/rate-limit handling, and periodically revisit recent orders for returns and settlement changes. Webhooks supplement sync only where documented and authorized; verify signatures and process events idempotently. Record failures and partial coverage without advancing an incomplete checkpoint or presenting stale data as fresh.

## Reconciliation between phases

Match manual and API observations by canonical identity. Preserve every source observation. Prefer a verified direct API observation for platform-owned fields only when its effective version is newer and coverage/semantics match; API source alone does not override a more recent record. Same-version conflicts go to reconciliation. A missing API field is not an instruction to erase a manual value. Agency-owned financial fields never get overwritten by platform sync.

Do not infer deletion from absence in partial API results. Retain last-known data with a freshness warning during outages. Only reconcile a manual aggregate to API detail after proving equivalent scope and metric definition.

## Delivery sequence and verification

1. Inspect anonymized export files; freeze the first report templates and metric definitions.
2. Build shared persistence, validated CSV import preview/commit/history and agency ledger; connect real-mode dashboard queries.
3. Add XLSX/native export adapters and rollback/reconciliation after mapping verification.
4. Verify partner/seller/creator authorization and one VN account's API access.
5. Add API backfill/incremental sync and reconciliation with previously imported records.
6. Connect the BOD assistant to read-only metric tools with evidence and coverage metadata. Live Gemma model selection is a separate verified integration; the demo assistant must retain its Simulation label until replaced.

Required tests: duplicate file import; corrected records; same order via CSV and API counted once; repeated SKU lines; large IDs; invalid money/date/missing columns; zero vs missing metrics; multi-business-line totals; source conflicts; refunds and settlement revisions; scoped client access; rollback after later updates; partial sync failure; expired tokens; pagination and retries; dashboard/assistant evidence and financial totals. Run type checking, targeted tests and the static build before shipping code. Never use production imports or live write APIs as test fixtures.
