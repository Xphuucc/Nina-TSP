export type CompanyResource = "overview" | "kol" | "booking" | "brand" | "campaign" | "mcn" | "tap" | "livestream" | "leads" | "invoices" | "cashflow" | "administration";
export type CompanyAction = "read" | "manage";
export interface CompanyMember {
  id: string;
  name: string;
  title: string;
  scope: "all_company" | "kol_booking" | "socom" | "leads" | "finance";
  grants: Partial<Record<CompanyResource | "*", readonly CompanyAction[]>>;
  focus: string;
}
// Proposed grants, not production authentication. Resolve identity and scope on the server.
export const companyTeam: CompanyMember[] = [
  { id: "nina-nguyen", name: "Nina Nguyen", title: "CEO", scope: "all_company", grants: { "*": ["read", "manage"] }, focus: "Toàn quyền hệ thống và dữ liệu công ty." },
  { id: "thuc-huynh", name: "Thuc Huynh", title: "Deputy CEO", scope: "all_company", grants: { "*": ["read", "manage"] }, focus: "Toàn quyền hệ thống và dữ liệu công ty." },
  { id: "phuc-nguyen", name: "Phuc Nguyen", title: "Planner", scope: "all_company", grants: { "*": ["read", "manage"] }, focus: "Toàn quyền; planning, phân tích và phối hợp các phòng ban." },
  { id: "nam-tran", name: "Nam Tran", title: "KOL Management", scope: "kol_booking", grants: { kol: ["read", "manage"], booking: ["read", "manage"], brand: ["read"], campaign: ["read"] }, focus: "Booking và performance theo KOL / Brand / Campaign; brand/campaign chỉ trong ngữ cảnh booking." },
  { id: "tri-pham", name: "Tri Pham", title: "Head of Socom", scope: "socom", grants: { overview: ["read"], kol: ["read", "manage"], booking: ["read", "manage"], brand: ["read"], campaign: ["read", "manage"], mcn: ["read", "manage"], tap: ["read", "manage"], livestream: ["read", "manage"] }, focus: "Quản lý overall và performance dashboard MCN / TAP / Livestream / KOL management; không cấp quản trị hệ thống hoặc hóa đơn/dòng tiền." },
  { id: "huong-le", name: "Huong Le", title: "Head of Growth", scope: "leads", grants: { leads: ["read", "manage"] }, focus: "Lead pipeline, nguồn lead, follow-up, chuyển đổi và người phụ trách." },
  { id: "lin-huynh", name: "Lin Huynh", title: "Finance Manager", scope: "finance", grants: { invoices: ["read", "manage"], cashflow: ["read", "manage"] }, focus: "Hóa đơn, phải thu/phải trả, thu/chi và dòng tiền." },
];
export function hasCompanyGrant(memberId: string, resource: CompanyResource, action: CompanyAction): boolean {
  const member = companyTeam.find(item => item.id === memberId);
  return Boolean(member && (member.grants["*"]?.includes(action) || member.grants[resource]?.includes(action)));
}
