import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell, ChevronDown,
  FileText, Send, PackageCheck, BarChart3, LogOut,
  Calendar, MapPin, Check, XCircle, LayoutGrid, Clock,
  ChevronRight, User, Eye, Maximize2, Paperclip,
  ShieldCheck, Package, ArrowLeft, Crown,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-staff-mascot.png'
import thumbWallet from '../../assets/dashboard/thumb-wallet.png'
import thumbAirpods from '../../assets/dashboard/thumb-airpods.png'
import thumbBackpack from '../../assets/dashboard/thumb-backpack.png'
import thumbCard from '../../assets/dashboard/thumb-card.png'
import thumbBottle from '../../assets/items/thumb-bottle.png'
import evidenceWallet1 from '../../assets/claims/evidence-wallet-1.png'
import evidenceWallet2 from '../../assets/claims/evidence-wallet-2.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'
import './ItemModeration.css'
import './ClaimsManagement.css'

/* Staff menu */
const staffMenuItems = [
  { id: 'overview', label: 'Tổng quan', icon: Home, path: '/staff', ready: true },
  { id: 'review', label: 'Kiểm duyệt tin', icon: FileText, path: '/staff/review', ready: true },
  { id: 'claims', label: 'Quản lý yêu cầu nhận đồ', icon: Send, path: '/staff/claims', ready: true },
  { id: 'handover', label: 'Xác nhận bàn giao', icon: PackageCheck, path: '/staff/handover', ready: true },
  { id: 'search', label: 'Tra cứu & tìm kiếm', icon: Search, path: '/search', ready: false },
  { id: 'reports', label: 'Thống kê & báo cáo', icon: BarChart3, path: '/staff/reports', ready: false },
]

/* Mock claims from design */
const claimsData = [
  {
    id: 1,
    code: 'CLM-20261110-0015',
    status: 'PENDING',
    title: 'Nhặt được ví da màu đen',
    author: '23IT.EB013',
    time: '10/11/2026 09:24',
    thumb: thumbWallet,
    hasLocation: false,
  },
  {
    id: 2,
    code: 'CLM-20261109-0014',
    status: 'PENDING',
    title: 'Nhặt được tai nghe AirPods',
    author: '23IT.EB028',
    time: '09/11/2026 14:10',
    thumb: thumbAirpods,
    hasLocation: false,
  },
  {
    id: 3,
    code: 'CLM-20261108-0013',
    status: 'ACCEPTED',
    title: 'Nhặt được thẻ sinh viên',
    author: '23IT.EB017',
    time: '08/11/2026 16:22',
    thumb: thumbCard,
    hasLocation: true,
  },
  {
    id: 4,
    code: 'CLM-20261107-0012',
    status: 'REJECTED',
    title: 'Nhặt được balo màu xanh',
    author: '23IT.EB045',
    time: '07/11/2026 11:05',
    thumb: thumbBackpack,
    hasLocation: true,
  },
  {
    id: 5,
    code: 'CLM-20261106-0011',
    status: 'PENDING',
    title: 'Nhặt được bình nước giữ nhiệt',
    author: '23IT.EB030',
    time: '06/11/2026 10:37',
    thumb: thumbBottle,
    hasLocation: true,
  },
]

export default function ClaimsManagementPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedClaimId, setSelectedClaimId] = useState(1)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  return (
    <div className="m03-page-wrapper">
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

      <div className="m03-body">
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
              const isActive = item.id === 'claims'
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
        <main className="m03-main">
          {/* Banner Card */}
          <div className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <Send size={22} className="banner-claim-icon" />
                Quản lý yêu cầu nhận đồ
              </h1>
              <p className="a01-banner-subtitle">
                Theo dõi, xác minh và xử lý các yêu cầu nhận lại đồ của sinh viên.
              </p>
            </div>
            <img src={bannerMascot} alt="" className="a01-banner-img" />
          </div>

          {/* 4 Tabs Row */}
          <div className="m02-tabs-row">
            <button
              type="button"
              className={`m02-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <Clock size={14} />
              <span>Đang chờ (5)</span>
            </button>
            <button
              type="button"
              className={`m02-tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
              onClick={() => setActiveTab('accepted')}
            >
              <Check size={14} />
              <span>Đã chấp nhận</span>
            </button>
            <button
              type="button"
              className={`m02-tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              <XCircle size={14} color="#CF1322" />
              <span>Đã từ chối</span>
            </button>
            <button
              type="button"
              className={`m02-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <LayoutGrid size={14} />
              <span>Tất cả</span>
            </button>
          </div>

          {/* ---------------- 2 Column Grid ---------------- */}
          <div className="m03-content-grid">
            {/* Left Panel: Claims List */}
            <div className="m03-left-panel">
              {/* Filter Bar */}
              <div className="m02-filter-bar">
                <div className="m02-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input type="text" />
                </div>
                <button className="m02-dropdown-btn">
                  <Calendar size={13} />
                  <span>Thời gian: Mới nhất</span>
                  <ChevronDown size={13} />
                </button>
              </div>

              {/* Claims List */}
              <div className="m02-items-list">
                {claimsData.map((item) => {
                  const isSelected = item.id === selectedClaimId
                  return (
                    <div
                      key={item.id}
                      className={`m03-claim-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedClaimId(item.id)}
                    >
                      <input
                        type="checkbox"
                        className="m02-card-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <img src={item.thumb} alt="" className="m02-card-thumb" />
                      <div className="m03-claim-info">
                        <div className="m03-claim-top-row">
                          <span className="m03-claim-code">{item.code}</span>
                          <span className={
                            item.status === 'ACCEPTED'
                              ? 'm03-status-accepted'
                              : item.status === 'REJECTED'
                                ? 'm03-status-rejected'
                                : 'm03-status-pending'
                          }>
                            {item.status}
                          </span>
                        </div>
                        <span className="m03-claim-title">{item.title}</span>
                        <div className="m03-claim-meta-row">
                          <div className="m02-meta-tag">
                            {item.hasLocation ? <MapPin size={12} /> : <User size={12} />}
                            <span>{item.author}</span>
                          </div>
                          <div className="m02-meta-tag">
                            <Calendar size={12} />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="m03-btn-view-detail">
                        <Eye size={12} />
                        <span>Xem chi tiết</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="m02-list-footer">
                <label className="m02-select-all">
                  <input type="checkbox" className="m02-card-checkbox" />
                  <span>Chọn tất cả (0)</span>
                </label>
                <div className="a04-pagination-controls">
                  <button className="a04-page-btn">&lt;</button>
                  <button className="a04-page-btn active">1</button>
                  <button className="a04-page-btn">2</button>
                  <button className="a04-page-btn">3</button>
                  <button className="a04-page-btn">&gt;</button>
                </div>
              </div>
            </div>

            {/* Right Panel: Claim Detail */}
            <div className="m03-right-panel">
              <div className="m02-detail-header">
                <div className="m02-detail-title">
                  <FileText size={16} />
                  <span>Chi tiết yêu cầu nhận đồ</span>
                </div>
                <span className="m02-status-pending-pill">
                  <Clock size={11} />
                  Đang chờ (PENDING)
                </span>
              </div>

              {/* Section 1: Thông tin yêu cầu */}
              <div className="m03-section-block">
                <div className="m03-section-title">
                  <FileText size={15} />
                  <span>Thông tin yêu cầu</span>
                </div>
                <div className="m03-info-fields-box">
                  <div className="m03-info-field-row">
                    <User size={13} />
                    <span className="m03-field-name">Mã yêu cầu:</span>
                    <span className="m03-field-val">CLM-20261110-0015</span>
                  </div>
                  <div className="m03-info-field-row">
                    <User size={13} />
                    <span className="m03-field-name">Người yêu cầu:</span>
                    <span className="m03-field-val">23IT.EB013</span>
                  </div>
                  <div className="m03-info-field-row">
                    <Clock size={13} />
                    <span className="m03-field-name">Thời gian gửi:</span>
                    <span className="m03-field-val">10/11/2026 09:24</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Tin nhặt được liên quan (FOUND) */}
              <div className="m03-section-block">
                <div className="m03-section-title">
                  <Package size={15} />
                  <span>Tin nhặt được liên quan (FOUND)</span>
                </div>
                <div className="m03-linked-item-card">
                  <img src={thumbWallet} alt="" className="m03-linked-thumb" />
                  <div className="m03-linked-info">
                    <div className="m03-linked-header">
                      <span className="m01-type-badge m01-type-found">FOUND</span>
                      <span className="m03-linked-title">Nhặt được ví da màu đen</span>
                    </div>
                    <div className="m03-linked-meta">
                      <div className="m02-meta-tag">
                        <Calendar size={11} />
                        <span>Đăng: 09/11/2026 08:37</span>
                      </div>
                      <div className="m02-meta-tag">
                        <User size={11} />
                        <span>Người đăng: Cán bộ hỗ trợ</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="m03-btn-view-item">
                    <Eye size={11} />
                    <span>Xem chi tiết tin</span>
                  </button>
                </div>
              </div>

              {/* Section 3: Bằng chứng đối chiếu quyền sở hữu */}
              <div className="m03-section-block">
                <div className="m03-section-title">
                  <ShieldCheck size={15} />
                  <span>Bằng chứng đối chiếu quyền sở hữu</span>
                </div>
                <div className="m03-evidence-grid">
                  {/* Left: Ảnh minh chứng (2) */}
                  <div className="m03-evidence-left">
                    <span className="m03-sub-label">
                      <Paperclip size={12} />
                      Ảnh minh chứng (2)
                    </span>
                    <div className="m03-evidence-photos-row">
                      <div className="m03-evidence-photo-wrap">
                        <img src={evidenceWallet1} alt="" className="m03-evidence-photo" />
                        <span className="m03-photo-expand-badge">
                          <Maximize2 size={10} />
                        </span>
                      </div>
                      <div className="m03-evidence-photo-wrap">
                        <img src={evidenceWallet2} alt="" className="m03-evidence-photo" />
                        <span className="m03-photo-expand-badge">
                          <Maximize2 size={10} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Nội dung đối chiếu */}
                  <div className="m03-evidence-right">
                    <span className="m03-sub-label">
                      <FileText size={12} />
                      Nội dung đối chiếu
                    </span>
                    <div className="m03-evidence-desc-box">
                      Ví có 3 ngăn thẻ, bên trong có thẻ ngân hàng Vietcombank đuôi ****1234 và một tờ giấy ghi tên "Chiến".
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Hành động xử lý */}
              <div className="m03-section-block">
                <div className="m03-section-title">
                  <Clock size={15} />
                  <span>Hành động xử lý</span>
                </div>
                <div className="m03-actions-row">
                  <a href="/staff/handover" className="m03-btn-accept" style={{ textDecoration: 'none' }}>
                    <Check size={14} />
                    <span>Xác nhận bàn giao (ACCEPTED)</span>
                  </a>
                  <button type="button" className="m03-btn-reject">
                    <XCircle size={14} />
                    <span>Từ chối yêu cầu (REJECTED)</span>
                  </button>
                  <button type="button" className="m03-btn-back">
                    <ArrowLeft size={13} />
                    <span>Quay lại danh sách</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

