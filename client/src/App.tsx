import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BellRing,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CircleX,
  ClipboardList,
  CloudOff,
  Download,
  FileSpreadsheet,
  Handshake,
  LayoutDashboard,
  Link2,
  Menu,
  MessageCircle,
  Package,
  PanelLeftClose,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  type BusinessLine,
  type Campaign,
  type Client,
  type Creator,
  type DemoOrder,
  type PeriodDays,
  type Product,
  type RoleFilter,
  campaigns,
  clients,
  creators,
  demoOrders,
  formatNumber,
  formatPercent,
  formatVnd,
  fullDate,
  getCampaignRows,
  getCreatorRows,
  getDailyTrend,
  getFinance,
  getOrderSummary,
  getProductRows,
  getRevenueMix,
  getShopRows,
  products,
  shops,
  withinFilter,
  buildOrdersCsv,
} from "./data/demoData";
import "./index.css";
import DataCapabilities from "./components/DataCapabilities";
import CompanyAgentsDemo from "./components/CompanyAgentsDemo";
import { companyTeam } from "@shared/companyTeam";

type Page = "overview" | "analysis" | "clients" | "creators" | "campaigns" | "products" | "finance" | "connections" | "dataCapabilities" | "companyAgents";
type Modal = "client" | "campaign" | "product" | "connect" | null;
type AnalysisTab = "Khách hàng" | "Creator" | "Sản phẩm" | "Chiến dịch";
type AssistantMessage = { question: string; answer: string; kind: "mix" | "commission" | "alerts" | "channel" };

type StoredDemo = {
  clients: Client[];
  products: Product[];
  campaigns: Campaign[];
  creators: Creator[];
  audit: string[];
};

const STORAGE_KEY = "agencyos-demo-v1";
const roleOptions: RoleFilter[] = ["Tất cả", "MCN", "TAP", "TSP"];
const periodOptions: PeriodDays[] = [7, 30, 90];
const brandAsset = (filename: string) => `${import.meta.env.BASE_URL}brand/${filename}`;

const pageMeta: Record<Page, { label: string; icon: typeof LayoutDashboard; group?: string }> = {
  overview: { label: "Tổng quan", icon: LayoutDashboard },
  analysis: { label: "Phân tích", icon: BarChart3 },
  clients: { label: "Khách hàng", icon: Building2, group: "Vận hành" },
  creators: { label: "Creator & đối tác", icon: UsersRound },
  campaigns: { label: "Chiến dịch TAP", icon: Handshake },
  products: { label: "Sản phẩm", icon: Package },
  finance: { label: "Tài chính", icon: WalletCards, group: "Kiểm soát" },
  connections: { label: "Kết nối & quyền", icon: ShieldCheck },
  dataCapabilities: { label: "Dữ liệu & API", icon: FileSpreadsheet },
  companyAgents: { label: "Agents công ty", icon: Bot },
};

function loadDemo(): StoredDemo {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as StoredDemo | null;
    if (parsed?.clients && parsed.products && parsed.campaigns && parsed.creators) return parsed;
  } catch {
    // Fall through to deterministic base data.
  }
  return { clients, products, campaigns, creators, audit: ["13/10/2026 10:00 · Khởi tạo dữ liệu mô phỏng Nina Agency Hub."] };
}

function Panel({ children, className = "", title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && <div className="panel-heading"><h2>{title}</h2>{action}</div>}
      {children}
    </section>
  );
}

function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "teal" }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

function DemoBadge() {
  return <span className="demo-badge"><CloudOff size={13} /> Dữ liệu mẫu · Chưa kết nối TikTok Shop</span>;
}

function NinaMark({ dark = false }: { dark?: boolean }) {
  return <img className={`nina-mark ${dark ? "dark" : ""}`} src={brandAsset(dark ? "Primary_Black.png" : "Primary_White.png")} alt="Nina Agency Hub" />;
}

function MetricCard({ label, value, delta, detail, tone = "teal" }: { label: string; value: string; delta?: string; detail: string; tone?: "teal" | "amber" | "ink" }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-top"><span>{label}</span><span className="metric-signal" /></div>
      <strong>{value}</strong>
      <div className="metric-detail">
        {delta && <span className={delta.startsWith("+") ? "delta-positive" : "delta-negative"}>{delta.startsWith("+") ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{delta}</span>}
        <span>{detail}</span>
      </div>
    </article>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><CircleHelp size={23} /><strong>{title}</strong><span>{detail}</span></div>;
}

function DialogShell({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className={`dialog ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-header"><div><span className="eyebrow">THAY ĐỔI CỤC BỘ</span><h2 id="dialog-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Đóng hộp thoại"><X size={18} /></button></div>
        {children}
      </section>
    </div>
  );
}

function Drawer({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-header"><div><span className="eyebrow">CHI TIẾT DỮ LIỆU MẪU</span><h2 id="drawer-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Đóng chi tiết"><X size={18} /></button></div>
        {children}
      </aside>
    </div>
  );
}

function AssistantDrawer({
  memberName,
  period,
  role,
  summary,
  finance,
  mix,
  filteredOrders,
  alerts,
  messages,
  onAsk,
  onClose,
}: {
  memberName: string;
  period: PeriodDays;
  role: RoleFilter;
  summary: ReturnType<typeof getOrderSummary>;
  finance: ReturnType<typeof getFinance>;
  mix: ReturnType<typeof getRevenueMix>;
  filteredOrders: DemoOrder[];
  alerts: { title: string; detail: string; label: string }[];
  messages: AssistantMessage[];
  onAsk: (question: string) => void;
  onClose: () => void;
}) {
  const questions = [
    `GMV ${period} ngày phân bổ thế nào giữa MCN / TAP / TSP?`,
    "Hoa hồng nào đang chờ quyết toán?",
    "Cảnh báo vận hành cần xử lý trước?",
    "Kênh nào đang dẫn GMV đủ điều kiện?",
  ];
  const channelValue = (channel: DemoOrder["channel"]) => filteredOrders.filter((order) => order.channel === channel).reduce((total, order) => total + order.eligibleGmv, 0);
  return <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
    <aside className="drawer assistant-drawer" role="dialog" aria-modal="true" aria-labelledby="assistant-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="drawer-header assistant-header"><div><span className="eyebrow assistant-eyebrow"><Bot size={12} /> BOD ASSISTANT · SIMULATION</span><h2 id="assistant-title">Nina BOD Assistant</h2><p>Trợ lý mô phỏng cho review dữ liệu agency</p></div><button className="icon-button" onClick={onClose} aria-label="Đóng BOD Assistant"><X size={18} /></button></div>
      <div className="assistant-status"><NinaMark dark /><div><b>Chỉ dùng dữ liệu mẫu</b><span>Chưa kết nối Gemma · Chưa kết nối TikTok Shop</span></div><span className="status-pill warning">Demo</span></div>
      <div className="assistant-context"><div><Clock3 size={14} /><span>Kỳ báo cáo</span><b>{period} ngày</b></div><div><MessageCircle size={14} /><span>Phạm vi</span><b>{role}</b></div><div><CloudOff size={14} /><span>Data freshness</span><b>13/10/2026 · 10:00 ICT</b></div></div>
      <div className="assistant-body">
        <div className="assistant-intro"><span className="assistant-avatar"><Bot size={16} /></span><div><b>Xin chào, {memberName}.</b><p>Tôi có thể tóm tắt hiệu suất, hoa hồng và cảnh báo từ mô hình mẫu đang mở.</p></div></div>
        {messages.map((message, index) => <div className="assistant-thread" key={`${message.question}-${index}`}><div className="assistant-question">{message.question}</div><div className="assistant-answer"><div className="assistant-answer-head"><span className="assistant-avatar"><Bot size={14} /></span><b>Phân tích từ Nina</b></div><p>{message.answer}</p>{message.kind === "mix" && <div className="assistant-bars">{mix.map((item) => <div key={item.line}><span>{item.line}</span><i style={{ width: `${summary.eligibleGmv ? Math.max(8, item.value / summary.eligibleGmv * 100) : 0}%` }} /><strong>{formatVnd(item.value, true)}</strong></div>)}</div>}{message.kind === "commission" && <div className="assistant-mini-metrics"><div><span>Ước tính</span><b>{formatVnd(summary.estimatedCommission, true)}</b></div><div><span>Pending</span><b>{formatVnd(summary.pendingCommission, true)}</b></div><div><span>Đã QT</span><b>{formatVnd(summary.settledCommission, true)}</b></div></div>}{message.kind === "alerts" && <div className="assistant-alerts">{alerts.slice(0, 3).map((alert) => <div key={alert.title}><AlertTriangle size={13} /><span>{alert.title}</span><b>{alert.label}</b></div>)}</div>}{message.kind === "channel" && <div className="assistant-channel">{(["VIDEO", "LIVE", "PRODUCT_CARD"] as const).map((channel) => <div key={channel}><span>{channel}</span><i style={{ width: `${Math.max(8, channelValue(channel) / Math.max(summary.eligibleGmv, 1) * 100)}%` }} /></div>)}</div>}</div></div>)}
      </div>
      <div className="assistant-suggestions"><span className="eyebrow">GỢI Ý CÂU HỎI</span>{questions.map((question) => <button key={question} onClick={() => onAsk(question)}>{question}<ChevronRight size={13} /></button>)}</div>
      <div className="assistant-compose"><span>Demo local · câu trả lời định trước theo số liệu đang lọc</span><button className="button" onClick={() => onAsk(questions[0])}><Send size={14} /> Hỏi mẫu</button></div>
    </aside>
  </div>;
}

function TrendChart({ rows }: { rows: ReturnType<typeof getDailyTrend> }) {
  const total = rows.map((row) => row.VIDEO + row.LIVE + row.PRODUCT_CARD);
  const max = Math.max(...total, 1);
  const width = 680;
  const height = 220;
  const base = 178;
  const chartHeight = 142;
  const barWidth = Math.max(3, Math.floor(610 / rows.length) - 1);
  const labelStep = rows.length > 60 ? 15 : rows.length > 20 ? 7 : 2;
  return (
    <div className="chart-wrap" aria-label="Xu hướng GMV đủ điều kiện theo ngày và kênh">
      <div className="chart-legend"><span><i className="legend-dot video" /> VIDEO</span><span><i className="legend-dot live" /> LIVE</span><span><i className="legend-dot card" /> PRODUCT_CARD</span></div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true">
        {[0, 1, 2, 3].map((line) => <line key={line} x1="35" x2="655" y1={base - line * (chartHeight / 3)} y2={base - line * (chartHeight / 3)} className="chart-grid" />)}
        {rows.map((row, index) => {
          const x = 40 + index * (610 / rows.length);
          const videoH = (row.VIDEO / max) * chartHeight;
          const liveH = (row.LIVE / max) * chartHeight;
          const cardH = (row.PRODUCT_CARD / max) * chartHeight;
          return <g key={row.date}>
            <rect x={x} y={base - videoH} width={barWidth} height={videoH} rx="2" className="bar-video" />
            <rect x={x} y={base - videoH - liveH} width={barWidth} height={liveH} rx="2" className="bar-live" />
            <rect x={x} y={base - videoH - liveH - cardH} width={barWidth} height={cardH} rx="2" className="bar-card" />
            {(index === 0 || index === rows.length - 1 || index % labelStep === 0) && <text x={x + barWidth / 2} y="205" textAnchor="middle" className="chart-label">{row.label}</text>}
          </g>;
        })}
        <text x="11" y="42" className="chart-axis">{formatVnd(max, true)}</text>
        <text x="11" y="183" className="chart-axis">0</text>
      </svg>
    </div>
  );
}

function RevenueMix({ rows }: { rows: ReturnType<typeof getRevenueMix> }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  const colors: Record<BusinessLine, string> = { MCN: "#ff9a72", TAP: "#ff5401", TSP: "#ffc0a4" };
  return <div className="mix-list">{rows.map((row) => <div className="mix-row" key={row.line}><div className="mix-label"><span style={{ background: colors[row.line] }} />{row.line}</div><div className="mix-track"><i style={{ width: `${Math.max(7, row.value / max * 100)}%`, background: colors[row.line] }} /></div><strong>{formatVnd(row.value, true)}</strong></div>)}</div>;
}

function Progress({ value }: { value: number }) {
  return <div className="progress" aria-label={`Tiến độ ${formatPercent(value)}`}><i style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} /></div>;
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return <div className="info-row"><span>{label}</span><div>{children}</div></div>;
}

function appLineClass(line: BusinessLine) {
  return line.toLowerCase();
}

export default function App() {
  const initial = useMemo(loadDemo, []);
  const [profileId, setProfileId] = useState(() => {
    try { const saved = localStorage.getItem("nina-demo-profile"); return companyTeam.some(member => member.id === saved) ? saved! : "phuc-nguyen"; } catch { return "phuc-nguyen"; }
  });
  const activeMember = companyTeam.find(member => member.id === profileId) ?? companyTeam[2];
  const changeProfile = (id: string) => {
    if (!companyTeam.some(member => member.id === id)) return;
    setProfileId(id);
    setAssistantMessages([]);
    try { localStorage.setItem("nina-demo-profile", id); } catch { /* Keep selection for this session. */ }
  };
  const [page, setPage] = useState<Page>("overview");
  const [role, setRole] = useState<RoleFilter>("Tất cả");
  const [period, setPeriod] = useState<PeriodDays>(30);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analysisTab, setAnalysisTab] = useState<AnalysisTab>("Khách hàng");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [clientsState, setClientsState] = useState<Client[]>(initial.clients);
  const [productsState, setProductsState] = useState<Product[]>(initial.products);
  const [campaignsState, setCampaignsState] = useState<Campaign[]>(initial.campaigns);
  const [creatorsState, setCreatorsState] = useState<Creator[]>(initial.creators);
  const [audit, setAudit] = useState<string[]>(initial.audit);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [clientForm, setClientForm] = useState<Partial<Client>>({});
  const [campaignForm, setCampaignForm] = useState<Partial<Campaign>>({});
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [creatorForm, setCreatorForm] = useState<Partial<Creator>>({});
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients: clientsState, products: productsState, campaigns: campaignsState, creators: creatorsState, audit }));
  }, [clientsState, productsState, campaignsState, creatorsState, audit]);

  const effectiveOrders = useMemo(() => {
    const productRates = new Map(productsState.map((product) => [product.id, product.commissionRate]));
    return demoOrders.map((order) => ({ ...order, commission: Math.round(order.eligibleGmv * (productRates.get(order.productId) ?? 0)) }));
  }, [productsState]);
  const filteredOrders = useMemo(() => withinFilter(effectiveOrders, period, role), [effectiveOrders, period, role]);
  const activeShops = useMemo(() => shops.filter((shop) => role === "Tất cả" || shop.line === role), [role]);
  const activeCampaigns = useMemo(() => campaignsState.filter((campaign) => role === "Tất cả" || role === "TAP"), [campaignsState, role]);
  const summary = useMemo(() => getOrderSummary(filteredOrders), [filteredOrders]);
  const finance = useMemo(() => getFinance(filteredOrders, activeShops, activeCampaigns, period), [filteredOrders, activeShops, activeCampaigns, period]);
  const trend = useMemo(() => getDailyTrend(filteredOrders, period), [filteredOrders, period]);
  const mix = useMemo(() => getRevenueMix(filteredOrders), [filteredOrders]);
  const shopRows = useMemo(() => getShopRows(filteredOrders, activeShops), [filteredOrders, activeShops]);
  const creatorRows = useMemo(() => getCreatorRows(filteredOrders, creatorsState.filter((creator) => role === "Tất cả" || creator.line === role)), [filteredOrders, creatorsState, role]);
  const productRows = useMemo(() => getProductRows(filteredOrders, productsState.filter((product) => role === "Tất cả" || product.line === role)), [filteredOrders, productsState, role]);
  const campaignRows = useMemo(() => getCampaignRows(filteredOrders, activeCampaigns), [filteredOrders, activeCampaigns]);
  const overviewAlerts = useMemo(() => {
    const output: { id: string; kind: "stock" | "contract" | "campaign"; title: string; detail: string; tone: "warning" | "danger"; label: string; page: Page }[] = [];
    const lowStock = productsState.filter((product) => (role === "Tất cả" || product.line === role) && product.stock < 12).sort((left, right) => left.stock - right.stock)[0];
    if (lowStock) output.push({ id: `stock-${lowStock.id}`, kind: "stock", title: `Tồn kho thấp: ${lowStock.title}`, detail: `${formatNumber(lowStock.stock)} sản phẩm còn lại · cần xem lại trước đợt video mới.`, tone: "warning", label: "Cần xử lý", page: "products" });
    const asOf = new Date("2026-10-13T00:00:00.000Z");
    const expiringShop = activeShops.map((shop) => ({ shop, days: Math.ceil((new Date(`${shop.expiresAt}T00:00:00.000Z`).getTime() - asOf.getTime()) / 86400000) })).filter((item) => item.days >= 0 && item.days <= 30).sort((left, right) => left.days - right.days)[0];
    if (expiringShop) output.push({ id: `contract-${expiringShop.shop.id}`, kind: "contract", title: `Quyền / hợp đồng ${expiringShop.shop.name} sắp hết hạn`, detail: `Ngày hết hạn mẫu ${fullDate(expiringShop.shop.expiresAt)} · cần rà soát trạng thái ủy quyền.`, tone: "warning", label: `${expiringShop.days} ngày`, page: "clients" });
    const belowTarget = campaignRows.filter((row) => row.campaign.status === "Active" && row.progress < 0.7).sort((left, right) => left.progress - right.progress)[0];
    if (belowTarget) output.push({ id: `campaign-${belowTarget.campaign.id}`, kind: "campaign", title: `“${belowTarget.campaign.name}” dưới nhịp mục tiêu`, detail: `Tiến độ mô phỏng ${formatPercent(belowTarget.progress)} so với GMV mục tiêu trong bộ lọc hiện tại.`, tone: "danger", label: "Theo dõi", page: "campaigns" });
    return output;
  }, [productsState, role, activeShops, campaignRows]);
  const normalizedQuery = query.trim().toLocaleLowerCase("vi-VN");
  const currentMeta = pageMeta[page];

  const appendAudit = (event: string) => setAudit((previous) => [`13/10/2026 10:00 · ${event}`, ...previous].slice(0, 8));
  const matches = (...values: (string | number | undefined)[]) => !normalizedQuery || values.some((value) => String(value ?? "").toLocaleLowerCase("vi-VN").includes(normalizedQuery));

  const askAssistant = (question: string) => {
    const lower = question.toLocaleLowerCase("vi-VN");
    let answer = "";
    let kind: AssistantMessage["kind"] = "channel";
    if (lower.includes("phân bổ") || lower.includes("mcn") || lower.includes("tap") || lower.includes("tsp")) {
      const lead = [...mix].sort((left, right) => right.value - left.value)[0];
      answer = `Trong ${period} ngày, GMV đủ điều kiện đang ở mức ${formatVnd(summary.eligibleGmv, true)}. ${lead?.line ?? "—"} dẫn đầu với ${formatVnd(lead?.value ?? 0, true)}; đây là GMV, không phải doanh thu agency.`;
      kind = "mix";
    } else if (lower.includes("hoa hồng") || lower.includes("quyết toán")) {
      answer = `Phần hoa hồng cần theo dõi là ${formatVnd(summary.estimatedCommission + summary.pendingCommission, true)} gồm ước tính và pending. Đã quyết toán hiện là ${formatVnd(summary.settledCommission, true)}; doanh thu agency trong cùng bộ lọc là ${formatVnd(finance.agencyRevenue, true)}.`;
      kind = "commission";
    } else if (lower.includes("cảnh báo") || lower.includes("xử lý")) {
      answer = overviewAlerts.length ? `Có ${overviewAlerts.length} cảnh báo mẫu trong phạm vi ${role}, kỳ ${period} ngày. Tôi ưu tiên cảnh báo đầu tiên trong danh sách vì tác động trực tiếp đến tồn kho hoặc quyền vận hành.` : "Không có cảnh báo mẫu trong phạm vi đang chọn. Đây vẫn là kết quả từ dữ liệu mô phỏng, không phải cảnh báo live.";
      kind = "alerts";
    } else {
      answer = `Kênh dẫn GMV đủ điều kiện hiện là ${getLeadingChannel(filteredOrders)} trong kỳ ${period} ngày. Dữ liệu được chốt tại 13/10/2026 10:00 ICT và không có sync TikTok Shop thực.`;
      kind = "channel";
    }
    setAssistantMessages((previous) => [{ question, answer, kind }, ...previous].slice(0, 4));
    setAssistantOpen(true);
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setClientsState(clients);
    setProductsState(products);
    setCampaignsState(campaigns);
    setCreatorsState(creators);
    setAudit(["13/10/2026 10:00 · Khởi tạo lại dữ liệu mô phỏng Nina Agency Hub."]);
    toast.success("Đã khôi phục dữ liệu mẫu ban đầu.");
  };

  const exportCsv = () => {
    const csv = buildOrdersCsv(filteredOrders, productsState);
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nina-agency-hub-${role.toLowerCase().replaceAll(" ", "-")}-${period}-ngay.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success(`Đã xuất ${formatNumber(filteredOrders.length)} dòng dữ liệu mẫu.`);
  };

  const openClientModal = (client?: Client) => {
    const value = client ?? { id: "", shopId: activeShops[0]?.id ?? "shop-1", name: "", owner: "", contact: "Kênh vận hành nội bộ", line: role === "Tất cả" ? "TSP" : role, notes: "", tasks: [], costsMonthly: 0 };
    setEditingClient(client ?? null);
    setClientForm(value);
    setModal("client");
  };

  const saveClient = () => {
    if (!clientForm.name?.trim() || !clientForm.owner?.trim()) { toast.error("Cần có tên khách hàng và người phụ trách."); return; }
    const linkedShop = shops.find((shop) => shop.id === clientForm.shopId) ?? shops[0];
    const safeClient: Client = {
      id: editingClient?.id ?? `client-local-${Date.now()}`,
      shopId: linkedShop.id,
      name: clientForm.name.trim(),
      owner: clientForm.owner.trim(),
      contact: clientForm.contact?.trim() || "Kênh vận hành nội bộ",
      line: linkedShop.line,
      notes: clientForm.notes?.trim() || "Chưa có ghi chú.",
      tasks: clientForm.tasks?.filter(Boolean) ?? [],
      costsMonthly: Math.max(0, Math.floor(Number(clientForm.costsMonthly) || 0)),
    };
    setClientsState((previous) => editingClient ? previous.map((item) => item.id === editingClient.id ? safeClient : item) : [safeClient, ...previous]);
    appendAudit(`${editingClient ? "Cập nhật" : "Thêm"} khách hàng ${safeClient.name}; chỉ lưu cục bộ.`);
    setModal(null);
    toast.success(editingClient ? "Đã cập nhật khách hàng trong dữ liệu mẫu." : "Đã thêm khách hàng vào dữ liệu mẫu.");
  };

  const openCampaignModal = (campaign?: Campaign) => {
    const value = campaign ?? { id: "", name: "", sellerProductIds: productsState.slice(0, 2).map((product) => product.id), creatorIds: creatorsState.slice(0, 3).map((creator) => creator.id), targetGmv: 0, commissionBudget: 0, status: "Draft", fulfillment: "Đang chuẩn bị", startsAt: "2026-10-13", endsAt: "2026-11-13" };
    setEditingCampaign(campaign ?? null);
    setCampaignForm(value);
    setModal("campaign");
  };

  const saveCampaign = () => {
    if (!campaignForm.name?.trim()) { toast.error("Cần có tên chiến dịch."); return; }
    const startsAt = campaignForm.startsAt ?? "2026-10-13";
    const endsAt = campaignForm.endsAt ?? "2026-11-13";
    if (endsAt < startsAt) { toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu."); return; }
    const status = campaignForm.status ?? "Draft";
    const fulfillment: Campaign["fulfillment"] = status === "Completed" ? "Đã đối soát" : status === "Active" ? "Đang thực hiện" : "Đang chuẩn bị";
    const safeCampaign: Campaign = {
      id: editingCampaign?.id ?? `camp-local-${Date.now()}`,
      name: campaignForm.name.trim(),
      sellerProductIds: campaignForm.sellerProductIds?.length ? campaignForm.sellerProductIds : productsState.slice(0, 2).map((product) => product.id),
      creatorIds: campaignForm.creatorIds?.length ? campaignForm.creatorIds : creatorsState.slice(0, 3).map((creator) => creator.id),
      targetGmv: Math.max(0, Math.floor(Number(campaignForm.targetGmv) || 0)),
      commissionBudget: Math.max(0, Math.floor(Number(campaignForm.commissionBudget) || 0)),
      status,
      fulfillment,
      startsAt,
      endsAt,
    };
    setCampaignsState((previous) => editingCampaign ? previous.map((item) => item.id === editingCampaign.id ? safeCampaign : item) : [safeCampaign, ...previous]);
    appendAudit(`${editingCampaign ? "Cập nhật" : "Tạo"} chiến dịch ${safeCampaign.name}; không gọi API TikTok Shop.`);
    setModal(null);
    setSelectedCampaign(safeCampaign);
    toast.success("Đã lưu chiến dịch vào dữ liệu mẫu — không có API nào được gọi.");
  };

  const changeCampaignStatus = (campaign: Campaign, status: Campaign["status"]) => {
    const fulfillment: Campaign["fulfillment"] = status === "Completed" ? "Đã đối soát" : status === "Active" ? "Đang thực hiện" : "Đang chuẩn bị";
    const updated: Campaign = { ...campaign, status, fulfillment };
    setCampaignsState((previous) => previous.map((item) => item.id === campaign.id ? updated : item));
    setSelectedCampaign(updated);
    appendAudit(`Đổi trạng thái ${campaign.name} thành ${status}; không gọi API TikTok Shop.`);
    toast.success(`Đã đổi trạng thái demo sang ${status}. Không có API nào được gọi.`);
  };

  const openProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setModal("product");
  };

  const saveProduct = () => {
    if (!editingProduct || !productForm.title?.trim()) { toast.error("Sản phẩm cần có tiêu đề."); return; }
    const sellingPrice = Number(productForm.sellingPrice);
    const stock = Number(productForm.stock);
    const commissionRate = Number(productForm.commissionRate);
    if (!Number.isInteger(sellingPrice) || sellingPrice < 0 || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(commissionRate) || commissionRate < 0) {
      toast.error("Giá và tồn kho phải là số nguyên không âm; hoa hồng không được âm.");
      return;
    }
    const updated: Product = { ...editingProduct, title: productForm.title.trim(), description: productForm.description?.trim() || "", sellingPrice, stock, commissionRate, status: productForm.status ?? editingProduct.status };
    setProductsState((previous) => previous.map((item) => item.id === editingProduct.id ? updated : item));
    appendAudit(`Cập nhật sản phẩm ${updated.sku}: giá/tồn kho/hoa hồng chỉ lưu cục bộ.`);
    setModal(null);
    toast.success("Đã lưu chỉnh sửa dữ liệu mẫu và tạo sự kiện audit cục bộ.");
  };

  const saveCreator = () => {
    if (!selectedCreator) return;
    const updated: Creator = { ...selectedCreator, niche: creatorForm.niche?.trim() || selectedCreator.niche, relationship: creatorForm.relationship ?? selectedCreator.relationship, deliverables: creatorForm.deliverables?.trim() || selectedCreator.deliverables };
    setCreatorsState((previous) => previous.map((item) => item.id === updated.id ? updated : item));
    setSelectedCreator(updated);
    appendAudit(`Cập nhật hồ sơ ${updated.name}; không gửi tin nhắn ra ngoài.`);
    toast.success("Đã cập nhật hồ sơ cục bộ. Không có tin nhắn nào được gửi.");
  };

  const nav = (target: Page) => { setPage(target); setSidebarOpen(false); setQuery(""); };

  const renderOverview = () => {
    const eligibleCount = filteredOrders.filter((order) => order.status === "eligible").length;
    return <>
      <div className="page-intro"><div><span className="eyebrow">REVIEW DESK · {period} NGÀY</span><h1>Hiệu suất agency</h1><p>Đọc GMV, doanh thu và phần lợi nhuận đóng góp từ cùng một sổ dữ liệu mẫu.</p></div><div className="intro-actions"><button className="button secondary" onClick={exportCsv}><Download size={16} /> Xuất CSV</button><button className="button" onClick={() => nav("analysis")}><BarChart3 size={16} /> Mở phân tích</button></div></div>
      <div className="metrics-grid">
        <MetricCard label="GMV đủ điều kiện" value={formatVnd(summary.eligibleGmv, true)} detail="sau hoàn / hủy" />
        <MetricCard label="Doanh thu agency" value={formatVnd(finance.agencyRevenue, true)} detail="phí + phần hoa hồng" tone="ink" />
        <MetricCard label="Lợi nhuận đóng góp" value={formatVnd(finance.contributionProfit, true)} detail="sau creator, ads, live" />
        <MetricCard label="Hoa hồng chờ quyết toán" value={formatVnd(summary.pendingCommission + summary.estimatedCommission, true)} detail="ước tính + pending" tone="amber" />
      </div>
      <div className="overview-main-grid">
        <Panel className="trend-panel" title="GMV đủ điều kiện theo ngày" action={<span className="panel-note">{formatNumber(eligibleCount)} dòng đủ điều kiện</span>}><TrendChart rows={trend} /></Panel>
        <Panel className="mix-panel" title="Tỷ trọng GMV theo line"><RevenueMix rows={mix} /><div className="mix-footnote">Phân bổ theo GMV đủ điều kiện, không phải doanh thu agency.</div></Panel>
      </div>
      <div className="reconciliation-strip">
        <div><span>GMV gộp</span><strong>{formatVnd(summary.grossGmv, true)}</strong></div><ChevronRight size={16} />
        <div className="negative"><span>Hoàn / hủy</span><strong>−{formatVnd(summary.refundedOrCanceled, true)}</strong></div><ChevronRight size={16} />
        <div className="teal"><span>GMV đủ điều kiện</span><strong>{formatVnd(summary.eligibleGmv, true)}</strong></div><span className="strip-divider" />
        <div><span>Hoa hồng ước tính</span><strong>{formatVnd(summary.estimatedCommission, true)}</strong></div>
        <div><span>Đã quyết toán</span><strong>{formatVnd(summary.settledCommission, true)}</strong></div>
      </div>
      <div className="two-col-ledger">
        <Panel title="Client theo GMV đủ điều kiện" action={<button className="text-button" onClick={() => nav("clients")}>Xem khách hàng <ChevronRight size={15} /></button>}>
          <div className="ranking-list">{shopRows.slice(0, 5).map((row, index) => <button key={row.shop.id} className="rank-row" onClick={() => { const client = clientsState.find((item) => item.id === row.shop.clientId); if (client) { setSelectedClient(client); nav("clients"); } }}><span className="rank-number">0{index + 1}</span><span className="rank-name"><b>{row.shop.name}</b><small>{row.shop.line} · {formatNumber(row.orders)} đơn</small></span><strong>{formatVnd(row.eligibleGmv, true)}</strong></button>)}</div>
        </Panel>
        <Panel title="Creator & đối tác đóng góp" action={<button className="text-button" onClick={() => nav("creators")}>Xem hồ sơ <ChevronRight size={15} /></button>}>
          <div className="ranking-list">{creatorRows.slice(0, 5).map((row, index) => <button key={row.creator.id} className="rank-row" onClick={() => { setSelectedCreator(row.creator); nav("creators"); }}><span className="rank-number">0{index + 1}</span><span className="rank-name"><b>{row.creator.name}</b><small>{row.creator.niche} · {row.creator.type}</small></span><strong>{formatVnd(row.attributedGmv, true)}</strong></button>)}</div>
        </Panel>
      </div>
      <Panel title="Cần xử lý" action={<span className="panel-note">Từ bản ghi mô phỏng</span>}>
        <div className="alert-list">{overviewAlerts.map((alert) => <button className="alert-row" key={alert.id} onClick={() => nav(alert.page)}><span className={`alert-icon ${alert.tone}`}>{alert.kind === "stock" ? <Package size={17} /> : alert.kind === "contract" ? <CalendarDays size={17} /> : <TrendingUp size={17} />}</span><span><b>{alert.title}</b><small>{alert.detail}</small></span><StatusPill tone={alert.tone}>{alert.label}</StatusPill></button>)}{overviewAlerts.length === 0 && <EmptyState title="Không có cảnh báo trong bộ lọc" detail="Dữ liệu mẫu hiện không có tồn kho thấp, quyền sắp hạn hay chiến dịch dưới nhịp." />}</div>
      </Panel>
    </>;
  };

  const renderAnalysis = () => {
    const tabs: AnalysisTab[] = ["Khách hàng", "Creator", "Sản phẩm", "Chiến dịch"];
    const rows = analysisTab === "Khách hàng" ? shopRows : analysisTab === "Creator" ? creatorRows : analysisTab === "Sản phẩm" ? productRows : campaignRows;
    const ordered = [...rows].sort((left: any, right: any) => {
      const leftValue = left.eligibleGmv ?? left.attributedGmv ?? left.gmv ?? 0;
      const rightValue = right.eligibleGmv ?? right.attributedGmv ?? right.gmv ?? 0;
      return sortDirection === "desc" ? rightValue - leftValue : leftValue - rightValue;
    });
    const visibleRows = ordered.filter((row: any) => analysisTab === "Khách hàng" ? matches(row.shop.name, row.shop.line) : analysisTab === "Creator" ? matches(row.creator.name, row.creator.niche) : analysisTab === "Sản phẩm" ? matches(row.product.title, row.product.sku) : matches(row.campaign.name, row.campaign.status));
    return <>
      <div className="page-intro"><div><span className="eyebrow">PHÂN TÍCH · BẢNG CÓ THỂ SẮP XẾP</span><h1>Phân tích hiệu suất</h1><p>So sánh đơn, chuyển đổi, GMV và thứ hạng trong bộ lọc hiện tại.</p></div><button className="button secondary" onClick={exportCsv}><FileSpreadsheet size={16} /> Xuất báo cáo đã lọc</button></div>
      <Panel className="analysis-hero"><div className="analysis-summary"><div><span>GMV đủ điều kiện</span><strong>{formatVnd(summary.eligibleGmv, true)}</strong><small>{formatNumber(sumOrders(filteredOrders))} đơn mẫu</small></div><div><span>Chuyển đổi bình quân</span><strong>{formatPercent(filteredOrders.length ? filteredOrders.reduce((total, order) => total + order.conversion, 0) / filteredOrders.length : 0)}</strong><small>theo dòng nguồn</small></div><div><span>Kênh dẫn đầu</span><strong>{getLeadingChannel(filteredOrders)}</strong><small>theo GMV đủ điều kiện</small></div></div><div className="channel-split"><span>Phân bổ kênh</span><div className="channel-bars">{(["VIDEO", "LIVE", "PRODUCT_CARD"] as const).map((channel) => { const value = filteredOrders.filter((order) => order.channel === channel).reduce((total, order) => total + order.eligibleGmv, 0); return <div key={channel}><span>{channel}</span><i style={{ width: `${summary.eligibleGmv ? Math.max(8, value / summary.eligibleGmv * 100) : 0}%` }} /><b>{formatVnd(value, true)}</b></div>; })}</div></div></Panel>
      <div className="tabbar" role="tablist" aria-label="Nhóm dữ liệu phân tích">{tabs.map((tab) => <button key={tab} role="tab" aria-selected={analysisTab === tab} className={analysisTab === tab ? "active" : ""} onClick={() => setAnalysisTab(tab)}>{tab}</button>)}</div>
      <Panel>
        <div className="table-toolbar"><div><span className="eyebrow">{analysisTab.toUpperCase()}</span><p>{formatNumber(visibleRows.length)} dòng trong bộ lọc</p></div><button className="sort-button" onClick={() => setSortDirection((previous) => previous === "desc" ? "asc" : "desc")}><SlidersHorizontal size={15} /> Sắp xếp GMV {sortDirection === "desc" ? "↓" : "↑"}</button></div>
        <div className="table-scroll"><table className="data-table analysis-table"><thead>{analysisTab === "Khách hàng" ? <tr><th>Hạng</th><th>Shop / line</th><th>GMV đủ điều kiện</th><th>Đơn</th><th>Tiến độ mục tiêu</th></tr> : analysisTab === "Creator" ? <tr><th>Hạng</th><th>Creator / niche</th><th>GMV quy thuộc</th><th>Đơn</th><th>Hoa hồng ước tính</th></tr> : analysisTab === "Sản phẩm" ? <tr><th>Hạng</th><th>Sản phẩm / SKU</th><th>GMV</th><th>Chuyển đổi</th><th>Đơn</th></tr> : <tr><th>Hạng</th><th>Chiến dịch</th><th>GMV</th><th>Hoa hồng</th><th>Tiến độ</th></tr>}</thead><tbody>
          {analysisTab === "Khách hàng" && visibleRows.map((row: any, index) => <tr key={row.shop.id}><td className="rank-cell">{index + 1}</td><td><b>{row.shop.name}</b><small><span className={`line-tag ${appLineClass(row.shop.line)}`}>{row.shop.line}</span> · {row.shop.owner}</small></td><td className="number-cell">{formatVnd(row.eligibleGmv, true)}</td><td>{formatNumber(row.orders)}</td><td><div className="progress-cell"><Progress value={row.achievement} /><span>{formatPercent(row.achievement)}</span></div></td></tr>)}
          {analysisTab === "Creator" && visibleRows.map((row: any, index) => <tr key={row.creator.id}><td className="rank-cell">{index + 1}</td><td><b>{row.creator.name}</b><small>{row.creator.niche} · {row.creator.type}</small></td><td className="number-cell">{formatVnd(row.attributedGmv, true)}</td><td>{formatNumber(row.orders)}</td><td>{formatVnd(row.estimatedCommission, true)}</td></tr>)}
          {analysisTab === "Sản phẩm" && visibleRows.map((row: any, index) => <tr key={row.product.id}><td className="rank-cell">{index + 1}</td><td><b>{row.product.title}</b><small>{row.product.sku} · {row.product.status}</small></td><td className="number-cell">{formatVnd(row.gmv, true)}</td><td>{formatPercent(row.conversion)}</td><td>{formatNumber(row.orders)}</td></tr>)}
          {analysisTab === "Chiến dịch" && visibleRows.map((row: any, index) => <tr key={row.campaign.id}><td className="rank-cell">{index + 1}</td><td><b>{row.campaign.name}</b><small>{row.campaign.status} · {row.campaign.fulfillment}</small></td><td className="number-cell">{formatVnd(row.gmv, true)}</td><td>{formatVnd(row.commission, true)}</td><td><div className="progress-cell"><Progress value={row.progress} /><span>{formatPercent(row.progress)}</span></div></td></tr>)}
        </tbody></table></div>
        {visibleRows.length === 0 && <EmptyState title="Không có bản ghi trong bộ lọc" detail="Hãy thử đổi business line, kỳ báo cáo hoặc từ khóa tìm kiếm." />}
      </Panel>
    </>;
  };

  const renderClients = () => {
    const visible = clientsState.filter((client) => (role === "Tất cả" || client.line === role) && matches(client.name, client.owner, shops.find((shop) => shop.id === client.shopId)?.name));
    return <>
      <div className="page-intro"><div><span className="eyebrow">VẬN HÀNH KHÁCH HÀNG</span><h1>Khách hàng</h1><p>Thông tin mô phỏng về shop, phí dịch vụ, quyền và lịch hợp đồng.</p></div><button className="button" onClick={() => openClientModal()}><Plus size={16} /> Thêm khách hàng</button></div>
      <Panel>
        <div className="table-toolbar"><div><span className="eyebrow">DANH SÁCH SHOP</span><p>{formatNumber(visible.length)} khách hàng dữ liệu mẫu</p></div><span className="local-note"><RefreshCcw size={14} /> Lưu trong trình duyệt</span></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Shop / business line</th><th>Người phụ trách</th><th>GMV {period} ngày</th><th>Phí dịch vụ</th><th>Đạt mục tiêu</th><th>Ủy quyền</th><th>Hết hạn</th><th aria-label="Thao tác" /></tr></thead><tbody>{visible.map((client) => { const shop = shops.find((item) => item.id === client.shopId); const row = shopRows.find((item) => item.shop.id === client.shopId); if (!shop) return <tr key={client.id}><td><b>{client.name}</b><small>Shop dữ liệu cục bộ</small></td><td>{client.owner}</td><td>—</td><td>{formatVnd(client.costsMonthly)}</td><td>—</td><td><StatusPill>Chưa gắn</StatusPill></td><td>—</td><td><button className="row-action" onClick={() => setSelectedClient(client)}>Xem</button></td></tr>; return <tr key={client.id}><td><b>{shop.name}</b><small><span className={`line-tag ${appLineClass(shop.line)}`}>{shop.line}</span> · {client.name}</small></td><td>{client.owner}</td><td className="number-cell">{formatVnd(row?.eligibleGmv ?? 0, true)}</td><td>{formatVnd(shop.serviceFeeMonthly, true)}</td><td><div className="progress-cell"><Progress value={row?.achievement ?? 0} /><span>{formatPercent(row?.achievement ?? 0)}</span></div></td><td><StatusPill tone={shop.authorization === "Đầy đủ" ? "success" : shop.authorization === "Sắp hết hạn" ? "warning" : "danger"}>{shop.authorization}</StatusPill></td><td>{fullDate(shop.expiresAt)}</td><td><button className="row-action" onClick={() => setSelectedClient(client)}>Xem</button></td></tr>; })}</tbody></table></div>
        {visible.length === 0 && <EmptyState title="Không tìm thấy khách hàng" detail="Từ khóa hiện tại không khớp với hồ sơ mô phỏng nào." />}
      </Panel>
    </>;
  };

  const renderCreators = () => {
    const visible = creatorRows.filter((row) => matches(row.creator.name, row.creator.niche, row.creator.relationship));
    return <>
      <div className="page-intro"><div><span className="eyebrow">MẠNG LƯỚI CREATOR</span><h1>Creator & đối tác</h1><p>Quy thuộc GMV, deliverable, chi phí booking và trạng thái quan hệ — không có liên lạc thực.</p></div><span className="local-note"><CloudOff size={14} /> Không gửi tin nhắn ra ngoài</span></div>
      <Panel><div className="table-toolbar"><div><span className="eyebrow">HỒ SƠ HỢP TÁC</span><p>{formatNumber(visible.length)} creator / đối tác trong bộ lọc</p></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Creator / niche</th><th>Chiến dịch liên kết</th><th>GMV quy thuộc</th><th>Hoa hồng</th><th>Booking fee</th><th>Lợi nhuận đóng góp</th><th>Trạng thái</th><th /></tr></thead><tbody>{visible.map((row) => <tr key={row.creator.id}><td><b>{row.creator.name}</b><small>{row.creator.type} · {row.creator.niche}</small></td><td><span className="campaign-count">{row.creator.campaigns.length} chiến dịch</span><small>{row.creator.deliverables}</small></td><td className="number-cell">{formatVnd(row.attributedGmv, true)}<small>{formatNumber(row.orders)} đơn</small></td><td><b>{formatVnd(row.estimatedCommission, true)}</b><small>Đã QT: {formatVnd(row.settledCommission, true)}</small></td><td>{formatVnd(row.bookingFee, true)}</td><td className={row.contributionProfit >= 0 ? "profit" : "loss"}>{formatVnd(row.contributionProfit, true)}</td><td><StatusPill tone={row.creator.relationship === "Đang hợp tác" ? "success" : "warning"}>{row.creator.relationship}</StatusPill></td><td><button className="row-action" onClick={() => { setSelectedCreator(row.creator); setCreatorForm(row.creator); }}>Hồ sơ</button></td></tr>)}</tbody></table></div>{visible.length === 0 && <EmptyState title="Không có hồ sơ phù hợp" detail="Đổi bộ lọc để xem dữ liệu creator / đối tác." />}</Panel>
    </>;
  };

  const renderCampaigns = () => {
    const visible = campaignRows.filter((row) => matches(row.campaign.name, row.campaign.status, row.campaign.fulfillment));
    return <>
      <div className="page-intro"><div><span className="eyebrow">TAP · QUẢN LÝ CHIẾN DỊCH</span><h1>Chiến dịch TAP</h1><p>Theo dõi kế hoạch, sản phẩm seller, creator và tiến độ từ cùng mô hình dữ liệu mẫu.</p></div><button className="button" onClick={() => openCampaignModal()}><Plus size={16} /> Tạo chiến dịch</button></div>
      <div className="campaign-grid">{visible.map((row) => <button className="campaign-card" key={row.campaign.id} onClick={() => setSelectedCampaign(row.campaign)}><div className="campaign-card-top"><StatusPill tone={row.campaign.status === "Active" ? "success" : row.campaign.status === "Completed" ? "neutral" : "warning"}>{row.campaign.status}</StatusPill><span>{row.campaign.fulfillment}</span></div><h2>{row.campaign.name}</h2><p>{fullDate(row.campaign.startsAt)} — {fullDate(row.campaign.endsAt)}</p><div className="campaign-value"><span>GMV / mục tiêu</span><strong>{formatVnd(row.gmv, true)} <i>/ {formatVnd(row.campaign.targetGmv, true)}</i></strong></div><Progress value={row.progress} /><div className="campaign-meta"><span>{row.campaign.creatorIds.length} creator</span><span>{row.campaign.sellerProductIds.length} sản phẩm</span><span>{formatVnd(row.commission, true)} HH</span></div></button>)}</div>
      {visible.length === 0 && <Panel><EmptyState title="Không có chiến dịch trong bộ lọc" detail="Chiến dịch TAP chỉ xuất hiện ở bộ lọc Tất cả hoặc TAP." /></Panel>}
    </>;
  };

  const renderProducts = () => {
    const visible = productRows.filter((row) => matches(row.product.title, row.product.sku, shops.find((shop) => shop.id === row.product.shopId)?.name));
    return <>
      <div className="page-intro"><div><span className="eyebrow">DANH MỤC SELLER</span><h1>Sản phẩm</h1><p>Chỉnh sửa mô phỏng có kiểm soát; không có xóa tùy ý hay thay đổi listing thật.</p></div><span className="local-note"><ShieldCheck size={14} /> Có audit cục bộ</span></div>
      <Panel><div className="table-toolbar"><div><span className="eyebrow">12 SKU HƯ CẤU</span><p>Giá bán, tồn kho và hoa hồng affiliate được tách riêng.</p></div><button className="text-button" onClick={() => setPage("connections")}>Xem giới hạn API tương lai <ChevronRight size={15} /></button></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Sản phẩm / SKU</th><th>Shop</th><th>Giá bán</th><th>Tồn kho</th><th>Hoa hồng</th><th>GMV</th><th>Chuyển đổi</th><th>Listing</th><th /></tr></thead><tbody>{visible.map((row) => { const shop = shops.find((item) => item.id === row.product.shopId); return <tr key={row.product.id}><td><b>{row.product.title}</b><small>{row.product.sku}</small></td><td>{shop?.name}<small><span className={`line-tag ${appLineClass(row.product.line)}`}>{row.product.line}</span></small></td><td>{formatVnd(row.product.sellingPrice)}</td><td className={row.product.stock < 12 ? "stock-low" : ""}>{formatNumber(row.product.stock)}</td><td>{formatPercent(row.product.commissionRate, 0)}</td><td className="number-cell">{formatVnd(row.gmv, true)}</td><td>{formatPercent(row.conversion)}</td><td><StatusPill tone={row.product.status === "Đang bán" ? "success" : "warning"}>{row.product.status}</StatusPill></td><td><button className="row-action" onClick={() => openProductModal(row.product)}><Pencil size={14} /> Sửa</button></td></tr>; })}</tbody></table></div>{visible.length === 0 && <EmptyState title="Không tìm thấy sản phẩm" detail="Hãy thay đổi bộ lọc hoặc từ khóa." />}</Panel>
      <Panel className="audit-panel" title="Dấu vết demo cục bộ"><ul>{audit.slice(0, 5).map((entry) => <li key={entry}><Check size={14} />{entry}</li>)}</ul></Panel>
    </>;
  };

  const renderFinance = () => {
    const ledger = filteredOrders.filter((order) => matches(order.id, shops.find((shop) => shop.id === order.shopId)?.name, creatorsState.find((creator) => creator.id === order.creatorId)?.name)).slice(-18).reverse();
    const commissionRows: { status: string; value: number; tone: "teal" | "warning" | "success" | "danger" | "neutral"; detail: string }[] = [
      { status: "Ước tính", value: finance.estimatedCommission, tone: "teal", detail: "Mới phát sinh, chưa đến ngưỡng đối soát" },
      { status: "Chờ quyết toán", value: finance.pendingCommission, tone: "warning", detail: "Đủ điều kiện, chờ trạng thái đối soát" },
      { status: "Đã quyết toán", value: finance.settledCommission, tone: "success", detail: "Đã vào nhóm settled của dữ liệu mẫu" },
      { status: "Không đủ điều kiện", value: finance.ineligibleCommission, tone: "danger", detail: "Gắn với dòng hoàn hoặc hủy" },
      { status: "Đang đóng băng", value: finance.frozenCommission, tone: "neutral", detail: "Trạng thái kiểm tra mô phỏng" },
    ];
    return <>
      <div className="page-intro"><div><span className="eyebrow">ĐỐI SOÁT & LỢI NHUẬN</span><h1>Tài chính</h1><p>Phân biệt GMV, doanh thu agency, chi phí và lợi nhuận đóng góp trong dữ liệu mẫu.</p></div><button className="button secondary" onClick={exportCsv}><Download size={16} /> Xuất sổ dòng</button></div>
      <div className="finance-grid"><Panel title="Cầu nối hoa hồng"><div className="commission-stack">{commissionRows.map((item) => <div className="commission-line" key={item.status}><div><StatusPill tone={item.tone}>{item.status}</StatusPill><small>{item.detail}</small></div><strong>{formatVnd(item.value, true)}</strong></div>)}</div></Panel><Panel title="Cầu nối lợi nhuận đóng góp"><div className="profit-bridge"><div><span>Phí quản lý client</span><strong>+{formatVnd(finance.managementFees, true)}</strong></div><div><span>Phần hoa hồng agency</span><strong>+{formatVnd(finance.agencyCommissionShare, true)}</strong></div><div><span>Booking / service revenue</span><strong>+{formatVnd(finance.bookingRevenue, true)}</strong></div><div className="subtotal"><span>Doanh thu agency</span><strong>{formatVnd(finance.agencyRevenue, true)}</strong></div><div className="cost"><span>Chi phí creator payout</span><strong>−{formatVnd(finance.creatorCosts, true)}</strong></div><div className="cost"><span>Ads cost</span><strong>−{formatVnd(finance.adsCost, true)}</strong></div><div className="cost"><span>Sản xuất / livestream</span><strong>−{formatVnd(finance.productionLiveCost, true)}</strong></div><div className="profit-total"><span>Lợi nhuận đóng góp</span><strong>{formatVnd(finance.contributionProfit, true)}</strong></div></div></Panel></div>
      <div className="formula-note"><div><strong>Doanh thu agency</strong><span>= phí quản lý + phần hoa hồng agency + booking / service revenue</span></div><div><strong>Lợi nhuận đóng góp</strong><span>= doanh thu agency − chi phí creator − ads − sản xuất / live</span></div><p>GMV không phải doanh thu. Chi phí chỉ được trừ một lần, không trừ lại khoản đã được net trong doanh thu.</p></div>
      <Panel title="Sổ dòng đơn hàng mẫu" action={<span className="panel-note">{formatNumber(ledger.length)} / {formatNumber(filteredOrders.length)} dòng</span>}><div className="table-scroll"><table className="data-table ledger-table"><thead><tr><th>Mã / ngày</th><th>Shop</th><th>GMV gộp</th><th>Hoàn/hủy</th><th>GMV đủ điều kiện</th><th>Hoa hồng</th><th>Trạng thái</th></tr></thead><tbody>{ledger.map((order) => <tr key={order.id}><td><b>{order.id}</b><small>{fullDate(order.date)} · {order.channel}</small></td><td>{shops.find((shop) => shop.id === order.shopId)?.name}</td><td>{formatVnd(order.grossGmv, true)}</td><td className="loss">{order.refundOrCancel ? `−${formatVnd(order.refundOrCancel, true)}` : "—"}</td><td className="number-cell">{formatVnd(order.eligibleGmv, true)}</td><td>{formatVnd(order.commission, true)}</td><td><StatusPill tone={order.commissionStatus === "settled" ? "success" : order.commissionStatus === "pending" ? "warning" : order.commissionStatus === "ineligible" ? "danger" : "neutral"}>{order.commissionStatus}</StatusPill></td></tr>)}</tbody></table></div>{ledger.length === 0 && <EmptyState title="Không có dòng đối soát" detail="Bộ lọc hiện tại chưa có dữ liệu sổ mẫu." />}</Panel>
    </>;
  };

  const renderConnections = () => {
    const capabilities = [
      ["Đối tác TAP", "category_asset_cipher", "Chỉ minh họa quyền partner theo danh mục / tài sản"],
      ["Seller shop", "shop_cipher", "Chỉ minh họa quyền cấp shop của seller"],
      ["Creator", "creator authorization", "Chỉ minh họa sự đồng ý / ủy quyền của creator"],
    ];
    return <>
      <div className="page-intro"><div><span className="eyebrow">RANH GIỚI QUYỀN & TÍCH HỢP</span><h1>Kết nối & quyền</h1><p>Tất cả trạng thái dưới đây là giả lập, phục vụ review kiến trúc sản phẩm.</p></div><button className="button" onClick={() => setModal("connect")}><Link2 size={16} /> Kết nối TikTok Shop</button></div>
      <Panel className="sync-panel"><div className="sync-symbol"><CloudOff size={22} /></div><div><span className="eyebrow">DEMO STATE</span><h2>Chưa có liên kết thực</h2><p>Sync lần cuối: <strong>13/10/2026 10:00 ICT · dữ liệu mẫu khởi tạo</strong></p></div><StatusPill tone="warning">Không đồng bộ</StatusPill></Panel>
      <div className="permission-grid"><Panel title="Trạng thái ủy quyền shop"><div className="authorization-list">{shops.map((shop) => <div key={shop.id}><div><b>{shop.name}</b><small>{shop.line} · hết hạn {fullDate(shop.expiresAt)}</small></div><StatusPill tone={shop.authorization === "Đầy đủ" ? "success" : shop.authorization === "Sắp hết hạn" ? "warning" : "danger"}>{shop.authorization}</StatusPill></div>)}</div></Panel><Panel title="Capability map tách biệt"><div className="capability-map">{capabilities.map(([scope, key, detail]) => <div key={key}><span className="capability-scope">{scope}</span><code>{key}</code><p>{detail}</p></div>)}</div></Panel></div>
      <Panel title="Nguyên tắc dữ liệu"><div className="principle-grid"><div><ShieldCheck size={18} /><strong>Không dùng credential</strong><span>Không token, không secret, không gọi TikTok Shop.</span></div><div><CloudOff size={18} /><strong>Không giả vờ đồng bộ</strong><span>Nút kết nối chỉ mở giải thích tích hợp tương lai.</span></div><div><ClipboardList size={18} /><strong>Không có giao dịch thực</strong><span>Đơn, hoa hồng và trạng thái đều là bản ghi tổng hợp hư cấu.</span></div></div></Panel>
    </>;
  };

  const content = page === "companyAgents" ? <CompanyAgentsDemo profileId={profileId} onProfileChange={changeProfile} onOpenData={() => nav("dataCapabilities")} /> : page === "dataCapabilities" ? <DataCapabilities /> : page === "overview" ? renderOverview() : page === "analysis" ? renderAnalysis() : page === "clients" ? renderClients() : page === "creators" ? renderCreators() : page === "campaigns" ? renderCampaigns() : page === "products" ? renderProducts() : page === "finance" ? renderFinance() : renderConnections();

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Điều hướng Nina Agency Hub"><div className="brand"><NinaMark /><span className="brand-name">Nina Agency Hub</span><button className="sidebar-close icon-button" onClick={() => setSidebarOpen(false)} aria-label="Đóng điều hướng"><PanelLeftClose size={18} /></button></div><div className="sidebar-label">HỆ ĐIỀU HÀNH AGENCY</div><nav>{(Object.keys(pageMeta) as Page[]).map((item) => { const meta = pageMeta[item]; const Icon = meta.icon; return <div key={item}>{meta.group && <div className="nav-group">{meta.group}</div>}<button className={`nav-item ${page === item ? "active" : ""}`} onClick={() => nav(item)}><Icon size={17} /><span>{meta.label}</span>{page === item && <i />}</button></div>; })}</nav><div className="sidebar-footer"><DemoBadge /><button className="reset-button" onClick={resetDemo}><RefreshCcw size={14} /> Đặt lại demo</button><div className="user-chip"><span>{activeMember.name.split(" ").map(part => part[0]).slice(0, 2).join("")}</span><div style={{ minWidth: 0, flex: 1 }}><label htmlFor="demo-profile" style={{ display: "block", fontSize: 11 }}>Hồ sơ demo</label><select id="demo-profile" aria-label="Đổi hồ sơ demo" value={profileId} onChange={event => changeProfile(event.target.value)} style={{ width: "100%", background: "transparent", color: "inherit", border: 0, font: "inherit", cursor: "pointer" }}>{companyTeam.map(member => <option key={member.id} value={member.id} style={{ color: "#222" }}>{member.name} · {member.title}</option>)}</select><small>{activeMember.title} · Mô phỏng</small></div></div></div></aside>
    {sidebarOpen && <button className="mobile-scrim" aria-label="Đóng điều hướng" onClick={() => setSidebarOpen(false)} />}
    <main className="workspace"><header className="topbar"><button className="mobile-menu icon-button" onClick={() => setSidebarOpen(true)} aria-label="Mở điều hướng"><Menu size={19} /></button><img className="topbar-logo" src={brandAsset("Primary_Orange.webp")} alt="Nina Agency Hub" /><div className="topbar-title"><span>{currentMeta.group ?? "TỔNG QUAN"}</span><b>{currentMeta.label}</b></div><label className="global-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm shop, creator, SKU..." aria-label="Tìm trong trang hiện tại" /></label><div className="filter-group"><label><span>LINE</span><select value={role} onChange={(event) => setRole(event.target.value as RoleFilter)} aria-label="Lọc business line">{roleOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>KỲ</span><select value={period} onChange={(event) => setPeriod(Number(event.target.value) as PeriodDays)} aria-label="Lọc kỳ báo cáo">{periodOptions.map((option) => <option key={option} value={option}>{option} ngày</option>)}</select></label></div><button className="assistant-launcher" onClick={() => setAssistantOpen(true)} aria-label="Mở BOD Assistant"><Bot size={15} /><span>BOD Assistant</span></button><DemoBadge /><button className="icon-button bell" aria-label="Thông báo dữ liệu mẫu"><BellRing size={18} /><i /></button></header><div className="mobile-mode-note"><DemoBadge /></div><div className="page-content">{content}</div></main>
    {selectedClient && <Drawer title={selectedClient.name} onClose={() => setSelectedClient(null)}><div className="drawer-kicker"><span className={`line-tag ${appLineClass(selectedClient.line)}`}>{selectedClient.line}</span><span>Hồ sơ client mẫu</span></div><div className="drawer-section"><h3>Shop liên kết</h3><InfoRow label="Tên shop"><b>{shops.find((shop) => shop.id === selectedClient.shopId)?.name ?? "Shop cục bộ"}</b></InfoRow><InfoRow label="Mô hình phí">{shops.find((shop) => shop.id === selectedClient.shopId)?.feeModel ?? "Chưa gắn mô hình"}</InfoRow><InfoRow label="Chi phí vận hành">{formatVnd(selectedClient.costsMonthly, true)} / tháng</InfoRow></div><div className="drawer-section"><h3>Liên hệ & ghi chú</h3><InfoRow label="Owner">{selectedClient.owner}</InfoRow><InfoRow label="Kênh liên hệ">{selectedClient.contact}</InfoRow><p className="note-box">{selectedClient.notes}</p></div><div className="drawer-section"><h3>Tác vụ mẫu</h3><ul className="task-list">{selectedClient.tasks.length ? selectedClient.tasks.map((task) => <li key={task}><span />{task}</li>) : <li><span />Chưa có tác vụ</li>}</ul></div><div className="drawer-actions"><button className="button secondary" onClick={() => { setSelectedClient(null); openClientModal(selectedClient); }}><Pencil size={15} /> Sửa hồ sơ</button><button className="button ghost" onClick={() => setSelectedClient(null)}>Đóng</button></div></Drawer>}
    {selectedCreator && <Drawer title={selectedCreator.name} onClose={() => setSelectedCreator(null)}><div className="drawer-kicker"><span className={`line-tag ${appLineClass(selectedCreator.line)}`}>{selectedCreator.line}</span><span>{selectedCreator.type} · hồ sơ mẫu</span></div><div className="drawer-section"><h3>Hiệu suất liên quan</h3>{(() => { const row = creatorRows.find((item) => item.creator.id === selectedCreator.id); return <><InfoRow label="GMV quy thuộc">{formatVnd(row?.attributedGmv ?? 0, true)}</InfoRow><InfoRow label="Hoa hồng ước tính">{formatVnd(row?.estimatedCommission ?? 0, true)}</InfoRow><InfoRow label="Booking fee">{formatVnd(selectedCreator.bookingFee, true)}</InfoRow></>; })()}</div><div className="drawer-section form-compact"><h3>Chỉnh sửa cục bộ</h3><label>Niche<input value={creatorForm.niche ?? ""} onChange={(event) => setCreatorForm((previous) => ({ ...previous, niche: event.target.value }))} /></label><label>Deliverables<input value={creatorForm.deliverables ?? ""} onChange={(event) => setCreatorForm((previous) => ({ ...previous, deliverables: event.target.value }))} /></label><label>Trạng thái<select value={creatorForm.relationship ?? selectedCreator.relationship} onChange={(event) => setCreatorForm((previous) => ({ ...previous, relationship: event.target.value as Creator["relationship"] }))}><option>Đang hợp tác</option><option>Cần gia hạn</option><option>Đang đánh giá</option></select></label></div><div className="drawer-section"><h3>Chiến dịch liên kết</h3><div className="tag-list">{selectedCreator.campaigns.map((id) => <span key={id}>{campaignsState.find((campaign) => campaign.id === id)?.name ?? id}</span>)}</div></div><div className="drawer-actions"><button className="button" onClick={saveCreator}><Check size={15} /> Lưu demo</button><button className="button ghost" onClick={() => setSelectedCreator(null)}>Đóng</button></div></Drawer>}
    {selectedCampaign && <Drawer title={selectedCampaign.name} onClose={() => setSelectedCampaign(null)}><div className="drawer-kicker"><StatusPill tone={selectedCampaign.status === "Active" ? "success" : selectedCampaign.status === "Completed" ? "neutral" : "warning"}>{selectedCampaign.status}</StatusPill><span>{selectedCampaign.fulfillment}</span></div>{(() => { const row = campaignRows.find((item) => item.campaign.id === selectedCampaign.id); return <><div className="drawer-section"><h3>Tiến độ mẫu</h3><InfoRow label="GMV"><b>{formatVnd(row?.gmv ?? 0, true)} / {formatVnd(selectedCampaign.targetGmv, true)}</b></InfoRow><Progress value={row?.progress ?? 0} /><InfoRow label="Hoa hồng phát sinh">{formatVnd(row?.commission ?? 0, true)}</InfoRow><InfoRow label="Creator">{selectedCampaign.creatorIds.length} hồ sơ</InfoRow></div></>; })()}<div className="drawer-section"><h3>Sản phẩm seller</h3><div className="tag-list">{selectedCampaign.sellerProductIds.map((id) => <span key={id}>{productsState.find((product) => product.id === id)?.title ?? id}</span>)}</div></div><div className="drawer-section"><h3>Đổi trạng thái demo</h3><div className="status-actions">{(["Draft", "Active", "Completed"] as Campaign["status"][]).map((status) => <button key={status} className={selectedCampaign.status === status ? "selected" : ""} onClick={() => changeCampaignStatus(selectedCampaign, status)}>{status}</button>)}</div><p className="local-explainer">Thao tác này chỉ thay đổi bản ghi trong trình duyệt. Không có API TikTok Shop nào được gọi.</p></div><div className="drawer-actions"><button className="button secondary" onClick={() => { setSelectedCampaign(null); openCampaignModal(selectedCampaign); }}><Pencil size={15} /> Sửa chiến dịch</button><button className="button ghost" onClick={() => setSelectedCampaign(null)}>Đóng</button></div></Drawer>}
    {modal === "client" && <DialogShell title={editingClient ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"} onClose={() => setModal(null)}><form className="form-grid" onSubmit={(event) => { event.preventDefault(); saveClient(); }}><label>Tên khách hàng<input autoFocus value={clientForm.name ?? ""} onChange={(event) => setClientForm((previous) => ({ ...previous, name: event.target.value }))} required /></label><label>Người phụ trách<input value={clientForm.owner ?? ""} onChange={(event) => setClientForm((previous) => ({ ...previous, owner: event.target.value }))} required /></label><label>Shop liên kết<select value={clientForm.shopId ?? ""} onChange={(event) => { const shop = shops.find((item) => item.id === event.target.value); setClientForm((previous) => ({ ...previous, shopId: event.target.value, line: shop?.line ?? previous.line })); }}>{shops.map((shop) => <option key={shop.id} value={shop.id}>{shop.name} · {shop.line}</option>)}</select></label><label>Kênh liên hệ (nội bộ)<input value={clientForm.contact ?? ""} onChange={(event) => setClientForm((previous) => ({ ...previous, contact: event.target.value }))} /></label><label>Chi phí vận hành / tháng<input type="number" min="0" step="1" value={clientForm.costsMonthly ?? 0} onChange={(event) => setClientForm((previous) => ({ ...previous, costsMonthly: Number(event.target.value) }))} /></label><label className="span-2">Ghi chú<textarea value={clientForm.notes ?? ""} onChange={(event) => setClientForm((previous) => ({ ...previous, notes: event.target.value }))} /></label><div className="dialog-footer"><span>Chỉ lưu trong trình duyệt này.</span><button type="button" className="button ghost" onClick={() => setModal(null)}>Hủy</button><button className="button" type="submit"><Check size={15} /> Lưu demo</button></div></form></DialogShell>}
    {modal === "campaign" && <DialogShell title={editingCampaign ? "Chỉnh sửa chiến dịch TAP" : "Tạo chiến dịch TAP"} onClose={() => setModal(null)}><form className="form-grid" onSubmit={(event) => { event.preventDefault(); saveCampaign(); }}><label className="span-2">Tên chiến dịch<input autoFocus value={campaignForm.name ?? ""} onChange={(event) => setCampaignForm((previous) => ({ ...previous, name: event.target.value }))} required /></label><label>Mục tiêu GMV (VND)<input type="number" min="0" step="1" value={campaignForm.targetGmv ?? 0} onChange={(event) => setCampaignForm((previous) => ({ ...previous, targetGmv: Number(event.target.value) }))} /></label><label>Ngân sách hoa hồng (VND)<input type="number" min="0" step="1" value={campaignForm.commissionBudget ?? 0} onChange={(event) => setCampaignForm((previous) => ({ ...previous, commissionBudget: Number(event.target.value) }))} /></label><label>Trạng thái<select value={campaignForm.status ?? "Draft"} onChange={(event) => setCampaignForm((previous) => ({ ...previous, status: event.target.value as Campaign["status"] }))}><option>Draft</option><option>Active</option><option>Completed</option></select></label><label>Fulfillment<select value={campaignForm.fulfillment ?? "Đang chuẩn bị"} onChange={(event) => setCampaignForm((previous) => ({ ...previous, fulfillment: event.target.value as Campaign["fulfillment"] }))}><option>Đang chuẩn bị</option><option>Đang thực hiện</option><option>Đã đối soát</option></select></label><label>Ngày bắt đầu<input type="date" value={campaignForm.startsAt ?? ""} onChange={(event) => setCampaignForm((previous) => ({ ...previous, startsAt: event.target.value }))} /></label><label>Ngày kết thúc<input type="date" value={campaignForm.endsAt ?? ""} onChange={(event) => setCampaignForm((previous) => ({ ...previous, endsAt: event.target.value }))} /></label><div className="dialog-footer"><span>Không gọi API TikTok Shop.</span><button type="button" className="button ghost" onClick={() => setModal(null)}>Hủy</button><button className="button" type="submit"><Check size={15} /> Lưu demo</button></div></form></DialogShell>}
    {modal === "product" && editingProduct && <DialogShell title="Chỉnh sửa sản phẩm mẫu" onClose={() => setModal(null)} wide><form className="form-grid product-form" onSubmit={(event) => { event.preventDefault(); saveProduct(); }}><div className="future-api-note"><AlertTriangle size={17} /><span><b>Tách quyền hành động trong tương lai.</b> Giá bán / tồn kho là hành động seller; hoa hồng affiliate là hành động riêng. Lần lưu này chỉ thay đổi dữ liệu trình duyệt.</span></div><label className="span-2">Tiêu đề<input autoFocus value={productForm.title ?? ""} onChange={(event) => setProductForm((previous) => ({ ...previous, title: event.target.value }))} required /></label><label className="span-2">Mô tả<textarea value={productForm.description ?? ""} onChange={(event) => setProductForm((previous) => ({ ...previous, description: event.target.value }))} /></label><label>Giá bán (VND)<input type="number" min="0" step="1" value={productForm.sellingPrice ?? 0} onChange={(event) => setProductForm((previous) => ({ ...previous, sellingPrice: Number(event.target.value) }))} required /></label><label>Tồn kho<input type="number" min="0" step="1" value={productForm.stock ?? 0} onChange={(event) => setProductForm((previous) => ({ ...previous, stock: Number(event.target.value) }))} required /></label><label>Hoa hồng affiliate (0–1)<input type="number" min="0" max="1" step="0.01" value={productForm.commissionRate ?? 0} onChange={(event) => setProductForm((previous) => ({ ...previous, commissionRate: Number(event.target.value) }))} required /></label><label>Listing<select value={productForm.status ?? editingProduct.status} onChange={(event) => setProductForm((previous) => ({ ...previous, status: event.target.value as Product["status"] }))}><option>Đang bán</option><option>Tạm dừng</option><option>Bản nháp</option></select></label><div className="preview-box span-2"><span>Preview trước / sau</span><div><p><small>Trước</small><b>{formatVnd(editingProduct.sellingPrice)} · tồn {formatNumber(editingProduct.stock)} · HH {formatPercent(editingProduct.commissionRate, 0)}</b></p><ChevronRight size={16} /><p><small>Sau</small><b>{formatVnd(Number(productForm.sellingPrice) || 0)} · tồn {formatNumber(Number(productForm.stock) || 0)} · HH {formatPercent(Number(productForm.commissionRate) || 0, 0)}</b></p></div></div><div className="dialog-footer"><span>Không có thao tác xóa sản phẩm.</span><button type="button" className="button ghost" onClick={() => setModal(null)}>Hủy</button><button className="button" type="submit"><Check size={15} /> Lưu thay đổi demo</button></div></form></DialogShell>}
    {modal === "connect" && <DialogShell title="Tích hợp TikTok Shop — bản thiết kế tương lai" onClose={() => setModal(null)}><div className="integration-dialog"><div className="integration-icon"><Link2 size={23} /></div><h3>Không thực hiện kết nối trong mockup này</h3><p>Nina Agency Hub hiện chỉ trình bày cấu trúc quyền và dữ liệu. Nút này không mở OAuth, không nhận credential, không gọi API và không đồng bộ TikTok Shop.</p><div className="integration-steps"><div><b>1</b><span>Seller cấp <code>shop_cipher</code></span></div><div><b>2</b><span>Đối tác cấp <code>category_asset_cipher</code></span></div><div><b>3</b><span>Creator hoàn tất ủy quyền riêng</span></div></div><button className="button" onClick={() => setModal(null)}>Đã hiểu</button></div></DialogShell>}
    {assistantOpen && <AssistantDrawer memberName={activeMember.name} period={period} role={role} summary={summary} finance={finance} mix={mix} filteredOrders={filteredOrders} alerts={overviewAlerts} messages={assistantMessages} onAsk={askAssistant} onClose={() => setAssistantOpen(false)} />}
    <Toaster position="bottom-right" richColors closeButton />
  </div>;
}

function sumOrders(ordersToSum: DemoOrder[]) {
  return ordersToSum.reduce((total, order) => total + order.orders, 0);
}

function getLeadingChannel(ordersToReview: DemoOrder[]) {
  const totals = (["VIDEO", "LIVE", "PRODUCT_CARD"] as const).map((channel) => ({ channel, value: ordersToReview.filter((order) => order.channel === channel).reduce((total, order) => total + order.eligibleGmv, 0) }));
  return totals.sort((a, b) => b.value - a.value)[0]?.channel ?? "—";
}
