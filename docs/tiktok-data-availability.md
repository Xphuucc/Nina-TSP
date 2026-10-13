# TikTok Shop TSP / TAP data availability review
Reviewed: 2026-10-13. Scope: developer-document data families relevant to Nina Agency Hub, including employee agents. Not a field-complete export of all TikTok documentation.

## Evidence and limitations
Documentation review, approved app scope, market support and a successful live API test are four separate states. No live credentials or API calls were used. All VN app/token tests remain pending. Some pages expose only a JavaScript shell through available retrieval; their full response schemas are not claimed verified. Do not hardcode a visible legacy version as the latest supported version.

Verified = official readable guide/endpoint confirms stated capability; often only partial contract. Review = named endpoint or category found but fields/market/current version not fully read. Blocked = documented SEA restriction for the specific endpoint. Internal = agency-owned records require manual/ERP source. API readiness remains false until app-specific verification.

## Data-family matrix
| Group | Context | Evidence state | Data described | Authorization | Boundary | Official source |
| --- | --- | --- | --- | --- | --- | --- |
| Quyền & tài khoản | TAP | verified | Asset cipher, category ID/name, thị trường | Partner token + partner.authorization.info | Chỉ nhận diện asset; chưa phải dữ liệu GMV. | [Docs](https://partner.tiktokshop.com/docv2/page/get-authorized-category-assets-202405) |
| Catalog & tồn kho | TSP | verified | Product ID, SKU, thông tin listing; số lượng tồn kho qua endpoint tương ứng | Seller authorization + scope product | Search Products trả thông tin chính; dùng Get Product để lấy chi tiết. Quyền đọc và sửa cần kiểm tra riêng. | [Docs](https://partner.tiktokshop.com/docv2/page/search-products-202309) |
| Hiệu suất shop | TSP | verified | GMV, đơn, sản lượng, refunds, traffic và conversion | Shop authorization; Analytics scope | Đọc đúng định nghĩa metric, thời gian và tiền tệ; dữ liệu tổng hợp không cộng thêm vào đơn chi tiết. | [Docs](https://partner.tiktokshop.com/docv2/page/get-shop-performance-202509) |
| Hiệu suất product/SKU | TSP | verified | Product performance, traffic funnel, conversion, channel attribution | TikTok Shop Analytics | Docs v202605 bổ sung dữ liệu product. SKU-specific endpoint và giới hạn riêng cần rà tiếp. | [Docs](https://partner.tiktokshop.com/docv2/page/kpkfccsa) |
| Video & creator attribution | TSP | verified | Video performance, creator open_id/user_name/author_type, engagement | TikTok Shop Analytics | v202605 bổ sung attribution; chỉ dữ liệu trong phạm vi shop được cấp quyền. | [Docs](https://partner.tiktokshop.com/docv2/page/kpkfccsa) |
| LIVE của shop | TSP | verified | Danh sách phiên LIVE và chỉ số liên quan | data.shop_analytics.public.read | Endpoint đã đọc giới hạn room ID cho tài khoản official của seller; không bao phủ mọi LIVE KOL. | [Docs](https://partner.tiktokshop.com/docv2/page/get-shop-live-performance-list-202509) |
| Sản phẩm trong LIVE | TSP | verified | Sale performance theo product trong LIVE official/marketing | data.shop_analytics.public.read | Chỉ phiên shop-related theo mô tả endpoint; không mặc định tất cả affiliate LIVE. | [Docs](https://partner.tiktokshop.com/docv2/page/get-shop-live-products-performance-list-202512) |
| Tìm & đánh giá KOL | TSP | verified | Marketplace profile; content/follower/collaboration/SALES_AND_GMV groups | seller.creator_marketplace.read | Bản đã đọc nói 30 ngày; exact/band và version mới cần kiểm tra. Không đồng nghĩa GMV do Nina tạo. | [Docs](https://partner.tiktokshop.com/docv2/page/get-marketplace-creator-performance-202406) |
| Đơn affiliate seller/creator | TSP | verified | Đơn affiliate và liên kết creator qua các API trong integration guide | Seller hoặc creator authorization riêng + read collaboration | Guide xác nhận order access; chưa đọc đủ field contract/version hiện hành. | [Docs](https://partner.tiktokshop.com/docv2/page/affiliate-integration) |
| Chiến dịch TAP | TAP | verified | Campaign list/detail/product list; create/edit/publish/review capabilities | Read/Manage Affiliate Partner Campaigns | Guide xác nhận API; cần kiểm tra scope/market/version từng endpoint trước triển khai. | [Docs](https://partner.tiktokshop.com/docv2/page/affiliate-integration) |
| Fulfillment chiến dịch TAP | TAP | verified | Số creator bán/quảng bá/hợp tác, sample-request count, product stock/price, commission split | partner.tap_campaign.read + partner token | Danh sách theo product campaign; chi tiết từng creator cần endpoint riêng. | [Docs](https://partner.tiktokshop.com/docv2/page/get-affiliate-campaign-creator-fulfillment-status-list-202501) |
| Đơn TAP / CAP | TAP | review | API Search Tap Affiliate Orders / Search CAP Affiliate Orders được liệt kê | Partner/asset quyền tương ứng: cần đọc hợp đồng API | Trang chi tiết chưa đọc được qua nguồn hiện tại; chưa xác nhận fields, version hay VN availability. | [Docs](https://partner.tiktokshop.com/docv2/page/search-tap-affiliate-orders-202411) |
| Sample application | TSP | verified | Creator/product/order liên quan, status, deadline duyệt/gửi, tracking, fulfillment status | seller.affiliate_collaboration.read | Tách sample order khỏi đơn paid. Request API page size tối đa 50 trong bản đã đọc. | [Docs](https://partner.tiktokshop.com/docv2/page/seller-search-sample-applications-202508) |
| Content statistics TAP | TAP | review | Endpoint content statistics và sample status cần kiểm tra | Quyền theo từng partner endpoint chưa xác minh | Tên endpoint có trong reference; response chi tiết chưa đọc được. | [Docs](https://partner.tiktokshop.com/docv2/page/get-affiliate-campaign-creator-product-content-statistics-202508) |
| Giao dịch tài chính theo đơn | TSP | verified | SKU-level sales, fees, commission, shipping, taxes, refunds | seller.finance.info | Docs ghi all regions; dữ liệu sau 2023-07-01, ngoại lệ US CB. Thực quyền shop VN chưa test. | [Docs](https://partner.tiktokshop.com/docv2/page/get-transactions-by-order) |
| Thanh toán shop | TSP | blocked | Automated payment records theo ngày | Seller finance; giới hạn thị trường | Get Payments được docs ghi không hỗ trợ SEA. Không dùng làm nguồn payout VN. | [Docs](https://partner.tiktokshop.com/docv2/page/get-payments) |
| Return/refund & RMA | TSP | verified | RMA request-level data qua Search RMA | seller.return_refund.basic | Bản v202604 xác nhận RMA; không suy rộng mọi trường refund/market. | [Docs](https://partner.tiktokshop.com/docv2/page/search-return-merchandise-authorization-202604) |
| Order, package & logistics | TSP | verified | Order status, sample/gift mapping; fulfillment/package/tracking workflows | Order Information; Fulfillment Basic và scope theo thao tác | OMS guide xác nhận nhóm chức năng; cần đọc từng response, SLA và masking theo market. | [Docs](https://partner.tiktokshop.com/docv2/page/order-management-system-oms) |
| Promotion & coupon | TSP | verified | Chi tiết discount/flash deal và sản phẩm tham gia | Promotion scope theo endpoint | Một số dữ liệu sản phẩm của activity kết thúc >180 ngày không trả về; coupon qua API riêng. | [Docs](https://partner.tiktokshop.com/docv2/page/get-activity) |
| Customer service/engagement | TSP | review | Buyer message operations; customer support scope có điều kiện | Customer Service; app-category/review/enablement | Docs xác nhận scope có điều kiện. Metrics, conversation read và engagement contract cần rà tiếp. | [Docs](https://partner.tiktokshop.com/docv2/page/hulvi36o) |
| Webhook & offline exports | TSP | review | Inventory/order events; Compass offline export capability | Theo webhook/export và quyền app | Changelog có các capability; chưa xác nhận đầy đủ payload, delivery/retry và export report types. | [Docs](https://partner.tiktokshop.com/docv2/page/nvx9wggt) |
| Chi phí & hồ sơ Nina | Nội bộ | internal | Booking, hợp đồng, rate card, phí dịch vụ, nhân sự/sản xuất, targets | Phân quyền nội bộ | Nhập tay/ERP; chưa có nguồn TTS API được xác minh cho dữ liệu agency này. | Agency/source integration |
| Ads spend / ROAS | Ngoài TTS | review | Ngân sách, spend và attribution quảng cáo chi tiết | Nguồn Ads/GMV Max cần rà riêng | Không coi GMV breakdown là ad spend. Chưa xác minh API Ads trong audit này. | Agency/source integration |
| FBT/cross-border/SPS/reviews | TSP | review | Các nhóm mở rộng có trong docs/changelog | Tùy market/program và endpoint | Không đưa vào MVP VN khi chưa kiểm tra; changelog có SPS dành cho US. | [Docs](https://partner.tiktokshop.com/docv2/page/r1wchdjn) |

## Independent affiliate review
- Search TAP Affiliate Orders 202411: official indexed fragments verify partner.tap_campaign.read and price.amount/currency, quantity, content_type and content_id. Full nesting, keys, date/lookback and settlement fields remain unverified. Price times quantity is not a verified TikTok GMV definition.
- Search CAP Affiliate Orders 202504: official indexed route POST /affiliate_partner/202504/cap_order/search and order-list purpose for MCN/CAP by date range; complete schema, scope/lookback and VN access remain unverified. 202603 could not be verified from an official readable contract.
- Campaign Creator Product Content Statistics 202508: partner.tap_campaign.read indexed; complete content metrics, freshness/lookback and VN support unverified.
- Campaign Creator Fulfillment Status List 202501: documented partner token, product aggregate counters, product price/stock and creator/partner commission percentages; product-detail endpoint is separate.
- Marketplace search includes GMV-range filters, but that does not prove the performance response returns that same band. Exact vs band is field/version-specific; do not present marketplace GMV as Nina-attributed sales.
- Affiliate integration says access is inactive by default and requires Account/Partner Manager approval. Independent seller, creator and partner authorizations are required for their respective resources.
- Official navigation lists Affiliate API Legacy Versions and Endpoints Sunset. Exact replacements/deadlines were not read in this session.

## What Nina can demonstrate now
Data-source explorer with TSP/TAP/department/evidence filters; Manual/API phase previews; account/creator/campaign/product/finance synthetic dashboards already in the repository; employee/BOD workflow simulation. Show evidence boundaries and unavailable data, not live platform numbers or fabricated AI answers.

## Build order
1. Obtain anonymized native exports and a current list of app scopes/approved markets.
2. Ship a shared schema, manual import validation/reconciliation and agency KOL/fee/cost master data.
3. Enable only APIs passing official-contract review plus VN live test and reconciliation.
4. Use shared deterministic KPI tools for BOD and employees; keep their histories/tools/data scoped.
5. Add read-to-write workflows only after audit and user-authorized action previews.

## App-specific verification worksheet
For every endpoint record: document title/URL, path/method/version, entity type, scope, granted token scope, allowed market/account, row grain, stable keys, units/currency/timezone, status enums, lookback/date/page limits, freshness, webhook availability, a redacted test result/request_id and report reconciliation. Absence of any required item means disabled or partial coverage.

## Remaining audit work
Read complete current contracts for TAP/CAP orders, partner content/sample status detail, marketplace newer versions, SKU analytics, customer service metrics/conversations, customer engagement, offline export reports, webhook payloads/retries, seller statements/withdrawals/unsettled transaction versions, FBT/supply-chain and cross-border/reviews/SPS where relevant. These are included as review items, not omitted or promised available for VN.

## Additional employee-source groups confirmed by the user

The demo catalog now contains 28 families. Added manual-first groups:

| Group | Owner | Data |
| --- | --- | --- |
| KOL booking | Nam Tran; Tri Pham for overall Socom | KOL / Brand / Campaign, fee, deliverables and attribution links |
| Leads | Huong Le | Source, stage, owner, follow-up, next action and conversion |
| Invoices | Lin Huynh | Invoice, counterparty, amount/currency, due date and payment state |
| Cashflow | Lin Huynh | Actual/planned receipts and payments, balances and reconciliation |

These agency-owned sources are not claimed available through TTS APIs. Nina Nguyen, Thuc Huynh and Phuc Nguyen have full application access as requested; Phuc's title is Planner, not agency owner. Tri Pham replaces the earlier mistaken name Minh Tri. The role selector is a demo; real identity provisioning and enforcement remain pending.
