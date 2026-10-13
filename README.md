# AgencyOS — interactive Vietnam TikTok Shop agency mockup

AgencyOS is a **Vietnamese-language local demonstration dashboard** for a TikTok Shop agency that works across MCN, TAP, and TSP. It is intentionally a reviewable product mockup, not an integration or a financial system of record.

## Run locally

```bash
pnpm install
pnpm dev:static
```

Open the address printed by Vite. To produce the deployable static output:

```bash
pnpm build:static
```

The result is placed in `dist/public`.

## What is included

The app contains a deterministic synthetic model with eight fictional shops, sixteen fictional creators/partners, twelve fictional products, five fictional TAP campaigns, and 90 days of generated order records. Total GMV, commission states, revenue mix, charts, rankings, financial reconciliation, role filters, period filters, and CSV exports derive from the same model.

Local edits for clients, creators, campaigns, and products persist in the browser’s `localStorage`. **Đặt lại demo** clears those changes. There is no arbitrary product deletion.

## Demo limitations

Every screen is marked **“Dữ liệu mẫu · Chưa kết nối TikTok Shop.”** The app deliberately does **not** contain TikTok credentials, OAuth, live shop data, real customer personal details, messages, transactions, or a sync action. The “Kết nối TikTok Shop” control is an explanatory future-integration dialog only.

All product catalog, order, commission, owner, and contract values are fictional and must not be used for bookkeeping or operational decisions. GMV is displayed separately from agency revenue; contribution profit is computed from the documented synthetic revenue/cost bridge.

## Planned API mapping (not implemented)

| Future domain | Separate consent/capability required | Proposed AgencyOS result |
| --- | --- | --- |
| Seller shop operations | `shop_cipher` | Read shop/catalog/order scope; seller price and inventory changes remain seller actions. |
| TAP partner assets | `category_asset_cipher` | Read partner category/asset scope for campaign association. |
| Creator records | Creator authorization | Read creator-approved attribution or commission data only. |
| Finance reconciliation | Agency-owned ledger plus confirmed settlement events | Match order-level commissions without treating GMV as revenue. |

A production version should use explicit OAuth consent, least-privilege scopes, encrypted credential storage, auditable sync timestamps, idempotent webhook handling, and a real reconciliation ledger. None of those systems are present in this demo.
