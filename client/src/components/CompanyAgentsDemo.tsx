import { useState } from "react";
import { dataCapabilities } from "@shared/dataCapabilities";
import { companyTeam, type CompanyMember } from "@shared/companyTeam";
import "./DataCapabilities.css";

const workflows: Record<CompanyMember["scope"], { purpose: string; task: string; output: string[]; departments: string[] }> = {
  all_company: { purpose: "Toàn quyền công ty", task: "Tổng hợp hiệu suất công ty và kế hoạch hành động.", output: ["Kết luận theo mục tiêu người hỏi", "KPI và bằng chứng theo kỳ", "Rủi ro / dữ liệu thiếu", "Kế hoạch tối đa ba bước có người phụ trách"], departments: [] },
  kol_booking: { purpose: "Booking performance theo KOL / Brand / Campaign", task: "So sánh hiệu suất booking theo KOL, Brand và Campaign.", output: ["Chọn chiều KOL / Brand / Campaign", "GMV quy thuộc Nina và booking fee riêng", "ROI / contribution chỉ khi đủ chi phí", "Shortlist và follow-up dạng bản nháp"], departments: ["KOL"] },
  socom: { purpose: "Overall MCN / TAP / Livestream / KOL management", task: "Tổng hợp dashboard MCN, TAP, Livestream và KOL management.", output: ["Overall và phân rã từng mảng Socom", "Performance theo KOL / Brand / Campaign", "Rủi ro vận hành và hiệu suất", "Checklist phối hợp nhân viên; không mở hóa đơn/dòng tiền"], departments: ["BOD", "KOL", "Vận hành", "Account"] },
  leads: { purpose: "Quản lý lead", task: "Rà lead pipeline, lead cần follow-up và conversion theo nguồn.", output: ["Lead theo nguồn / giai đoạn / owner", "Follow-up và next action", "Pipeline conversion theo kỳ", "Bản nháp checklist growth; không truy cập dữ liệu Finance"], departments: ["Growth"] },
  finance: { purpose: "Hóa đơn và dòng tiền", task: "Rà hóa đơn, phải thu/phải trả và dòng tiền.", output: ["Hóa đơn và kỳ đến hạn", "Phải thu / phải trả riêng", "Thu / chi thực tế và dự kiến riêng", "Checklist đối soát; không thực hiện thanh toán"], departments: ["Finance"] },
};
export default function CompanyAgentsDemo({ onOpenData, profileId, onProfileChange }: { onOpenData: () => void; profileId: string; onProfileChange: (id: string) => void }) {
  const [provider, setProvider] = useState("Ollama local");
  const [request, setRequest] = useState("");
  const [preview, setPreview] = useState(false);
  const profile = companyTeam.find(item => item.id === profileId) ?? companyTeam[2];
  const workflow = workflows[profile.scope];
  const sources = dataCapabilities.filter(item => profile.scope === "all_company" || workflow.departments.includes(item.department));
  return <section className="cap-audit">
    <div className="cap-intro"><span className="eyebrow">NINA COMPANY AGENTS · WORKFLOW SIMULATION</span><h2>Trợ lý cho nhân viên và BOD</h2><p>Demo kịch bản hỗ trợ công việc. Chưa kết nối model/API, chưa có phân quyền thật. Chọn hồ sơ ở đây chỉ đổi kịch bản; hệ thống thật lấy quyền từ tài khoản đăng nhập.</p></div>
    <div className="cap-phase" aria-label="Hồ sơ trợ lý">{companyTeam.map(item => <button type="button" key={item.id} aria-pressed={profile.id === item.id} onClick={() => { onProfileChange(item.id); setRequest(""); setPreview(false); }}>{item.name} · {item.title}</button>)}</div>
    <div className="cap-layout" style={{ marginTop: 22 }}>
      <article className="cap-detail"><h3>{profile.name}</h3><p><b>{profile.title}</b></p><p>{profile.focus}</p><p>{workflow.purpose}</p>
        <label style={{ display: "block" }}>Route model dự kiến<select style={{ display: "block", padding: 10, marginTop: 8 }} value={provider} onChange={event => setProvider(event.target.value)}>{["Ollama local", "OpenRouter", "Direct API"].map(item => <option key={item}>{item}</option>)}</select></label>
        <p>Trạng thái: chưa kết nối. Model Gemma / DeepSeek / GLM cần kiểm tra version, tools, chất lượng tiếng Việt và chính sách dữ liệu.</p>
        <button type="button" className="cap-question" onClick={() => { setRequest(workflow.task); setPreview(false); }}>Dùng tình huống mẫu: {workflow.task}</button>
        <label htmlFor="company-agent-request" style={{ display: "block", marginTop: 18 }}>Yêu cầu công việc</label><textarea id="company-agent-request" value={request} onChange={event => { setRequest(event.target.value); setPreview(false); }} maxLength={2000} rows={4} placeholder="Ghi yêu cầu để xem khung xử lý cho hồ sơ đang chọn…" style={{ width: "100%", padding: 12, marginTop: 8, border: "1px solid #d3dbe5", borderRadius: 8, font: "inherit" }} />
        <button type="button" className="cap-question" disabled={!request.trim()} onClick={() => setPreview(true)}>Xem kịch bản hỗ trợ</button>
      </article>
      <article className="cap-detail" aria-live="polite"><h3>Đầu ra dự kiến</h3>{preview ? <><p><b>Yêu cầu:</b> {request}</p><p><b>Route lựa chọn:</b> {provider} · chưa gọi model</p><p>Đây là khung xử lý cố định theo hồ sơ {profile.name} · {profile.title}; chưa phân tích câu hỏi bằng AI.</p><ol>{workflow.output.map(item => <li key={item} style={{ marginTop: 10 }}>{item}</li>)}</ol><div className="cap-action-plan"><h4>Dữ liệu cần có ({sources.length} nhóm)</h4>{sources.map(item => <p key={item.id}><b>{item.title}</b><br />{item.data}<br /><small>{item.status === "verified" ? "Docs đã đọc; quyền/VN chưa test" : item.status === "blocked" ? "Endpoint không hỗ trợ SEA; dùng nguồn khác" : item.status === "internal" ? "Nguồn nội bộ cần nhập" : "Cần xác minh contract / market"}</small></p>)}<p>Chưa có evidence thực tế: agent thật phải báo thiếu dữ liệu thay vì đưa số hoặc kết luận.</p></div></> : <p>Chọn hồ sơ và tình huống mẫu để xem cách trợ lý hỗ trợ nhân viên.</p>}
        <button type="button" className="cap-question" onClick={onOpenData}>Xem danh mục dữ liệu TSP / TAP</button>
      </article>
    </div>
    <p className="cap-flow">Một runtime chung → công cụ theo quyền → dữ liệu có nguồn → câu trả lời / brief / checklist. Swarm chỉ bổ sung khi đo được lợi ích; không thay thế kiểm chứng số liệu.</p>
  </section>;
}
