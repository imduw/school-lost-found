import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell, ChevronDown,
  FileText, Send, PackageCheck, BarChart3, LogOut,
  LayoutGrid, TrendingUp, CheckCircle, Package,
  ChevronRight, Calendar, MapPin, Check, X, MoreHorizontal, User, Crown,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-staff-mascot.png'
import thumbWallet from '../../assets/dashboard/thumb-wallet.png'
import thumbAirpods from '../../assets/dashboard/thumb-airpods.png'
import thumbBackpack from '../../assets/dashboard/thumb-backpack.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'

/* Sidebar menu items for Staff */
const staffMenuItems = [
  { id: 'overview', label: 'Tổng quan', icon: Home, path: '/staff', ready: true },
  { id: 'review', label: 'Kiểm duyệt tin', icon: FileText, path: '/staff/review', ready: true },
  { id: 'claims', label: 'Quản lý yêu cầu nhận đồ', icon: Send, path: '/staff/claims', ready: true },
  { id: 'handover', label: 'Xác nhận bàn giao', icon: PackageCheck, path: '/staff/handover', ready: true },
  { id: 'search', label: 'Tra cứu & tìm kiếm', icon: Search, path: '/search', ready: false },
  { id: 'reports', label: 'Thống kê & báo cáo', icon: BarChart3, path: '/staff/reports', ready: false },
]

export default function StaffDashboardPage() {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  /* Line chart coordinates for 7 days */
  const chartDays = ['04/11', '05/11', '06/11', '07/11', '08/11', '09/11', '10/11']
  const foundData = [4, 10, 8, 14, 9, 16, 12]
  const lostData = [3, 4, 3, 7, 4, 6, 4]

  const getY = (val) => 135 - (val / 20) * 115
  const getX = (idx) => 40 + idx * 72

  const foundPoints = foundData.map((v, i) => `${getX(i)},${getY(v)}`).join(' ')
  const lostPoints = lostData.map((v, i) => `${getX(i)},${getY(v)}`).join(' ')

  return (
    <div className="m01-dashboard-wrapper">
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

      <div className="m01-body">
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
              const isActive = item.id === 'overview'
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
        <main className="m01-main">
          {/* Banner Card */}
          <div className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <LayoutGrid size={22} className="banner-staff-icon" />
                Trang tổng quan cán bộ
              </h1>
              <p className="a01-banner-subtitle">
                Theo dõi, xử lý tin đăng và yêu cầu nhận đồ của sinh viên.
              </p>
            </div>
            <img src={bannerMascot} alt="" className="a01-banner-img" />
          </div>

          {/* 4 Stat Cards Row */}
          <div className="m01-stats-row">
            {/* Card 1 */}
            <div className="m01-stat-card">
              <div className="m01-stat-left">
                <div className="a01-stat-icon-wrapper icon-wrap-green">
                  <FileText size={20} />
                </div>
                <div className="a01-stat-info">
                  <span className="a01-stat-value">12</span>
                  <span className="a01-stat-label">Tin chờ kiểm duyệt</span>
                </div>
              </div>
              <ChevronRight size={16} className="m01-stat-arrow" />
            </div>

            {/* Card 2 */}
            <div className="m01-stat-card">
              <div className="m01-stat-left">
                <div className="a01-stat-icon-wrapper icon-wrap-orange">
                  <Send size={20} />
                </div>
                <div className="a01-stat-info">
                  <span className="a01-stat-value">5</span>
                  <span className="a01-stat-label">Yêu cầu chờ xác minh</span>
                </div>
              </div>
              <ChevronRight size={16} className="m01-stat-arrow" />
            </div>

            {/* Card 3 */}
            <div className="m01-stat-card">
              <div className="m01-stat-left">
                <div className="a01-stat-icon-wrapper icon-wrap-green">
                  <Package size={20} />
                </div>
                <div className="a01-stat-info">
                  <span className="a01-stat-value">324</span>
                  <span className="a01-stat-label">Tin đang công khai</span>
                </div>
              </div>
              <ChevronRight size={16} className="m01-stat-arrow" />
            </div>

            {/* Card 4 */}
            <div className="m01-stat-card">
              <div className="m01-stat-left">
                <div className="a01-stat-icon-wrapper icon-wrap-blue">
                  <CheckCircle size={20} />
                </div>
                <div className="a01-stat-info">
                  <span className="a01-stat-value">276</span>
                  <span className="a01-stat-label">Đã xử lý (tháng này)</span>
                </div>
              </div>
              <ChevronRight size={16} className="m01-stat-arrow" />
            </div>
          </div>

          {/* ---------------- Middle Row ---------------- */}
          <div className="m01-two-col-grid">
            {/* Left: Line Chart */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <TrendingUp size={16} />
                  <span>Thống kê tin đăng theo thời gian</span>
                </div>
                <select className="a01-filter-select" defaultValue="7days">
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                </select>
              </div>

              <div className="a01-chart-container">
                <div className="a01-chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot-found" />
                    <span>Nhật được (FOUND)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot-lost" />
                    <span>Báo mất (LOST)</span>
                  </div>
                </div>

                <svg className="a01-svg-chart" viewBox="0 0 520 160">
                  {/* Grid Lines */}
                  {[0, 4, 8, 12, 16, 20].map((val) => {
                    const y = getY(val)
                    return (
                      <g key={val}>
                        <line x1="36" y1={y} x2="500" y2={y} stroke="#F0ECE4" strokeWidth="1" />
                        <text x="18" y={y + 3.5} fontSize="9.5" fill="#7B8B82" textAnchor="middle">{val}</text>
                      </g>
                    )
                  })}

                  {/* Day Labels */}
                  {chartDays.map((day, idx) => (
                    <text key={day} x={getX(idx)} y="152" fontSize="9.5" fill="#7B8B82" textAnchor="middle">{day}</text>
                  ))}

                  {/* FOUND Line (Green) */}
                  <polyline
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={foundPoints}
                  />
                  {foundData.map((val, idx) => (
                    <circle
                      key={`f-${chartDays[idx]}`}
                      cx={getX(idx)}
                      cy={getY(val)}
                      r="3.5"
                      fill="#FFFFFF"
                      stroke="#2E7D32"
                      strokeWidth="2"
                    />
                  ))}

                  {/* LOST Line (Orange) */}
                  <polyline
                    fill="none"
                    stroke="#FB8C00"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={lostPoints}
                  />
                  {lostData.map((val, idx) => (
                    <circle
                      key={`l-${chartDays[idx]}`}
                      cx={getX(idx)}
                      cy={getY(val)}
                      r="3.5"
                      fill="#FFFFFF"
                      stroke="#FB8C00"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Right: Pending Tasks Card */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <Calendar size={16} />
                  <span>Công việc cần xử lý</span>
                </div>
              </div>

              <div className="m01-tasks-list">
                <div className="m01-task-item">
                  <div className="m01-task-left">
                    <div className="m01-task-icon">
                      <FileText size={16} />
                    </div>
                    <span className="m01-task-title">Kiểm duyệt tin đăng mới</span>
                  </div>
                  <div className="m01-task-right">
                    <span className="m01-task-badge">12</span>
                    <ChevronRight size={14} color="#8B9E94" />
                  </div>
                </div>

                <div className="m01-task-item">
                  <div className="m01-task-left">
                    <div className="m01-task-icon">
                      <Send size={16} />
                    </div>
                    <span className="m01-task-title">Xác minh yêu cầu nhận đồ</span>
                  </div>
                  <div className="m01-task-right">
                    <span className="m01-task-badge">5</span>
                    <ChevronRight size={14} color="#8B9E94" />
                  </div>
                </div>

                <div className="m01-task-item">
                  <div className="m01-task-left">
                    <div className="m01-task-icon">
                      <Package size={16} />
                    </div>
                    <span className="m01-task-title">Xác nhận bàn giao đồ</span>
                  </div>
                  <div className="m01-task-right">
                    <span className="m01-task-badge">2</span>
                    <ChevronRight size={14} color="#8B9E94" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- Bottom Row ---------------- */}
          <div className="m01-two-col-grid">
            {/* Left: Review Items (Newest) */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <FileText size={16} />
                  <span>Tin đăng chờ kiểm duyệt (mới nhất)</span>
                </div>
                <a href="#all" className="a01-card-link" onClick={(e) => e.preventDefault()}>
                  Xem tất cả →
                </a>
              </div>

              <div className="m01-review-list">
                {/* Item 1 */}
                <div className="m01-review-item">
                  <img src={thumbWallet} alt="" className="m01-review-thumb" />
                  <div className="m01-review-info">
                    <div className="m01-review-headline">
                      <span className="m01-type-badge m01-type-found">FOUND</span>
                      <span className="m01-review-title">Nhặt được ví da màu đen</span>
                    </div>
                    <div className="m01-review-meta">
                      <div className="m01-meta-item">
                        <MapPin size={12} />
                        <span>Thư viện tầng 2</span>
                      </div>
                      <div className="m01-meta-item">
                        <Calendar size={12} />
                        <span>10/11/2026 09:24</span>
                      </div>
                    </div>
                  </div>
                  <div className="m01-review-actions">
                    <button className="m01-btn-approve">
                      <Check size={13} />
                      Duyệt
                    </button>
                    <button className="m01-btn-reject">
                      <X size={13} />
                      Từ chối
                    </button>
                    <button className="m01-btn-more">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="m01-review-item">
                  <img src={thumbAirpods} alt="" className="m01-review-thumb" />
                  <div className="m01-review-info">
                    <div className="m01-review-headline">
                      <span className="m01-type-badge m01-type-found">FOUND</span>
                      <span className="m01-review-title">Nhặt được tai nghe AirPods</span>
                    </div>
                    <div className="m01-review-meta">
                      <div className="m01-meta-item">
                        <MapPin size={12} />
                        <span>Giảng đường A</span>
                      </div>
                      <div className="m01-meta-item">
                        <Calendar size={12} />
                        <span>09/11/2026 14:10</span>
                      </div>
                    </div>
                  </div>
                  <div className="m01-review-actions">
                    <button className="m01-btn-approve">
                      <Check size={13} />
                      Duyệt
                    </button>
                    <button className="m01-btn-reject">
                      <X size={13} />
                      Từ chối
                    </button>
                    <button className="m01-btn-more">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="m01-review-item">
                  <img src={thumbBackpack} alt="" className="m01-review-thumb" />
                  <div className="m01-review-info">
                    <div className="m01-review-headline">
                      <span className="m01-type-badge m01-type-lost">LOST</span>
                      <span className="m01-review-title">Báo mất balo màu xanh</span>
                    </div>
                    <div className="m01-review-meta">
                      <div className="m01-meta-item">
                        <MapPin size={12} />
                        <span>Khu vực căng tin</span>
                      </div>
                      <div className="m01-meta-item">
                        <Calendar size={12} />
                        <span>09/11/2026 08:37</span>
                      </div>
                    </div>
                  </div>
                  <div className="m01-review-actions">
                    <button className="m01-btn-approve">
                      <Check size={13} />
                      Duyệt
                    </button>
                    <button className="m01-btn-reject">
                      <X size={13} />
                      Từ chối
                    </button>
                    <button className="m01-btn-more">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Claim Verification Cards */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <Send size={16} />
                  <span>Yêu cầu nhận đồ chờ xác minh</span>
                </div>
                <a href="#all" className="a01-card-link" onClick={(e) => e.preventDefault()}>
                  Xem tất cả →
                </a>
              </div>

              <div className="m01-claims-list">
                {/* Claim 1 */}
                <div className="m01-claim-item">
                  <img src={thumbWallet} alt="" className="m01-claim-thumb" />
                  <div className="m01-claim-info">
                    <span className="m01-claim-title">Yêu cầu: Ví da màu đen</span>
                    <div className="m01-claim-detail">
                      <User size={12} />
                      <span>SV: 23IT.EB013</span>
                    </div>
                    <div className="m01-claim-detail">
                      <Calendar size={12} />
                      <span>Gửi: 10/11/2026 09:24</span>
                    </div>
                  </div>
                  <div className="m01-claim-actions">
                    <span className="m01-claim-status-pill">PENDING</span>
                    <button className="m01-btn-verify">Xác minh</button>
                  </div>
                </div>

                {/* Claim 2 */}
                <div className="m01-claim-item">
                  <img src={thumbAirpods} alt="" className="m01-claim-thumb" />
                  <div className="m01-claim-info">
                    <span className="m01-claim-title">Yêu cầu: Tai nghe AirPods</span>
                    <div className="m01-claim-detail">
                      <User size={12} />
                      <span>SV: 23IT.EB028</span>
                    </div>
                    <div className="m01-claim-detail">
                      <Calendar size={12} />
                      <span>Gửi: 07/11/2026 14:10</span>
                    </div>
                  </div>
                  <div className="m01-claim-actions">
                    <span className="m01-claim-status-pill">PENDING</span>
                    <button className="m01-btn-verify">Xác minh</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
