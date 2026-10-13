import { useMemo, useState } from "react";
import { dataCapabilities, reviewedAt, type CapabilityStatus } from "@shared/dataCapabilities";
import "./DataCapabilities.css";

const statusLabels: Record<CapabilityStatus, string> = {
  verified: "Đã đọc docs · cần test quyền",
  review: "Cần xác minh thêm",
  blocked: "Endpoint không hỗ trợ SEA",
  internal: "Nguồn nội bộ",
};

export default function DataCapabilities() {
  const [owner, setOwner] = useState("Tất cả");
  const [department, setDepartment] = useState("Tất cả");
  const [phase, setPhase] = useState<"manual" | "api">("manual");
  const [status, setStatus] = useState("Tất cả");
  const [selectedId, setSelectedId] = useState(dataCapabilities[0].id);
  const [showQuestion, setShowQuestion] = useState(false);
  const visible = useMemo(() => dataCapabilities.filter(item =>
    (owner === "Tất cả" || item.owner === owner) &&
    (department === "Tất cả" || item.department === department) &&
    (status === "Tất cả" || item.status === status)
  ), [owner, department, status]);
  const selected = visible.find(item => item.id === selectedId) ?? visible[0];
  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setShowQuestion(false);
  };

  return <section className="cap-audit" aria-label="Dữ liệu và khả năng phát triển">
    <div className="cap-intro">
      <span className="eyebrow">TSP / TAP · DATA FEASIBILITY</span>
      <h2>Dữ liệu nào có thể đưa vào Nina?</h2>
      <p>Danh mục theo nhóm dữ liệu, có nguồn docs và mức độ xác minh. Chưa phải danh sách đầy đủ mọi endpoint/field, chưa gọi API thật. Rà soát: {reviewedAt}.</p>
    </div>
    <div className="cap-phase" aria-label="Luồng cập nhật">
      <button type="button" aria-pressed={phase === "manual"} onClick={() => { setPhase("manual"); setShowQuestion(false); }}>Phase 1 · Nhập tay</button>
      <button type="button" aria-pressed={phase === "api"} onClick={() => { setPhase("api"); setShowQuestion(false); }}>Phase 2 · API sync</button>
    </div>
    <p className="cap-flow">{phase === "manual" ?
      "File báo cáo / dữ liệu nội bộ → map cột → kiểm tra → preview → xác nhận → database chung → dashboard & agent" :
      "Cấp quyền → xác minh scope/market → backfill → incremental sync → đối soát → database chung → dashboard & agent"}</p>
    <div className="cap-controls">
      <label>Phạm vi<select value={owner} onChange={e => updateFilter(setOwner, e.target.value)}>{["Tất cả", "TSP", "TAP", "Nội bộ", "Ngoài TTS"].map(v => <option key={v}>{v}</option>)}</select></label>
      <label>Phòng ban / mục đích<select value={department} onChange={e => updateFilter(setDepartment, e.target.value)}>{["Tất cả", "BOD", "KOL", "Account", "Vận hành", "Finance", "Kết nối & quyền"].map(v => <option key={v}>{v}</option>)}</select></label>
      <label>Mức xác minh<select value={status} onChange={e => updateFilter(setStatus, e.target.value)}><option value="Tất cả">Tất cả</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    </div>
    <div className="cap-layout">
      <div className="cap-list" aria-label="Nhóm dữ liệu">
        <p className="cap-count" role="status">{visible.length} nhóm phù hợp</p>
        {visible.map(item => <button type="button" className="cap-item" key={item.id} aria-pressed={selected?.id === item.id} onClick={() => { setSelectedId(item.id); setShowQuestion(false); }}>
          <span><strong>{item.title}</strong><small>{item.owner} · {item.department}</small></span>
          <span className={"cap-status cap-" + item.status}>{statusLabels[item.status]}</span>
        </button>)}
        {visible.length === 0 && <p>Không có nhóm phù hợp. Hãy đổi bộ lọc.</p>}
      </div>
      {selected && <article className="cap-detail">
        <span className={"cap-status cap-" + selected.status}>{statusLabels[selected.status]}</span>
        <h3>{selected.title}</h3>
        <dl><dt>Dữ liệu được mô tả</dt><dd>{selected.data}</dd><dt>Quyền / kết nối</dt><dd>{selected.permission}</dd><dt>Giới hạn cần giữ</dt><dd>{selected.limit}</dd></dl>
        {selected.doc ? <a href={selected.doc} target="_blank" rel="noopener noreferrer">Mở nguồn TikTok Shop chính thức ↗</a> : <p>Chưa có nguồn TikTok Shop API được xác minh cho nhóm này.</p>}
        <div className="cap-action-plan">
          <h4>{phase === "manual" ? "Cách đưa vào Phase 1" : "Cách đưa vào Phase 2"}</h4>
          <p>{phase === "manual" ? "Thu file export thực tế hoặc mẫu dữ liệu nội bộ, xác nhận grain và định nghĩa metric, map vào schema chung. Giữ nguồn, kỳ báo cáo và lịch sử import; chưa giả định đã hỗ trợ mọi file TikTok." :
            selected.status === "blocked" ? "Không dùng endpoint này cho VN. Giữ import file đối soát; chỉ chọn API thay thế khi có tài liệu xác nhận." :
            selected.status === "internal" ? "Giữ dữ liệu nội bộ ở ledger/CRM; API TikTok không thay thế booking, hợp đồng hay chi phí Nina." :
            selected.status === "review" ? "Đọc đủ response, scope, phiên bản và market trước; chưa bật sync hoặc hứa lấy được dữ liệu." :
            "Kiểm tra quyền app/token tại VN và API Testing Tool; đối chiếu dữ liệu trả về với báo cáo, sau đó mới xây adapter sync."}</p>
        </div>
        <button type="button" className="cap-question" onClick={() => setShowQuestion(value => !value)} aria-expanded={showQuestion}>Thử câu hỏi: {selected.question}</button>
        {showQuestion && <div className="cap-answer" role="status"><b>Demo cách agent xử lý · chưa có inference thật</b><ol><li>Xác định tài khoản/KOL, kỳ báo cáo và quyền người hỏi.</li><li>Kiểm tra coverage của nguồn: {selected.title}.</li><li>{selected.status === "blocked" ? "Thông báo endpoint không hỗ trợ SEA; yêu cầu nguồn manual đã đối soát." : selected.status === "review" ? "Báo cần xác minh nguồn/API; không tự tạo số liệu." : "Truy vấn dữ liệu đã import/sync; tính metric bằng backend."}</li><li>Trả kết luận kèm số liệu, nguồn, thời điểm cập nhật và bảng/biểu đồ có chứng cứ.</li></ol><p>Chưa có dữ liệu thật nên demo này không đưa ra kết luận kinh doanh.</p></div>}
      </article>}
    </div>
  </section>;
}
