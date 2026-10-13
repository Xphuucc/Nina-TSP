# Nina company agents — system design and feasibility
Status: proposed design based on the current repository and official provider/API documentation. This document does not implement or verify live inference, deployment or TikTok data access.

## Intended outcome
Nina Agency Hub combines dashboards, Phase 1 manual imports, Phase 2 authorized API sync and Vietnamese company agents. BOD asks business questions and receives concise answers grounded in the same KPI layer as the dashboard. Other departments use scoped views and agent profiles over shared KOL/client/campaign data. Support Linux and Windows servers; use OpenRouter, a verified direct API or local Ollama without rewriting domain tools.

## What the repo already provides
React/Vite UI, Vietnamese synthetic agency data, a simulated BOD assistant, Express/tRPC backend, Drizzle/MySQL user schema and a Node 22 Dockerfile. server/_core/llm.ts currently calls MANUS_API_URL/MANUS_API_KEY and is not a provider-neutral company agent. server/routers.ts has no business-data or agent routes. Existing auth uses Manus OAuth. Data ingestion, department permissions, evidence tools and portable production authentication remain work to implement.

## Deployment
Keep the current Node/TypeScript and MySQL stack for the initial version.
- Web UI and API: one service initially; static UI can optionally deploy on Vercel, with the company API reachable through authenticated HTTPS.
- Worker: separate process for imports/API sync/scheduled insights. Use database-backed jobs with leases, checkpoints and bounded retries first; add a dedicated queue only when concurrency warrants it.
- Database: shared MySQL with scoped business tables, migration history and backups.
- Inference: OpenRouter/direct API or a private Ollama endpoint. GPU is optional when using cloud inference.
- Reverse proxy: authenticated TLS access, request limits and logs.

Linux: use the existing Docker foundation, then add worker/database deployment definitions and readiness checks. Windows: either native Node plus reachable MySQL and native Ollama, or a supported Linux-container environment such as WSL2/Docker Desktop where available. Do not assume all Windows Server editions support this route. Existing shell-style NODE_ENV assignments and PORT defaults in package.json are not portable to PowerShell; replace them with Node launch scripts before claiming native Windows support. Do not assume a browser on another host can reach localhost Ollama. From a container, localhost is the container, not the host; configure the private endpoint correctly.

Existing Manus OAuth is not automatically portable standalone company login. Add configurable company OIDC sessions; preserve demo mode separately. No public business-data or agent endpoint before server-side authentication/authorization is in place.

## Request pipeline
1. Authenticate the user and resolve company, departments, permitted clients/accounts and field-level access server-side.
2. Resolve the selected agent profile and allowed model/provider; policy is configuration, not user chat text.
3. Resolve the request's client/KOL, reporting period and metric definitions. Ask a concise clarification only when ambiguous.
4. Execute allowlisted typed read tools against scoped data. The model can request a tool; it cannot execute SQL, change identity or widen access.
5. Collect evidence objects with query IDs, metric definitions, exact values, time/currency, source coverage and observation timestamps.
6. Have the model explain tool results using the company prompt and selected department profile.
7. Validate response schema and evidence references; render numbers/charts directly from trusted evidence. Unsupported numerical claims require repair or an insufficient-data answer.
8. Store an access-controlled audit trace: user, profile, provider/model, prompt version, allowed tool calls, evidence IDs, coverage and final response.

A low temperature alone does not guarantee numerical correctness. Prompt compliance is not authorization. Use database predicates and output-field projection on every tool. Histories, document retrieval and caches must use the same access scope and be invalidated when permissions change.

## Model gateway
Support a small server-owned provider registry: provider ID, base URL, model ID, API-key secret reference, timeout, token limit, capabilities and allowed data classifications.
- OpenRouter: https://openrouter.ai/api/v1; exact model IDs and tool support are verified at provisioning.
- Ollama local: private http://127.0.0.1:11434/v1 for same-host native use; configure private network address for other deployment shapes. Its OpenAI API support is partial.
- Direct provider: use a separately tested adapter. An OpenAI-shaped request does not prove identical support for response_format, tools, thinking, token parameters or errors.
Keep provider credentials off the browser. Base URLs are administrator configuration, never chat/file input. Configure a private-network allowlist for intentional local inference.
Native tool-capable models use a bounded tool loop. Text-only models use backend-selected evidence and summary-only generation, labeled with their capability; do not pretend tool calling worked. Initial limits: 4 tool rounds, 8 tool calls total and a per-request deadline. Timeout/authentication failure produces an explicit error or an approved fallback, not a fabricated answer.
Fallback respects department data policy: local-only confidential data cannot silently route to OpenRouter. Retry only suitable transient errors within the deadline; track token usage and per-department budgets. Start with one verified cloud model and one verified local model, then benchmark Gemma/DeepSeek/GLM variants instead of assuming interchangeable quality.

## Shared tools and evidence
First implement:
- getDataCoverage(scope, period)
- getAgencyMetrics(scope, period, metricIds)
- rankKols(scope, period, metricId, limit)
- getKolPerformance(scope, period, kolId)
- compareCampaigns(scope, period, campaignIds)
- getCommissionReconciliation(scope, period)
All scope comes from the trusted session. Each tool returns structured evidence, never prose alone.
A tool evidence record has evidenceId, queryId, metricDefinitionVersion, period with timezone, currency, requestedScope, effectiveScope, completeness, lastSuccessfulUpdate, rows, sourceGrain and sourceRefs.
Allow unavailable/null separately from zero. Preserve decimal monetary values as strings or exact integers and let the metric layer calculate. No default assumption that total commission equals Nina commission.

## Department agent profiles
One runtime with profiles initially, not a separate autonomous model fleet.
| Profile | Typical purpose | Default data |
| --- | --- | --- |
| BOD | Agency health, portfolio changes, contribution profit, priorities | Company-wide business metrics under explicit BOD entitlement; restricted HR data remains separate |
| KOL/Affiliate | Creator matching, campaign performance, booking efficiency | Assigned creators/campaigns; negotiated rate visibility separately granted |
| Account/Sales | Client reports, targets, proposals | Assigned clients and approved commercial fields |
| Operations | Deliverables, LIVE/video progress, imports and quality | Assigned operational records; hide unauthorized financial/PII fields |
| Finance | Fees, payouts, settlement reconciliation, margin | Authorized finance ledger; wider access is explicit |
Admin configures access and providers; administration does not automatically grant business-data access. Add other departments through tool/profile contracts. Read-only agents first. Draft recommendations never send messages, change products or transfer money without a separate authorized workflow.

## KOL data boundaries
Maintain company-owned KOL master records: canonical ID, account mapping, specialties, relationship owners, rate cards, contracts, brief history, deliverables and consent/access metadata. Manual reports and authorized affiliate orders add attributed performance.
Get Marketplace Creator Performance exposes marketplace information and a SALES_AND_GMV group for the last 30 days in the documented version; newer versions and access must be checked. Some marketplace fields may be bands rather than exact values. Keep marketplace-wide GMV distinct from Nina-attributed GMV and do not sum rolling snapshots.
CAP/TAP and creator/seller affiliate order endpoints are candidates for detailed attribution within authorized scopes. This is not guaranteed access to every KOL's entire TikTok sales history or every country. Get Authorized Category Assets only discovers partner assets; it does not provide GMV.
Cross-account identity resolution requires stable TikTok identifiers and explicit links. Username changes are not new people; same-order observations across seller/creator/partner sources do not create multiple agency orders.

## Reliability and BOD output
Version the system prompt, profiles, tool schemas and metric dictionary. Keep definitions for paid GMV, gross GMV, eligible GMV, refunded GMV, agency income, commission estimate/settlement and contribution profit.
Answer structure: decision-oriented conclusion; cited figures and comparable period; observed drivers; hypotheses distinctly labeled; up to three next actions with owner/measurement; coverage/freshness.
Charts use query-backed data in the UI, never model-written chart code or arbitrary SQL. For causal questions, describe observed decompositions and avoid inferring causation from correlation. Never present hypothetical recommendation scenarios as forecasts or confirmed outcomes.

## Verification gate
Build a 30-question Vietnamese evaluation set from BOD requests with deterministic fixtures, expected query scope, period, metric results and evidence IDs. Include cross-department denial, missing booking cost, partial sync, changed access, repeated order lines, overlapping roles, prior period zero, GMV ranges and hostile instructions inside KOL briefs.
Mandatory checks: permitted data only; no unsupported evidence IDs; metric answers match trusted values and rounding rules; null is not zero; cloud routing obeys classification. Evaluate refusal/clarification/insufficient-data behavior as well as summaries. Compare models on this dataset, latency and cost; no live-model quality claim until measured.

## Pending inputs
Server OS/version; CPU/RAM/storage; GPU/VRAM if available; expected concurrent users; company identity provider; approved department visibility; anonymized reports; TikTok developer scopes; permitted cloud data categories; provider keys via server secrets. These determine sizing and provisioning, not whether the architecture is feasible.

## Official sources checked 2026-10-13
- OpenRouter tool calling: https://openrouter.ai/docs/guides/features/tool-calling
- Ollama OpenAI compatibility: https://docs.ollama.com/api/openai-compatibility
- Ollama tool calling: https://docs.ollama.com/capabilities/tool-calling
- Ollama platform setup: https://docs.ollama.com/windows and https://docs.ollama.com/linux
- TikTok creator marketplace performance: https://partner.tiktokshop.com/docv2/page/get-marketplace-creator-performance-202406
- TikTok asset authorization: https://partner.tiktokshop.com/docv2/page/get-authorized-category-assets-202405
