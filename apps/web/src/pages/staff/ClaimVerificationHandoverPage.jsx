import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell, ChevronDown,
  FileText, Send, PackageCheck, BarChart3, LogOut,
  Calendar, MapPin, Check, Clock,
  User, Eye, Maximize2, Paperclip, Handshake,
  Package, Crown, CheckSquare,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-handover-mascot.png'
import thumbWallet from '../../assets/dashboard/thumb-wallet.png'
import evidenceWallet1 from '../../assets/claims/evidence-wallet-1.png'
import evidenceWallet2 from '../../assets/claims/evidence-wallet-2.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'
import './ItemModeration.css'
import './ClaimsManagement.css'
import './ClaimVerificationHandover.css'

/* Staff menu */
const staffMenuItems = [
  { id: 'overview', label: 'Tổng quan', icon: Home, path: '/staff', ready: true },
  { id: 'review', label: 'Kiểm duyệt tin', icon: FileText, path: '/staff/review', ready: true },
  { id: 'claims', label: 'Quản lý yêu cầu nhận đồ', icon: Send, path: '/staff/claims', ready: true },
  { id: 'handover', label: 'Xác nhận bàn giao', icon: PackageCheck, path: '/staff/handover', ready: true },
  { id: 'search', label: 'Tra cứu & tìm kiếm', icon: Search, path: '/search', ready: false },
  { id: 'reports', label: 'Thống kê & báo cáo', icon: BarChart3, path: '/staff/reports', ready: false },
]

export default function ClaimVerificationHandoverPage() {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [noteText, setNoteText] = useState('Đã đối chiếu thông tin và bàn giao thành công.')

  return (
    <div className="m04-page-wrapper">
      {/* ==================== TOP HEADER ==================== */}
      <header className="a01-header">
        <div className="a01-header-left">
          <a href="/" className="a01-logo">
            <img src={logoSrc} alt="School Lost & Found" />
          </a>
        </div>
        <nav className="a01-header-nav">
          <a href="/" className="a01-nav-link"><Home size={15} /> Trang chủ</a>
          <a href="#" className="a01-nav-link"><Search size={15} /> Tìm đồ</a>
          <a href="#" className="a01-nav-link"><BookOpen size={15} /> Hướng dẫn</a>
          <a href="#" className="a01-nav-link"><CircleAlert size={15} /> Về hệ thống</a>
        </nav>
        <div className="a01-header-right">
          <button className="a01-bell-btn">
            <Bell size={20} />
            <span className="a01-bell-badge">3</span>
          </button>
          <div className="a01-role-dropdown-container">
            <button
              type="button"
              className="m01-staff-role-pill"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            >
              <span className="role-user-circle">
                <User size={13} />
              </span>
              <span>Cán bộ hỗ trợ</span>
              <ChevronDown size={13} />
            </button>

            {roleMenuOpen && (
              <div className="a01-role-menu">
                <a href="/admin" className="a01-role-menu-item">
                  <Crown size={14} color="#D48806" />
                  <span>Quản trị viên (Admin)</span>
                </a>
                <a href="/staff" className="a01-role-menu-item active">
                  <User size={14} color="#2E7D32" />
                  <span>Cán bộ hỗ trợ (Staff)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="m04-body">
        {/* ==================== SIDEBAR ==================== */}
        <aside className="a01-sidebar">
          <div className="a01-user-card">
            <img src={adminAvatar} alt="Cán bộ hỗ trợ" className="a01-avatar-img" />
            <div className="a01-user-info">
              <span className="a01-user-name">Cán bộ hỗ trợ</span>
              <span className="a01-user-badge" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>Moderator</span>
            </div>
          </div>
          <nav className="a01-sidebar-menu">
            {staffMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = item.id === 'handover'
              return (
                <a
                  key={item.id}
                  href={item.path}
                  className={`a01-menu-btn ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    if (!item.ready) e.preventDefault()
                  }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
          <div className="a01-sidebar-bottom">
            <button className="a01-logout-btn">
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="m04-main">
          {/* Banner Card */}
          <div className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <Handshake size={22} className="banner-claim-icon" />
                Xác minh và bàn giao đồ
              </h1>
              <p className="a01-banner-subtitle">
                Đối chiếu thông tin, xác minh quyền sở hữu và xác nhận bàn giao thực tế.
              </p>
            </div>
            <img src={bannerMascot} alt="" className="a01-banner-img" />
          </div>

          {/* Stepper & Back Navigation */}
          <div className="m04-top-nav-row">
            <a href="/staff/claims" className="m04-back-link">
              ← Quay lại danh sách yêu cầu
            </a>

            <div className="m04-stepper-bar">
              <div className="m04-step-item">
                <span className="m04-step-badge-done">
                  <Check size={13} />
                  <span>1. Xem yêu cầu</span>
                </span>
              </div>
              <span className="m04-step-arrow">→</span>

              <div className="m04-step-item">
                <span className="m04-step-badge-active">
                  <span className="m04-step-num-active">2</span>
                  <span>2. Xác minh & đối chiếu</span>
                </span>
              </div>
              <span className="m04-step-arrow">→</span>

              <div className="m04-step-item">
                <span className="m04-step-badge-next">
                  <span className="m04-step-num-next">3</span>
                  <span>3. Xác nhận bàn giao</span>
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- 2 Column Grid ---------------- */}
          <div className="m04-content-grid">
            {/* Left Column */}
            <div className="m04-left-col">
              {/* Row with 2 cards */}
              <div className="m04-two-cards-row">
                {/* Card 1: Thông tin yêu cầu */}
                <div className="m04-card">
                  <div className="m04-card-title">
                    <FileText size={15} />
                    <span>Thông tin yêu cầu</span>
                  </div>
                  <div className="m04-fields-list">
                    <div className="m04-field-row">
                      <User size={13} />
                      <span className="m04-field-label">Mã yêu cầu:</span>
                      <span className="m04-field-val">CLM-20261110-0015</span>
                    </div>
                    <div className="m04-field-row">
                      <User size={13} />
                      <span className="m04-field-label">Người yêu cầu:</span>
                      <span className="m04-field-val">23IT.EB013</span>
                    </div>
                    <div className="m04-field-row">
                      <Clock size={13} />
                      <span className="m04-field-label">Thời gian gửi:</span>
                      <span className="m04-field-val">10/11/2026 09:24</span>
                    </div>
                    <div className="m04-field-row">
                      <CircleAlert size={13} />
                      <span className="m04-field-label">Trạng thái:</span>
                      <span className="m03-status-pending">
                        <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                        PENDING
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Tin đăng liên quan */}
                <div className="m04-card">
                  <div className="m04-card-title">
                    <Package size={15} />
                    <span>Tin đăng liên quan</span>
                  </div>
                  <div className="m04-linked-item-box">
                    <img src={thumbWallet} alt="" className="m04-linked-thumb" />
                    <div className="m04-linked-right">
                      <div className="m04-linked-title-row">
                        <span className="m01-type-badge m01-type-found" style={{ width: 'fit-content' }}>FOUND</span>
                        <span className="m04-linked-item-name">Nhặt được ví da màu đen</span>
                      </div>
                      <div className="m04-linked-meta-list">
                        <div className="m04-meta-line">
                          <User size={11} />
                          <span>Người đăng: Cán bộ hỗ trợ</span>
                        </div>
                        <div className="m04-meta-line">
                          <Calendar size={11} />
                          <span>Đăng: 09/11/2026 08:37</span>
                        </div>
                        <div className="m04-meta-line">
                          <MapPin size={11} />
                          <span>Khu vực: Thư viện tầng 2</span>
                        </div>
                      </div>
                      <button type="button" className="m04-btn-view-link">
                        <Eye size={11} />
                        <span>Xem chi tiết tin</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Bằng chứng đối chiếu quyền sở hữu */}
              <div className="m04-evidence-card">
                <div className="m04-card-title">
                  <CheckSquare size={15} />
                  <span>Bằng chứng đối chiếu quyền sở hữu</span>
                </div>
                <div className="m04-evidence-grid">
                  {/* Left: Ảnh minh chứng (2) */}
                  <div>
                    <span className="m03-sub-label" style={{ marginBottom: 6 }}>
                      <Paperclip size={12} />
                      Ảnh minh chứng (2)
                    </span>
                    <div className="m04-evidence-photos-wrap">
                      <div className="m04-evidence-img-box">
                        <img src={evidenceWallet1} alt="" />
                        <span className="m04-expand-icon">
                          <Maximize2 size={10} />
                        </span>
                      </div>
                      <div className="m04-evidence-img-box">
                        <img src={evidenceWallet2} alt="" />
                        <span className="m04-expand-icon">
                          <Maximize2 size={10} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Nội dung đối chiếu */}
                  <div>
                    <span className="m03-sub-label" style={{ marginBottom: 6 }}>
                      <FileText size={12} />
                      Nội dung đối chiếu
                    </span>
                    <div className="m04-desc-box">
                      Ví có 3 ngăn thẻ, bên trong có thẻ ngân hàng Vietcombank đuôi ****1234 và một tờ giấy ghi tên "Chiến".
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Lưu ý xác minh */}
              <div className="m04-notice-card">
                <div className="m04-notice-title">
                  <CircleAlert size={14} />
                  <span>Lưu ý xác minh</span>
                </div>
                <ul className="m04-notice-list" style={{ listStyleType: 'disc', paddingLeft: 18 }}>
                  <li>Đối chiếu thông tin mô tả, đặc điểm nhận dạng với món đồ thực tế.</li>
                  <li>Kiểm tra các bằng chứng đi kèm (hình ảnh, mô tả, chi tiết bên trong).</li>
                  <li>Chỉ xác nhận bàn giao khi chắc chắn người yêu cầu là chủ sở hữu.</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Kết quả xử lý Form */}
            <div className="m04-right-panel">
              <div className="m04-right-header">
                <div className="m04-card-title">
                  <FileText size={16} />
                  <span>Kết quả xử lý</span>
                </div>
                <span className="m02-status-pending-pill">
                  <Clock size={11} />
                  Đang xác minh
                </span>
              </div>

              {/* Section 1: Đối chiếu & xác minh */}
              <div className="m03-section-block">
                <div className="m03-section-title">
                  <Search size={14} />
                  <span>Đối chiếu & xác minh</span>
                </div>
                <div className="m04-checklist-box">
                  <label className="m04-check-item">
                    <input type="checkbox" className="m02-card-checkbox" defaultChecked />
                    <span>Thông tin mô tả khớp với món đồ.</span>
                  </label>
                  <label className="m04-check-item">
                    <input type="checkbox" className="m02-card-checkbox" defaultChecked />
                    <span>Bằng chứng do sinh viên cung cấp là hợp lệ.</span>
                  </label>
                  <label className="m04-check-item">
                    <input type="checkbox" className="m02-card-checkbox" defaultChecked />
                    <span>Đã đối chiếu trực tiếp và xác định đúng quyền sở hữu.</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Xác nhận bàn giao */}
              <div className="m03-section-block">
                <div className="m03-section-title">
                  <Package size={14} />
                  <span>Xác nhận bàn giao</span>
                </div>

                {/* Field 1: Thời gian bàn giao */}
                <div className="m04-form-group">
                  <label className="m04-form-label">
                    <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Thời gian bàn giao <span className="required">*</span>
                  </label>
                  <div className="m04-input-with-icon">
                    <input type="text" defaultValue="10/11/2026 14:30" />
                    <Calendar size={14} className="input-icon-right" />
                  </div>
                </div>

                {/* Field 2: Địa điểm bàn giao */}
                <div className="m04-form-group">
                  <label className="m04-form-label">
                    <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Địa điểm bàn giao <span className="required">*</span>
                  </label>
                  <select className="m04-select-dropdown" defaultValue="a101">
                    <option value="a101">Phòng Công tác sinh viên (A101)</option>
                    <option value="b202">Phòng Đoàn - Hội (B202)</option>
                    <option value="lib">Thư viện tầng 1</option>
                  </select>
                </div>

                {/* Field 3: Ghi chú */}
                <div className="m04-form-group">
                  <label className="m04-form-label">
                    <FileText size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Ghi chú (tùy chọn)
                  </label>
                  <div className="m04-textarea-wrap">
                    <textarea
                      className="m04-textarea"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <span className="m04-textarea-counter">{noteText.length} / 200</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="m04-form-actions-row">
                <button type="button" className="m04-btn-reject-lg">
                  ✕ Từ chối yêu cầu
                </button>
                <button type="button" className="m04-btn-confirm-lg">
                  ✓ Xác nhận bàn giao
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
