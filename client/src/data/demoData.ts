export type BusinessLine = "MCN" | "TAP" | "TSP";
export type RoleFilter = "Tất cả" | BusinessLine;
export type PeriodDays = 7 | 30 | 90;
export type Channel = "VIDEO" | "LIVE" | "PRODUCT_CARD";
export type OrderStatus = "eligible" | "refunded" | "canceled";
export type CommissionStatus = "estimated" | "pending" | "settled" | "ineligible" | "frozen";

export interface Shop {
  id: string;
  clientId: string;
  name: string;
  line: BusinessLine;
  owner: string;
  authorization: "Đầy đủ" | "Sắp hết hạn" | "Chưa ủy quyền";
  expiresAt: string;
  serviceFeeMonthly: number;
  gmvTargetMonthly: number;
  feeModel: string;
}

export interface Client {
  id: string;
  shopId: string;
  name: string;
  owner: string;
  contact: string;
  line: BusinessLine;
  notes: string;
  tasks: string[];
  costsMonthly: number;
}

export interface Creator {
  id: string;
  name: string;
  type: "Creator" | "Đối tác";
  niche: string;
  line: BusinessLine;
  campaigns: string[];
  relationship: "Đang hợp tác" | "Cần gia hạn" | "Đang đánh giá";
  deliverables: string;
  bookingFee: number;
  payoutRate: number;
}

export interface Product {
  id: string;
  shopId: string;
  line: BusinessLine;
  title: string;
  description: string;
  sku: string;
  sellingPrice: number;
  stock: number;
  commissionRate: number;
  status: "Đang bán" | "Tạm dừng" | "Bản nháp";
}

export interface Campaign {
  id: string;
  name: string;
  sellerProductIds: string[];
  creatorIds: string[];
  targetGmv: number;
  commissionBudget: number;
  status: "Draft" | "Active" | "Completed";
  fulfillment: "Đang chuẩn bị" | "Đang thực hiện" | "Đã đối soát";
  startsAt: string;
  endsAt: string;
}

export interface DemoOrder {
  id: string;
  date: string;
  shopId: string;
  clientId: string;
  creatorId: string;
  productId: string;
  campaignId?: string;
  line: BusinessLine;
  channel: Channel;
  grossGmv: number;
  refundOrCancel: number;
  eligibleGmv: number;
  orders: number;
  conversion: number;
  status: OrderStatus;
  commission: number;
  commissionStatus: CommissionStatus;
}

export const DEMO_AS_OF = "2026-10-13T10:00:00.000Z";

export const shops: Shop[] = [
  { id: "shop-1", clientId: "client-1", name: "Mộc Nhiên Gia Dụng", line: "TSP", owner: "Linh Trần", authorization: "Đầy đủ", expiresAt: "2027-04-28", serviceFeeMonthly: 24000000, gmvTargetMonthly: 650000000, feeModel: "Phí quản lý cố định + 1,8% GMV đủ điều kiện" },
  { id: "shop-2", clientId: "client-2", name: "Lá Thơm Beauty Lab", line: "TSP", owner: "Quân Lê", authorization: "Sắp hết hạn", expiresAt: "2026-10-28", serviceFeeMonthly: 22000000, gmvTargetMonthly: 540000000, feeModel: "2,1% GMV đủ điều kiện" },
  { id: "shop-3", clientId: "client-3", name: "Sông Mây Active", line: "TAP", owner: "Mai Phạm", authorization: "Đầy đủ", expiresAt: "2027-02-16", serviceFeeMonthly: 18000000, gmvTargetMonthly: 480000000, feeModel: "Phí chiến dịch + chia sẻ hoa hồng" },
  { id: "shop-4", clientId: "client-4", name: "Bếp Nhỏ Story", line: "TAP", owner: "Thảo Võ", authorization: "Đầy đủ", expiresAt: "2027-06-12", serviceFeeMonthly: 16000000, gmvTargetMonthly: 420000000, feeModel: "Phí chiến dịch theo mốc GMV" },
  { id: "shop-5", clientId: "client-5", name: "Nếp Nhà Kids", line: "MCN", owner: "Hà Nguyễn", authorization: "Chưa ủy quyền", expiresAt: "2026-10-15", serviceFeeMonthly: 12000000, gmvTargetMonthly: 360000000, feeModel: "Chia sẻ hoa hồng creator 28%" },
  { id: "shop-6", clientId: "client-6", name: "Dốc Gió Outdoors", line: "MCN", owner: "Tú Bùi", authorization: "Đầy đủ", expiresAt: "2027-03-09", serviceFeeMonthly: 14000000, gmvTargetMonthly: 390000000, feeModel: "Chia sẻ hoa hồng creator 30%" },
  { id: "shop-7", clientId: "client-7", name: "Tươi Mát Pantry", line: "TSP", owner: "Khoa Đỗ", authorization: "Đầy đủ", expiresAt: "2027-01-22", serviceFeeMonthly: 20000000, gmvTargetMonthly: 510000000, feeModel: "Phí quản lý + phí vận hành LIVE" },
  { id: "shop-8", clientId: "client-8", name: "Vệt Nắng Home", line: "TAP", owner: "Vy Lâm", authorization: "Sắp hết hạn", expiresAt: "2026-11-03", serviceFeeMonthly: 17000000, gmvTargetMonthly: 460000000, feeModel: "Phí chiến dịch + 1,6% GMV" },
];

export const clients: Client[] = [
  { id: "client-1", shopId: "shop-1", name: "An Nhiên Trading", owner: "Linh Trần", contact: "Kênh vận hành nội bộ", line: "TSP", notes: "Ưu tiên duy trì tồn kho cho video hướng dẫn.", tasks: ["Chốt kế hoạch LIVE tháng", "Rà soát SKU tồn thấp"], costsMonthly: 22000000 },
  { id: "client-2", shopId: "shop-2", name: "Hạ Vy Cosmetics", owner: "Quân Lê", contact: "Kênh vận hành nội bộ", line: "TSP", notes: "Hợp đồng cần gia hạn trong tháng.", tasks: ["Gia hạn hợp đồng", "Duyệt landing bundle"], costsMonthly: 18000000 },
  { id: "client-3", shopId: "shop-3", name: "Sông Mây Commerce", owner: "Mai Phạm", contact: "Kênh vận hành nội bộ", line: "TAP", notes: "Chiến dịch tháng 10 đang dưới nhịp mục tiêu.", tasks: ["Bổ sung 4 creator", "Chốt booking đợt 2"], costsMonthly: 15500000 },
  { id: "client-4", shopId: "shop-4", name: "Bếp Nhỏ Việt", owner: "Thảo Võ", contact: "Kênh vận hành nội bộ", line: "TAP", notes: "Nhóm video công thức cho hiệu suất ổn định.", tasks: ["Kiểm tra file bàn giao", "Đối soát booking"], costsMonthly: 12000000 },
  { id: "client-5", shopId: "shop-5", name: "Nếp Nhà Retail", owner: "Hà Nguyễn", contact: "Kênh vận hành nội bộ", line: "MCN", notes: "Ủy quyền demo chưa hoàn tất.", tasks: ["Làm rõ quyền creator", "Theo dõi kế hoạch quay"], costsMonthly: 9800000 },
  { id: "client-6", shopId: "shop-6", name: "Dốc Gió Supply", owner: "Tú Bùi", contact: "Kênh vận hành nội bộ", line: "MCN", notes: "Tập trung creator outdoor nhóm nhỏ.", tasks: ["Rà soát thưởng tháng", "Ghép creator mới"], costsMonthly: 10600000 },
  { id: "client-7", shopId: "shop-7", name: "Tươi Mát Foods", owner: "Khoa Đỗ", contact: "Kênh vận hành nội bộ", line: "TSP", notes: "Khung LIVE thứ sáu có tỷ lệ chốt tốt.", tasks: ["Lên lịch host", "Duyệt kịch bản LIVE"], costsMonthly: 14600000 },
  { id: "client-8", shopId: "shop-8", name: "Vệt Nắng Living", owner: "Vy Lâm", contact: "Kênh vận hành nội bộ", line: "TAP", notes: "Ưu tiên nhóm creator decor nhà cửa.", tasks: ["Gia hạn quyền shop", "Tuyển creator bổ sung"], costsMonthly: 13200000 },
];

export const creators: Creator[] = [
  { id: "creator-1", name: "Minh Khuê", type: "Creator", niche: "Gia dụng tối giản", line: "MCN", campaigns: ["camp-1", "camp-4"], relationship: "Đang hợp tác", deliverables: "8 VIDEO · 1 LIVE", bookingFee: 8500000, payoutRate: 0.62 },
  { id: "creator-2", name: "Huyền Mi", type: "Creator", niche: "Skincare bình dân", line: "TAP", campaigns: ["camp-2"], relationship: "Đang hợp tác", deliverables: "6 VIDEO", bookingFee: 7200000, payoutRate: 0.6 },
  { id: "creator-3", name: "Tùng Leo", type: "Đối tác", niche: "Outdoor & camping", line: "MCN", campaigns: ["camp-3"], relationship: "Cần gia hạn", deliverables: "4 VIDEO · 2 LIVE", bookingFee: 11000000, payoutRate: 0.58 },
  { id: "creator-4", name: "Bảo Trâm", type: "Creator", niche: "Bếp và mẹo nhà", line: "TAP", campaigns: ["camp-4"], relationship: "Đang hợp tác", deliverables: "10 VIDEO", bookingFee: 9000000, payoutRate: 0.61 },
  { id: "creator-5", name: "Lan Anh Daily", type: "Creator", niche: "Mẹ & bé", line: "MCN", campaigns: ["camp-5"], relationship: "Đang đánh giá", deliverables: "5 VIDEO", bookingFee: 6500000, payoutRate: 0.55 },
  { id: "creator-6", name: "Khôi Studio", type: "Creator", niche: "Thiết bị bếp", line: "TSP", campaigns: ["camp-1"], relationship: "Đang hợp tác", deliverables: "5 VIDEO · 1 LIVE", bookingFee: 10000000, payoutRate: 0.59 },
  { id: "creator-7", name: "Thiên Nhi", type: "Đối tác", niche: "Fitness tại nhà", line: "TAP", campaigns: ["camp-2", "camp-5"], relationship: "Đang hợp tác", deliverables: "9 VIDEO", bookingFee: 8300000, payoutRate: 0.6 },
  { id: "creator-8", name: "Thuận Foodie", type: "Creator", niche: "Đồ khô & pantry", line: "TSP", campaigns: ["camp-4"], relationship: "Đang hợp tác", deliverables: "6 VIDEO · 1 LIVE", bookingFee: 7600000, payoutRate: 0.57 },
  { id: "creator-9", name: "Mỹ An Home", type: "Creator", niche: "Decor căn hộ", line: "TAP", campaigns: ["camp-3"], relationship: "Đang hợp tác", deliverables: "7 VIDEO", bookingFee: 8800000, payoutRate: 0.62 },
  { id: "creator-10", name: "Gia Hân Review", type: "Creator", niche: "Beauty review", line: "MCN", campaigns: ["camp-2"], relationship: "Cần gia hạn", deliverables: "8 VIDEO", bookingFee: 7800000, payoutRate: 0.59 },
  { id: "creator-11", name: "Duy Khang", type: "Đối tác", niche: "Dụng cụ gia đình", line: "TSP", campaigns: ["camp-1"], relationship: "Đang hợp tác", deliverables: "5 VIDEO", bookingFee: 6900000, payoutRate: 0.56 },
  { id: "creator-12", name: "Phương Vi", type: "Creator", niche: "Lối sống xanh", line: "MCN", campaigns: ["camp-5"], relationship: "Đang đánh giá", deliverables: "4 VIDEO · 1 LIVE", bookingFee: 7100000, payoutRate: 0.54 },
  { id: "creator-13", name: "Bảo Ngọc", type: "Creator", niche: "Mẹo ăn nhanh", line: "TAP", campaigns: ["camp-4"], relationship: "Đang hợp tác", deliverables: "9 VIDEO", bookingFee: 8100000, payoutRate: 0.6 },
  { id: "creator-14", name: "Nam Đan", type: "Đối tác", niche: "Chạy bộ & sức bền", line: "TAP", campaigns: ["camp-2"], relationship: "Đang hợp tác", deliverables: "6 VIDEO", bookingFee: 7400000, payoutRate: 0.58 },
  { id: "creator-15", name: "Kiều Diễm", type: "Creator", niche: "Home organization", line: "TSP", campaigns: ["camp-3"], relationship: "Đang hợp tác", deliverables: "7 VIDEO · 1 LIVE", bookingFee: 9300000, payoutRate: 0.61 },
  { id: "creator-16", name: "Quốc Bảo", type: "Creator", niche: "Thiết bị dã ngoại", line: "MCN", campaigns: ["camp-5"], relationship: "Đang đánh giá", deliverables: "5 VIDEO", bookingFee: 6700000, payoutRate: 0.55 },
];

export const products: Product[] = [
  { id: "prod-1", shopId: "shop-1", line: "TSP", title: "Bộ hộp thủy tinh 10 món", description: "Bộ hộp borosilicate cho bếp gọn gàng, nắp kín và dễ xếp chồng.", sku: "MN-GLS-10", sellingPrice: 329000, stock: 18, commissionRate: 0.12, status: "Đang bán" },
  { id: "prod-2", shopId: "shop-1", line: "TSP", title: "Kệ gia vị gỗ tre", description: "Kệ để bàn cho căn bếp tối giản, hoàn thiện tre ép chống ẩm.", sku: "MN-BAM-02", sellingPrice: 289000, stock: 42, commissionRate: 0.1, status: "Đang bán" },
  { id: "prod-3", shopId: "shop-2", line: "TSP", title: "Serum phục hồi 30ml", description: "Serum cấp ẩm và phục hồi hàng rào da, dùng cho routine tối.", sku: "LT-SRM-30", sellingPrice: 379000, stock: 11, commissionRate: 0.15, status: "Đang bán" },
  { id: "prod-4", shopId: "shop-2", line: "TSP", title: "Kem chống nắng nhẹ mặt", description: "Kết cấu nhẹ, phù hợp sử dụng hằng ngày trong khí hậu nóng ẩm.", sku: "LT-SPF-50", sellingPrice: 269000, stock: 74, commissionRate: 0.14, status: "Đang bán" },
  { id: "prod-5", shopId: "shop-3", line: "TAP", title: "Thảm tập gấp gọn", description: "Thảm tập độ bám cao cho bài tập tại nhà và di chuyển.", sku: "SM-MAT-01", sellingPrice: 459000, stock: 31, commissionRate: 0.13, status: "Đang bán" },
  { id: "prod-6", shopId: "shop-4", line: "TAP", title: "Chảo sâu lòng 28cm", description: "Chảo phủ bền với thành sâu, phù hợp món xào và nấu nhanh.", sku: "BN-PAN-28", sellingPrice: 519000, stock: 27, commissionRate: 0.11, status: "Đang bán" },
  { id: "prod-7", shopId: "shop-5", line: "MCN", title: "Bộ xếp hình gỗ 80 chi tiết", description: "Bộ đồ chơi lắp ghép bằng gỗ, hướng dẫn chơi theo độ tuổi.", sku: "NNK-BLK-80", sellingPrice: 399000, stock: 8, commissionRate: 0.16, status: "Đang bán" },
  { id: "prod-8", shopId: "shop-6", line: "MCN", title: "Đèn pin cắm trại mini", description: "Đèn pin sạc gọn nhẹ có ba mức sáng cho hoạt động ngoài trời.", sku: "DG-LMP-MN", sellingPrice: 349000, stock: 39, commissionRate: 0.14, status: "Đang bán" },
  { id: "prod-9", shopId: "shop-7", line: "TSP", title: "Hạt điều rang lá chanh 500g", description: "Hạt điều rang mẻ nhỏ, đóng gói 500g cho pantry gia đình.", sku: "TM-CAS-500", sellingPrice: 189000, stock: 86, commissionRate: 0.1, status: "Đang bán" },
  { id: "prod-10", shopId: "shop-8", line: "TAP", title: "Ga giường cotton washed", description: "Ga cotton washed mềm nhẹ, bảng màu trung tính cho phòng ngủ.", sku: "VN-SHT-QN", sellingPrice: 569000, stock: 23, commissionRate: 0.12, status: "Đang bán" },
  { id: "prod-11", shopId: "shop-3", line: "TAP", title: "Dây kháng lực 5 mức", description: "Bộ dây kháng lực cho yoga, phục hồi và tập sức mạnh nhẹ.", sku: "SM-BND-05", sellingPrice: 219000, stock: 56, commissionRate: 0.12, status: "Đang bán" },
  { id: "prod-12", shopId: "shop-8", line: "TAP", title: "Set khăn bếp linen", description: "Set khăn bếp linen dệt mềm, dùng cho bếp và bàn ăn.", sku: "VN-LIN-03", sellingPrice: 249000, stock: 0, commissionRate: 0.1, status: "Tạm dừng" },
];

export const campaigns: Campaign[] = [
  { id: "camp-1", name: "Bếp gọn mùa lễ", sellerProductIds: ["prod-1", "prod-2", "prod-6"], creatorIds: ["creator-1", "creator-6", "creator-11"], targetGmv: 620000000, commissionBudget: 86000000, status: "Active", fulfillment: "Đang thực hiện", startsAt: "2026-10-01", endsAt: "2026-10-31" },
  { id: "camp-2", name: "Routine nhẹ mỗi ngày", sellerProductIds: ["prod-3", "prod-4", "prod-5"], creatorIds: ["creator-2", "creator-7", "creator-10", "creator-14"], targetGmv: 540000000, commissionBudget: 76000000, status: "Active", fulfillment: "Đang thực hiện", startsAt: "2026-09-22", endsAt: "2026-10-25" },
  { id: "camp-3", name: "Cuối tuần ở nhà", sellerProductIds: ["prod-8", "prod-10", "prod-12"], creatorIds: ["creator-3", "creator-9", "creator-15"], targetGmv: 490000000, commissionBudget: 68000000, status: "Draft", fulfillment: "Đang chuẩn bị", startsAt: "2026-10-18", endsAt: "2026-11-18" },
  { id: "camp-4", name: "Bếp Việt nhanh gọn", sellerProductIds: ["prod-6", "prod-9", "prod-1"], creatorIds: ["creator-4", "creator-8", "creator-13"], targetGmv: 510000000, commissionBudget: 72000000, status: "Completed", fulfillment: "Đã đối soát", startsAt: "2026-08-15", endsAt: "2026-09-15" },
  { id: "camp-5", name: "Nhà khỏe cuối năm", sellerProductIds: ["prod-5", "prod-7", "prod-8"], creatorIds: ["creator-5", "creator-7", "creator-12", "creator-16"], targetGmv: 440000000, commissionBudget: 61000000, status: "Active", fulfillment: "Đang thực hiện", startsAt: "2026-10-05", endsAt: "2026-11-05" },
];

const byId = <T extends { id: string }>(items: T[], id: string) => items.find((item) => item.id === id)!;

function hash(text: string) {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0) / 4294967296;
}

function isoDate(offsetFromToday: number) {
  const date = new Date(DEMO_AS_OF);
  date.setUTCDate(date.getUTCDate() + offsetFromToday);
  return date.toISOString().slice(0, 10);
}

export function generateOrders(): DemoOrder[] {
  const output: DemoOrder[] = [];
  let sequence = 1;

  for (let day = -89; day <= 0; day += 1) {
    shops.forEach((shop, shopIndex) => {
      const shopProducts = products.filter((product) => product.shopId === shop.id);
      const shopCreators = creators.filter((creator) => creator.line === shop.line);
      for (let entry = 0; entry < 3; entry += 1) {
        const key = `${day}-${shop.id}-${entry}`;
        const random = hash(key);
        const product = shopProducts[(Math.floor(random * 100) + entry) % shopProducts.length];
        const creator = shopCreators[(Math.floor(hash(`${key}-creator`) * 100) + entry) % shopCreators.length];
        const channel: Channel = ["VIDEO", "LIVE", "PRODUCT_CARD"][(Math.floor(hash(`${key}-channel`) * 100) + entry) % 3] as Channel;
        const statusValue = hash(`${key}-status`);
        const status: OrderStatus = statusValue < 0.055 ? "canceled" : statusValue < 0.105 ? "refunded" : "eligible";
        const grossGmv = Math.round((2600000 + hash(`${key}-gmv`) * 6700000) / 1000) * 1000;
        const refundOrCancel = status === "eligible" ? 0 : Math.round(grossGmv * (status === "refunded" ? 0.78 : 1));
        const eligibleGmv = grossGmv - refundOrCancel;
        const age = Math.abs(day);
        const commissionStatus: CommissionStatus = status !== "eligible"
          ? "ineligible"
          : age > 42
            ? "settled"
            : age > 16
              ? "pending"
              : hash(`${key}-freeze`) > 0.94
                ? "frozen"
                : "estimated";
        const matchedCampaign = campaigns.find((campaign) => campaign.sellerProductIds.includes(product.id) && campaign.creatorIds.includes(creator.id));
        output.push({
          id: `ORD-${String(sequence).padStart(5, "0")}`,
          date: isoDate(day),
          shopId: shop.id,
          clientId: shop.clientId,
          creatorId: creator.id,
          productId: product.id,
          campaignId: matchedCampaign?.id,
          line: shop.line,
          channel,
          grossGmv,
          refundOrCancel,
          eligibleGmv,
          orders: 5 + Math.floor(hash(`${key}-orders`) * 18),
          conversion: 0.019 + hash(`${key}-conversion`) * 0.061,
          status,
          commission: Math.round(eligibleGmv * product.commissionRate),
          commissionStatus,
        });
        sequence += 1;
      }
    });
  }
  return output;
}

export const demoOrders = generateOrders();

export function withinFilter<T extends { date: string; line: BusinessLine }>(items: T[], period: PeriodDays, role: RoleFilter) {
  const start = isoDate(-(period - 1));
  return items.filter((item) => item.date >= start && (role === "Tất cả" || item.line === role));
}

export function sum<T>(items: T[], selector: (item: T) => number) {
  return items.reduce((total, item) => total + selector(item), 0);
}

export function formatVnd(value: number, compact = false) {
  if (compact) {
    if (Math.abs(value) >= 1000000000) return `${(value / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tỷ`;
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tr`;
  }
  return `${Math.round(value).toLocaleString("vi-VN")} ₫`;
}

export function formatNumber(value: number) {
  return Math.round(value).toLocaleString("vi-VN");
}

export function formatPercent(value: number, decimals = 1) {
  return `${(value * 100).toLocaleString("vi-VN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}%`;
}

export function shortDate(dateValue: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(new Date(`${dateValue}T10:00:00`));
}

export function fullDate(dateValue: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${dateValue}T10:00:00`));
}

export function getOrderSummary(ordersToSummarize: DemoOrder[]) {
  const grossGmv = sum(ordersToSummarize, (order) => order.grossGmv);
  const refundedOrCanceled = sum(ordersToSummarize, (order) => order.refundOrCancel);
  const eligibleGmv = sum(ordersToSummarize, (order) => order.eligibleGmv);
  const estimatedCommission = sum(ordersToSummarize.filter((order) => order.commissionStatus === "estimated"), (order) => order.commission);
  const pendingCommission = sum(ordersToSummarize.filter((order) => order.commissionStatus === "pending"), (order) => order.commission);
  const settledCommission = sum(ordersToSummarize.filter((order) => order.commissionStatus === "settled"), (order) => order.commission);
  const frozenCommission = sum(ordersToSummarize.filter((order) => order.commissionStatus === "frozen"), (order) => order.commission);
  const ineligibleCommission = sum(ordersToSummarize.filter((order) => order.commissionStatus === "ineligible"), (order) => order.commission);
  return { grossGmv, refundedOrCanceled, eligibleGmv, estimatedCommission, pendingCommission, settledCommission, frozenCommission, ineligibleCommission };
}

export function getFinance(ordersToSummarize: DemoOrder[], activeShops: Shop[], activeCampaigns: Campaign[], period: PeriodDays) {
  const commission = getOrderSummary(ordersToSummarize);
  const factor = period / 30;
  const managementFees = sum(activeShops, (shop) => shop.serviceFeeMonthly) * factor;
  const agencyCommissionShare = (commission.estimatedCommission + commission.pendingCommission + commission.settledCommission) * 0.29;
  const reportStart = new Date(DEMO_AS_OF);
  reportStart.setUTCDate(reportStart.getUTCDate() - (period - 1));
  const reportEnd = new Date(DEMO_AS_OF);
  const bookingRevenue = sum(activeCampaigns, (campaign) => {
    if (campaign.status === "Draft") return 0;
    const campaignStart = new Date(`${campaign.startsAt}T00:00:00.000Z`);
    const campaignEnd = new Date(`${campaign.endsAt}T23:59:59.999Z`);
    const overlapStart = new Date(Math.max(reportStart.getTime(), campaignStart.getTime()));
    const overlapEnd = new Date(Math.min(reportEnd.getTime(), campaignEnd.getTime()));
    if (overlapEnd < overlapStart) return 0;
    const overlapDays = Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / 86400000) + 1;
    const campaignDays = Math.floor((campaignEnd.getTime() - campaignStart.getTime()) / 86400000) + 1;
    return campaign.commissionBudget * 0.075 * (overlapDays / campaignDays);
  });
  const agencyRevenue = managementFees + agencyCommissionShare + bookingRevenue;
  const creatorCosts = sum(ordersToSummarize.filter((order) => order.status === "eligible"), (order) => {
    const creator = byId(creators, order.creatorId);
    return order.commission * creator.payoutRate;
  });
  const adsCost = activeShops.reduce((total, _shop, index) => total + 6500000 + index * 900000, 0) * factor;
  const productionLiveCost = activeShops.reduce((total, _shop, index) => total + 4800000 + index * 720000, 0) * factor;
  const contributionProfit = agencyRevenue - creatorCosts - adsCost - productionLiveCost;
  return { managementFees, agencyCommissionShare, bookingRevenue, agencyRevenue, creatorCosts, adsCost, productionLiveCost, contributionProfit, ...commission };
}

export function getDailyTrend(ordersToSummarize: DemoOrder[], days: PeriodDays) {
  const rows = Array.from({ length: days }, (_, index) => {
    const date = isoDate(-(days - 1 - index));
    const matching = ordersToSummarize.filter((order) => order.date === date);
    return {
      date,
      label: shortDate(date),
      VIDEO: sum(matching.filter((order) => order.channel === "VIDEO"), (order) => order.eligibleGmv),
      LIVE: sum(matching.filter((order) => order.channel === "LIVE"), (order) => order.eligibleGmv),
      PRODUCT_CARD: sum(matching.filter((order) => order.channel === "PRODUCT_CARD"), (order) => order.eligibleGmv),
    };
  });
  return rows;
}

export function getRevenueMix(ordersToSummarize: DemoOrder[]) {
  return (["MCN", "TAP", "TSP"] as BusinessLine[]).map((line) => ({
    line,
    value: sum(ordersToSummarize.filter((order) => order.line === line), (order) => order.eligibleGmv),
  }));
}

export function getShopRows(ordersToSummarize: DemoOrder[], activeShops: Shop[]) {
  return activeShops.map((shop) => {
    const matching = ordersToSummarize.filter((order) => order.shopId === shop.id);
    const eligibleGmv = sum(matching, (order) => order.eligibleGmv);
    const estimatedCommission = sum(matching.filter((order) => order.commissionStatus === "estimated" || order.commissionStatus === "pending"), (order) => order.commission);
    return { shop, eligibleGmv, orders: sum(matching, (order) => order.orders), estimatedCommission, achievement: shop.gmvTargetMonthly ? eligibleGmv / shop.gmvTargetMonthly : 0 };
  }).sort((a, b) => b.eligibleGmv - a.eligibleGmv);
}

export function getCreatorRows(ordersToSummarize: DemoOrder[], activeCreators = creators) {
  return activeCreators.map((creator) => {
    const matching = ordersToSummarize.filter((order) => order.creatorId === creator.id);
    const attributedGmv = sum(matching, (order) => order.eligibleGmv);
    const estimatedCommission = sum(matching.filter((order) => order.commissionStatus === "estimated" || order.commissionStatus === "pending"), (order) => order.commission);
    const settledCommission = sum(matching.filter((order) => order.commissionStatus === "settled"), (order) => order.commission);
    const payout = sum(matching.filter((order) => order.status === "eligible"), (order) => order.commission * creator.payoutRate);
    return { creator, attributedGmv, orders: sum(matching, (order) => order.orders), estimatedCommission, settledCommission, bookingFee: creator.bookingFee, contributionProfit: estimatedCommission * 0.29 + settledCommission * 0.29 - payout - creator.bookingFee / 3 };
  }).sort((a, b) => b.attributedGmv - a.attributedGmv);
}

export function getProductRows(ordersToSummarize: DemoOrder[], activeProducts: Product[]) {
  return activeProducts.map((product) => {
    const matching = ordersToSummarize.filter((order) => order.productId === product.id);
    return {
      product,
      gmv: sum(matching, (order) => order.eligibleGmv),
      orders: sum(matching, (order) => order.orders),
      conversion: matching.length ? sum(matching, (order) => order.conversion) / matching.length : 0,
    };
  }).sort((a, b) => b.gmv - a.gmv);
}

export function getCampaignRows(ordersToSummarize: DemoOrder[], activeCampaigns: Campaign[]) {
  return activeCampaigns.map((campaign) => {
    const matching = ordersToSummarize.filter((order) => order.campaignId === campaign.id);
    const gmv = sum(matching, (order) => order.eligibleGmv);
    const commission = sum(matching, (order) => order.commission);
    return { campaign, gmv, commission, orders: sum(matching, (order) => order.orders), progress: campaign.targetGmv ? gmv / campaign.targetGmv : 0 };
  }).sort((a, b) => b.gmv - a.gmv);
}

export function buildOrdersCsv(ordersToExport: DemoOrder[], activeProducts: Product[]) {
  const productMap = new Map(activeProducts.map((product) => [product.id, product]));
  const shopMap = new Map(shops.map((shop) => [shop.id, shop]));
  const creatorMap = new Map(creators.map((creator) => [creator.id, creator]));
  const header = ["Mã mẫu", "Ngày", "Business line", "Shop", "Creator/đối tác", "Sản phẩm", "Kênh", "GMV gộp", "Hoàn/hủy", "GMV đủ điều kiện", "Đơn", "Hoa hồng", "Trạng thái hoa hồng"];
  const lines = ordersToExport.map((order) => [
    order.id,
    order.date,
    order.line,
    shopMap.get(order.shopId)?.name ?? "",
    creatorMap.get(order.creatorId)?.name ?? "",
    productMap.get(order.productId)?.title ?? "",
    order.channel,
    order.grossGmv,
    order.refundOrCancel,
    order.eligibleGmv,
    order.orders,
    order.commission,
    order.commissionStatus,
  ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
  return [header.join(","), ...lines].join("\n");
}

export function getEntityName(id: string, entity: "shop" | "product" | "creator" | "campaign") {
  if (entity === "shop") return shops.find((item) => item.id === id)?.name ?? "—";
  if (entity === "product") return products.find((item) => item.id === id)?.title ?? "—";
  if (entity === "creator") return creators.find((item) => item.id === id)?.name ?? "—";
  return campaigns.find((item) => item.id === id)?.name ?? "—";
}
