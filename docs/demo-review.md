# Review the Nina company agent demo

Branch: docs/manual-api-data-phases. PR: https://github.com/Xphuucc/Nina-TSP/pull/1

## What changed

Open sidebar pages Dữ liệu & API and Agents công ty. The first includes 24 data-source families, evidence status, TSP/TAP and department filters, official links and manual/API ingestion plans. The second previews BOD and employee workflows for KOL/Affiliate, Account/Sales, Operations and Finance. Model-route choices are illustrative and do not initiate inference or grant permissions. Existing dashboards continue to use synthetic demo records.

## Start locally (Linux or PowerShell)

Prerequisites: Node 22 and pnpm 10.18.0 installed. From a checkout of the PR branch:

```
pnpm install --frozen-lockfile
pnpm exec vite --host 127.0.0.1 --port 3000
```

This uses a direct Vite command instead of the repository's shell-dependent dev:static script. Open http://127.0.0.1:3000. The command is intended to be portable; actual Windows execution has not been verified in this session.

## Vercel demo

vercel.json configures the existing static build and dist/public output. Connect the Xphuucc/Nina-TSP repository to a Vercel project, keep main as the existing production branch, and request a preview deployment of docs/manual-api-data-phases/PR #1. No live model keys are needed for this static demonstration. Deployment has not been executed or verified; no deployment URL is claimed. The Express API, sync worker, database and Ollama gateway are future production components, not hosted by this static config.

## Verification evidence

GitHub Actions run https://github.com/Xphuucc/Nina-TSP/actions/runs/38349847385 on commit 119a9268c915fae4464a61524abcbd8dfd6c91a9 passed type checking, the existing tests and static build, and uploaded nina-company-agent-demo. Application source since that check is unchanged; later additions are docs and static deployment configuration. Local Windows sandbox and browser control could not launch. No visual/mobile/keyboard QA, Windows server run, live TikTok scope test, model inference or production authorization test is claimed.

## Manual UI review to perform

- Open both new sidebar pages; check desktop and 360px layout.
- Change each source, department and evidence filter; selected detail must come from the filtered list.
- Switch Phase 1/2; blocked SEA/internal/unknown capability plans remain correctly labeled.
- Select each employee profile; task, output plan and required sources change. Entering arbitrary text does not claim a model has interpreted it.
- Open official source links; verify current endpoint version and VN support separately in Partner Center.
- Confirm Simulation labels remain visible and no browser network call goes to model/TikTok APIs.

## Next real-data prerequisites

Anonymized reports, developer app scopes and approved market/account evidence; company access policy and identity provider; permitted cloud data classifications; model provisioned on target hardware/API with measured tool/answer quality. Implement common data ingestion and scoped tools before replacing simulated answers.
