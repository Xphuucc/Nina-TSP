# Nina Company Agents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. User selected working with the primary agent; parallel agents are used only for bounded review.

**Goal:** Deliver a portable, evidence-grounded company assistant for BOD and employees, with manual-first data ingestion and verified TSP/TAP API expansion.
**Architecture:** Keep Node/TypeScript + Express/tRPC + MySQL. Shared data/KPI tools enforce access; one runtime selects a department prompt and a tested cloud/local provider.
**Tech Stack:** Existing React/Vite, Node 22, Drizzle/MySQL, Zod, Vitest. Avoid new infrastructure until needed.
**Spec:** docs/company-agents-system-design.md; docs/data-update-phases.md; docs/prompts/nina-company-agents-v0.1.md.

## Global constraints
- Synthetic and real data must not mix.
- Department/profile selector is not an entitlement grant.
- Local-only full payload must not leave an approved local inference route.
- IDs stay strings; production money uses exact arithmetic with currency.
- No live platform mutations or outbound messages in read-only agent MVP.
- Windows/Linux portability remains unverified until build/run on target environments.

## Review focus
- Missing costs: profit remains unavailable.
- Duplicate order observations and repeated SKU lines: no double-counting or line collapse.
- Changed permissions/history/cache: denied data cannot persist into answers.
- Provider capability and upstream fallback differences: enforce policy on every model call.
- Market/endpoint/version mismatch: no API adapter enabled from a title alone.

### Task 1: capability review demo
Files: shared/dataCapabilities.ts; client/src/components/DataCapabilities.tsx/.css; client/src/App.tsx.
- [ ] Add verified/review/blocked/internal source catalog and native department/phase filters.
- [ ] Add sidebar page; preserve existing synthetic dashboard.
- [ ] Check type compilation, build, narrow layout and filter/selection behavior; links must use exact official URLs.
Deliverable: reviewable data-source explorer; no live API claim.

### Task 2: employee agent demo
Files: client/src/components/CompanyAgentsDemo.tsx; client/src/App.tsx.
- [ ] Add BOD/KOL/Account/Operations/Finance workflow examples with explicit simulation and access-design labels.
- [ ] Show factual metrics only from current synthetic data, or display an evidence/query plan without invented figures.
- [ ] Verify selected profile changes suggested tasks; unsupported questions do not produce a fabricated business answer.
Deliverable: employee/BOD workflow prototype, not live AI or real RBAC.

### Task 3: production access and manual data
Files: drizzle/schema.ts; server/auth/*; server/data/*; server/routers.ts.
- [ ] Add company OIDC, department/client/account entitlements and server-only field projection.
- [ ] Write scoped-access/role-change tests; implement canonical entities, facts, batch/revision/audit tables with migrations.
- [ ] Implement validateImport -> ImportPreview and commitImport -> BatchResult; prove duplicate/revision/rollback behavior on anonymized fixture files.
- [ ] Run pnpm check, targeted Vitest, database migration tests and pnpm build.
Deliverable: shared real data with validated manual imports; see data phase specification for complete contract.

### Task 4: provider gateway and read tools
Files: server/agents/provider.ts, policy.ts, tools.ts, output.ts; corresponding server tests.
- [ ] Define server-owned ModelRoute and EffectiveScope contracts; build OpenRouter/Ollama adapters without replacing existing Manus helper callers.
- [ ] Implement coverage/metric/KOL/commission read tools with scope enforcement and snapshot metadata.
- [ ] Test deadlines, errors, capability mismatch, whole-payload classification, Ollama cloud disable and upstream provider restrictions.
- [ ] Integrate protected tRPC agent endpoint, trusted prompt profiles and evidence-reference validation.
Deliverable: real read-only agent responses; no exact model ID before provisioning verification.

### Task 5: evidence evaluation and deployment
Files: server/agents/evals/*; scripts/*; deployment/*; Dockerfile.
- [ ] Freeze 30 Vietnamese business questions and authorized fixture results with exact metric assertions.
- [ ] Evaluate numerical/evidence correctness, denials, missing data and prompt injection; compare selected providers on useful prose, latency and cost.
- [ ] Add Node launch scripts for PowerShell portability and separate worker entrypoint; verify on actual Linux and Windows host configurations.
Deliverable: measured agent quality and deployable target-specific package.

### Task 6: authorized TikTok sync
Files: server/integrations/tiktok/*; server/jobs/*; tests.
- [ ] Capture app/token scopes and VN endpoint tests before selecting versioned adapters.
- [ ] Implement pagination/backfill/checkpoints/retries and idempotent webhook intake where verified.
- [ ] Reconcile manual/API observations; compare dashboard totals to source reports with compatible grain.
Deliverable: verified API data coverage; unsupported/unknown domains remain disabled.
