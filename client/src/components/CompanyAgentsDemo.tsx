import { useState } from "react";
import { dataCapabilities } from "@shared/dataCapabilities";
import "./DataCapabilities.css";

const profiles = [
  { id: "BOD", title: "BOD", purpose: "Quyết định & ưu tiên nguồn lực", task: "Tóm tắt hiệu suất agency và ba việc cần xử lý.", output: ["Kết luận phục vụ quyết định", "Bằng chứng từ KPI đã tính", "Giả thuyết được tách riêng", "Ba ưu tiên kèm phép đo"] },
  { id: "KOL", title: "KOL / Affiliate", purpose: "Creator matching, brief, sample & nội dung", task: "Lập shortlist KOL cho campaign và checklist follow-up.", output: ["Tiêu chí shortlist theo brief", "Marketplace metrics tách khỏi GMV Nina", "Booking / audience thiếu cần bổ sung", "Brief và checklist dạng bản nháp"] },
  { id: "Account", title: "Account / Sales", purpose: "Client report, target, proposal", task: "Soạn báo cáo tuần cho client được giao.", output: ["Phạm vi client được cấp quyền", "KPI và mức đạt target", "Vấn đề cần làm rõ", "Client recap dạng bản nháp"] },
  { id: "Vận hành", title: "Operations", purpose: "Backlog, sample, tồn kho & deliverables", task: "Tạo checklist xử lý sample và tồn kho.", output: ["Danh sách tác vụ cần xử lý", "Trạng thái / deadline có bằng chứng", "Dữ liệu còn thiếu", "Checklist giao việc; chưa thực hiện thao tác"] },
  { id: "Finance", title: "Finance", purpose: "Đối soát commission, fee & cost", task: "Kiểm tra chênh lệch hoa hồng và chi phí.", output: ["Estimate / pending / settled riêng", "GMV khác doanh thu Nina", "Chi phí cần đủ trước khi tính margin", "Checklist đối soát; chưa chuyển tiền"] },
];
export default function CompanyAgentsDemo({ onOpenData }: { onOpenData: () => void }) {
  const [profileId, setProfileId] = useState("KOL");
  const [provider, setProvider] = useState("Ollama local");
  const [request, setRequest] = useState("");
  const [preview, setPreview] = useState(false);
  const profile = profiles.find(item => item.id === profileId) ?? profiles[0];
  const sources = dataCapabilities.filter(item => item.department === profile.id).slice(0, 5);
  return <section className="cap-audit">
    <div className="cap-intro"><span className="eyebrow">NINA COMPANY AGENTS · WORKFLOW SIMULATION</span><h2>Trợ lý cho nhân viên và BOD</h2><p>Demo kịch bản hỗ trợ công việc. Chưa kết nối model/API, chưa có phân quyền thật. Chọn hồ sơ ở đây chỉ đổi kịch bản; hệ thống thật lấy quyền từ tài khoản đăng nhập.</p></div>
    <div className="cap-phase" aria-label="Hồ sơ trợ lý">{profiles.map(item => <button type="button" key={item.id} aria-pressed={profile.id === item.id} onClick={() => { setProfileId(item.id); setRequest(""); setPreview(false); }}>{item.title}</button>)}</div>
    <div className="cap-layout" style={{ marginTop: 22 }}>
      <article className="cap-detail"><h3>{profile.title}</h3><p>{profile.purpose}</p>
        <label style={{ display: "block" }}>Route model dự kiến<select style={{ display: "block", padding: 10, marginTop: 8 }} value={provider} onChange={event => setProvider(event.target.value)}>{["Ollama local", "OpenRouter", "Direct API"].map(item => <option key={item}>{item}</option>)}</select></label>
        <p>Trạng thái: chưa kết nối. Model Gemma / DeepSeek / GLM cần kiểm tra version, tools, chất lượng tiếng Việt và chính sách dữ liệu.</p>
        <button type="button" className="cap-question" onClick={() => { setRequest(profile.task); setPreview(false); }}>Dùng tình huống mẫu: {profile.task}</button>
        <label htmlFor="company-agent-request" style={{ display: "block", marginTop: 18 }}>Yêu cầu công việc</label><textarea id="company-agent-request" value={request} onChange={event => { setRequest(event.target.value); setPreview(false); }} maxLength={2000} rows={4} placeholder="Ghi yêu cầu để xem khung xử lý cho hồ sơ đang chọn…" style={{ width: "100%", padding: 12, marginTop: 8, border: "1px solid #d3dbe5", borderRadius: 8, font: "inherit" }} />
        <button type="button" className="cap-question" disabled={!request.trim()} onClick={() => setPreview(true)}>Xem kịch bản hỗ trợ</button>
      </article>
      <article className="cap-detail" aria-live="polite"><h3>Đầu ra dự kiến</h3>{preview ? <><p><b>Yêu cầu:</b> {request}</p><p><b>Route lựa chọn:</b> {provider} · chưa gọi model</p><p>Đây là khung xử lý cố định theo hồ sơ {profile.title}; chưa phân tích câu hỏi bằng AI.</p><ol>{profile.output.map(item => <li key={item} style={{ marginTop: 10 }}>{item}</li>)}</ol><div className="cap-action-plan"><h4>Dữ liệu cần có</h4>{sources.map(item => <p key={item.id}><b>{item.title}</b><br />{item.data}<br /><small>{item.status === "verified" ? "Docs đã đọc; quyền/VN chưa test" : item.status === "blocked" ? "Endpoint không hỗ trợ SEA; dùng nguồn khác" : item.status === "internal" ? "Nguồn nội bộ cần nhập" : "Cần xác minh contract / market"}</small></p>)}<p>Chưa có evidence thực tế: agent thật phải báo thiếu dữ liệu thay vì đưa số hoặc kết luận.</p></div></> : <p>Chọn hồ sơ và tình huống mẫu để xem cách trợ lý hỗ trợ nhân viên.</p>}
        <button type="button" className="cap-question" onClick={onOpenData}>Xem danh mục dữ liệu TSP / TAP</button>
      </article>
    </div>
    <p className="cap-flow">Một runtime chung → công cụ theo quyền → dữ liệu có nguồn → câu trả lời / brief / checklist. Swarm chỉ bổ sung khi đo được lợi ích; không thay thế kiểm chứng số liệu.</p>
  </section>;
}
