import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell, ChevronDown,
  FileText, Send, PackageCheck, BarChart3, LogOut,
  Calendar, MapPin, Check, EyeOff, LayoutGrid, Clock,
  ChevronRight, User, CheckCircle2, Crown, ClipboardCheck, ArrowLeft,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-staff-mascot.png'
import thumbWallet from '../../assets/dashboard/thumb-wallet.png'
import thumbAirpods from '../../assets/dashboard/thumb-airpods.png'
import thumbBackpack from '../../assets/dashboard/thumb-backpack.png'
import thumbCard from '../../assets/dashboard/thumb-card.png'
import thumbBottle from '../../assets/items/thumb-bottle.png'
import detailWalletLarge from '../../assets/items/detail-wallet-large.png'
import walletSub1 from '../../assets/items/wallet-sub-1.png'
import walletSub2 from '../../assets/items/wallet-sub-2.png'
import walletSub3 from '../../assets/items/wallet-sub-3.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'
import './ItemModeration.css'

/* Staff menu */
const staffMenuItems = [
  { id: 'overview', label: 'Tổng quan', icon: Home, path: '/staff', ready: true },
  { id: 'review', label: 'Kiểm duyệt tin', icon: FileText, path: '/staff/review', ready: true },
  { id: 'claims', label: 'Quản lý yêu cầu nhận đồ', icon: Send, path: '/staff/claims', ready: true },
  { id: 'handover', label: 'Xác nhận bàn giao', icon: PackageCheck, path: '/staff/handover', ready: true },
  { id: 'search', label: 'Tra cứu & tìm kiếm', icon: Search, path: '/search', ready: false },
  { id: 'reports', label: 'Thống kê & báo cáo', icon: BarChart3, path: '/staff/reports', ready: false },
]

/* Mock moderation items from design */
const moderationItems = [
  {
    id: 1,
    type: 'FOUND',
    title: 'Nhặt được ví da màu đen',
    author: '23IT.EB013',
    time: '10/11/2026 09:24',
    location: 'Thư viện tầng 2',
    thumb: thumbWallet,
    status: 'Chờ duyệt',
  },
  {
    id: 2,
    type: 'FOUND',
    title: 'Nhặt được tai nghe AirPods',
    author: '23IT.EB028',
    time: '09/11/2026 14:10',
    location: 'Giảng đường A',
    thumb: thumbAirpods,
    status: 'Chờ duyệt',
  },
  {
    id: 3,
    type: 'LOST',
    title: 'Báo mất balo màu xanh',
    author: '23IT.EB045',
    time: '09/11/2026 08:37',
    location: 'Khu vực căng tin',
    thumb: thumbBackpack,
    status: 'Chờ duyệt',
  },
  {
    id: 4,
    type: 'LOST',
    title: 'Mất thẻ sinh viên',
    author: '23IT.EB017',
    time: '08/11/2026 21:05',
    location: 'Thư viện',
    thumb: thumbCard,
    status: 'Chờ duyệt',
  },
  {
    id: 5,
    type: 'FOUND',
    title: 'Nhặt được bình nước giữ nhiệt',
    author: '23IT.EB030',
    time: '08/11/2026 16:20',
    location: 'Sân bóng',
    thumb: thumbBottle,
    status: 'Chờ duyệt',
  },
]

export default function ItemModerationPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedItemId, setSelectedItemId] = useState(1)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [activeSubThumb, setActiveSubThumb] = useState(1)

  return (
    <div className="m02-page-wrapper">
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

      <div className="m02-body">
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
              const isActive = item.id === 'review'
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
        <main className="m02-main">
          {/* Banner Card */}
          <div className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <ClipboardCheck size={22} className="banner-mod-icon" />
                Kiểm duyệt tin đăng
              </h1>
              <p className="a01-banner-subtitle">
                Xem xét và xử lý các tin đăng mới trước khi công khai trên hệ thống.
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
              <span>Chờ kiểm duyệt (12)</span>
            </button>
            <button
              type="button"
              className={`m02-tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              <Check size={14} />
              <span>Đã duyệt</span>
            </button>
            <button
              type="button"
              className={`m02-tab-btn ${activeTab === 'hidden' ? 'active' : ''}`}
              onClick={() => setActiveTab('hidden')}
            >
              <EyeOff size={14} />
              <span>Đã ẩn</span>
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
          <div className="m02-content-grid">
            {/* Left Panel: Filter + List */}
            <div className="m02-left-panel">
              {/* Filter Bar */}
              <div className="m02-filter-bar">
                <div className="m02-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input type="text" />
                </div>
                <button className="m02-dropdown-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                  <span>Tất cả loại tin</span>
                  <ChevronDown size={13} />
                </button>
                <button className="m02-dropdown-btn">
                  <span>Mới nhất</span>
                  <ChevronDown size={13} />
                </button>
              </div>

              {/* Items List */}
              <div className="m02-items-list">
                {moderationItems.map((item) => {
                  const isSelected = item.id === selectedItemId
                  return (
                    <div
                      key={item.id}
                      className={`m02-mod-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <input
                        type="checkbox"
                        className="m02-card-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <img src={item.thumb} alt="" className="m02-card-thumb" />
                      <div className="m02-card-info">
                        <div className="m02-card-header-row">
                          <span className={`m01-type-badge ${item.type === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                            {item.type}
                          </span>
                          <span className="m02-card-title">{item.title}</span>
                        </div>
                        <div className="m02-card-meta-row">
                          <div className="m02-meta-tag">
                            <User size={12} />
                            <span>{item.author}</span>
                          </div>
                          <div className="m02-meta-tag">
                            <Calendar size={12} />
                            <span>{item.time}</span>
                          </div>
                          <div className="m02-meta-tag">
                            <MapPin size={12} />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                      <span className="m02-status-pending-pill">
                        <Clock size={11} />
                        {item.status}
                      </span>
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

            {/* Right Panel: Detail Card */}
            <div className="m02-right-panel">
              <div className="m02-detail-header">
                <div className="m02-detail-title">
                  <FileText size={16} />
                  <span>Chi tiết tin đăng</span>
                </div>
                <span className="m02-status-pending-pill">
                  <Clock size={11} />
                  Chờ kiểm duyệt
                </span>
              </div>

              {/* Gallery */}
              <div className="m02-gallery-wrap">
                <div className="m02-main-image-box">
                  <img src={detailWalletLarge} alt="" className="m02-main-image" />
                </div>
                <div className="m02-sub-thumbs-row">
                  <img
                    src={walletSub1}
                    alt=""
                    className={`m02-sub-thumb ${activeSubThumb === 1 ? 'active' : ''}`}
                    onClick={() => setActiveSubThumb(1)}
                  />
                  <img
                    src={walletSub2}
                    alt=""
                    className={`m02-sub-thumb ${activeSubThumb === 2 ? 'active' : ''}`}
                    onClick={() => setActiveSubThumb(2)}
                  />
                  <img
                    src={walletSub3}
                    alt=""
                    className={`m02-sub-thumb ${activeSubThumb === 3 ? 'active' : ''}`}
                    onClick={() => setActiveSubThumb(3)}
                  />
                  <button type="button" className="m02-thumb-arrow-btn">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Item Info */}
              <div className="m02-detail-item-info">
                <div>
                  <span className="m01-type-badge m01-type-found">FOUND</span>
                </div>
                <h2 className="m02-detail-heading">Nhặt được ví da màu đen</h2>
                <div className="m02-detail-meta-list">
                  <div className="m02-detail-meta-row">
                    <User size={13} />
                    <span className="m02-meta-label">Người đăng:</span>
                    <span className="m02-meta-val">23IT.EB013</span>
                  </div>
                  <div className="m02-detail-meta-row">
                    <Calendar size={13} />
                    <span className="m02-meta-label">Thời gian:</span>
                    <span className="m02-meta-val">10/11/2026 09:24</span>
                  </div>
                  <div className="m02-detail-meta-row">
                    <MapPin size={13} />
                    <span className="m02-meta-label">Khu vực:</span>
                    <span className="m02-meta-val">Thư viện tầng 2</span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="m02-desc-section">
                <div className="m02-sec-title">
                  <FileText size={15} />
                  <span>Mô tả chi tiết</span>
                </div>
                <div className="m02-desc-content-box">
                  Nhặt được một ví da màu đen tại khu vực bàn đọc tầng 2 thư viện vào khoảng 9h sáng nay. Bên trong có một số giấy tờ và thẻ ngân hàng. Liên hệ mình để nhận lại.
                </div>
              </div>

              {/* Notice Box */}
              <div className="m02-notice-box">
                <div className="m02-notice-header">
                  <CircleAlert size={14} />
                  <span>Lưu ý khi kiểm duyệt</span>
                </div>
                <div className="m02-notice-checklist">
                  <div className="m02-notice-check-item">
                    <CheckCircle2 size={13} />
                    <span>Nội dung tin rõ ràng, phù hợp.</span>
                  </div>
                  <div className="m02-notice-check-item">
                    <CheckCircle2 size={13} />
                    <span>Hình ảnh không vi phạm quy định.</span>
                  </div>
                  <div className="m02-notice-check-item">
                    <CheckCircle2 size={13} />
                    <span>Không chứa thông tin nhạy cảm (số CMND, mật khẩu, ...).</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="m02-detail-actions">
                <button type="button" className="m02-btn-back">
                  <ArrowLeft size={13} />
                  <span>Quay lại danh sách</span>
                </button>
                <button type="button" className="m02-btn-approve-lg">
                  <Check size={13} />
                  <span>Duyệt tin</span>
                </button>
                <button type="button" className="m02-btn-hide-lg">
                  <EyeOff size={13} />
                  <span>Ẩn tin</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

