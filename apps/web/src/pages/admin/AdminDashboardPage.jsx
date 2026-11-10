import { useState } from 'react'
import {
  Home,
  Search,
  BookOpen,
  Info,
  Bell,
  Crown,
  ChevronDown,
  Users,
  LayoutGrid,
  FileText,
  Settings,
  ShieldCheck,
  BarChart2,
  LogOut,
  Send,
  Layers,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
  UserPlus,
  EyeOff,
  PackageCheck,
  Check,
  Eye,
} from 'lucide-react'
import './AdminDashboard.css'

// Authentic assets
import logoSvg from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'
import thumbWallet from '../../assets/dashboard/thumb-wallet.png'
import thumbAirpods from '../../assets/dashboard/thumb-airpods.png'
import thumbBackpack from '../../assets/dashboard/thumb-backpack.png'
import thumbCard from '../../assets/dashboard/thumb-card.png'

export default function AdminDashboardPage() {
  const [activeMenu, setActiveMenu] = useState('overview')
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  const menuItems = [
    { id: 'overview',    label: 'Tổng quan',            icon: Home,       path: '/admin',             ready: true  },
    { id: 'users',       label: 'Quản lý người dùng',   icon: Users,      path: '/admin/users',       ready: true  },
    { id: 'categories',  label: 'Quản lý danh mục',     icon: LayoutGrid, path: '/admin/categories',  ready: true  },
    { id: 'items',       label: 'Quản lý tin đăng',     icon: FileText,   path: '/admin/items',       ready: false },
    { id: 'settings',    label: 'Cấu hình hệ thống',    icon: Settings,   path: '/admin/settings',    ready: false },
    { id: 'audit',       label: 'Nhật ký hoạt động',    icon: ShieldCheck,path: '/admin/audit',       ready: true  },
    { id: 'reports',     label: 'Thống kê & báo cáo',   icon: BarChart2,  path: '/admin/reports',     ready: false },
  ]

  const statCards = [
    {
      id: 'users-count',
      value: '1.248',
      label: 'Tài khoản người dùng',
      trend: '+4.2%',
      trendClass: 'trend-green',
      iconClass: 'icon-wrap-green',
      Icon: Users,
    },
    {
      id: 'items-count',
      value: '324',
      label: 'Tin đăng',
      trend: '+8.7%',
      trendClass: 'trend-green',
      iconClass: 'icon-wrap-blue',
      Icon: FileText,
    },
    {
      id: 'claims-count',
      value: '276',
      label: 'Yêu cầu nhận đồ',
      trend: '+12.6%',
      trendClass: 'trend-green',
      iconClass: 'icon-wrap-orange',
      Icon: Send,
    },
    {
      id: 'categories-count',
      value: '8',
      label: 'Danh mục tin',
      trend: '0%',
      trendClass: 'trend-purple',
      iconClass: 'icon-wrap-purple',
      Icon: Layers,
    },
  ]

  const recentItems = [
    {
      id: 1,
      title: 'Nhặt được ví da màu đen',
      thumb: thumbWallet,
      type: 'FOUND',
      author: '23IT.EB013',
      time: '10/11/2026 09:24',
      status: 'pending',
      statusLabel: 'Chờ duyệt',
      statusIcon: Clock,
    },
    {
      id: 2,
      title: 'Nhặt được tai nghe AirPods',
      thumb: thumbAirpods,
      type: 'FOUND',
      author: '23IT.EB028',
      time: '09/11/2026 14:10',
      status: 'approved',
      statusLabel: 'Đã duyệt',
      statusIcon: Check,
    },
    {
      id: 3,
      title: 'Báo mất balo màu xanh',
      thumb: thumbBackpack,
      type: 'LOST',
      author: '23IT.EB045',
      time: '09/11/2026 08:37',
      status: 'approved',
      statusLabel: 'Đã duyệt',
      statusIcon: Check,
    },
    {
      id: 4,
      title: 'Mất thẻ sinh viên',
      thumb: thumbCard,
      type: 'LOST',
      author: '23IT.EB017',
      time: '08/11/2026 21:05',
      status: 'hidden',
      statusLabel: 'Đã ẩn',
      statusIcon: Eye,
    },
  ]

  const recentActivities = [
    {
      id: 'act-1',
      title: 'Duyệt tin đăng #324',
      meta: 'Bởi: Cán bộ hỗ trợ · 10/11/2026 09:40',
      type: 'green',
      Icon: CheckCircle,
    },
    {
      id: 'act-2',
      title: 'Tạo tài khoản moderator',
      meta: 'Bởi: Admin · 09/11/2026 16:22',
      type: 'green',
      Icon: UserPlus,
    },
    {
      id: 'act-3',
      title: 'Ẩn tin đăng #318',
      meta: 'Bởi: Cán bộ hỗ trợ · 09/11/2026 11:05',
      type: 'red',
      Icon: EyeOff,
    },
    {
      id: 'act-4',
      title: 'Xác nhận bàn giao (Claim #CLM-20261108-0013)',
      meta: 'Bởi: Cán bộ hỗ trợ · 08/11/2026 16:30',
      type: 'green',
      Icon: PackageCheck,
    },
  ]

  // Chart Coordinates calculation for Line Chart (ViewBox: 0 0 460 140)
  // X values: 35, 100, 165, 230, 295, 360, 425
  // Y range: 0 -> 120 (Y=120 is 0, Y=20 is 50)
  const chartPointsFound = [
    { x: 35, y: 96 },   // 12
    { x: 100, y: 72 },  // 24
    { x: 165, y: 78 },  // 21
    { x: 230, y: 48 },  // 36
    { x: 295, y: 74 },  // 23
    { x: 360, y: 44 },  // 38
    { x: 425, y: 64 },  // 28
  ]

  const chartPointsLost = [
    { x: 35, y: 110 },  // 5
    { x: 100, y: 98 },  // 11
    { x: 165, y: 104 }, // 8
    { x: 230, y: 84 },  // 18
    { x: 295, y: 98 },  // 11
    { x: 360, y: 86 },  // 17
    { x: 425, y: 98 },  // 11
  ]

  const makeSmoothPath = (pts) => {
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i]
      const p1 = pts[i + 1]
      const mx = (p0.x + p1.x) / 2
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`
    }
    return d
  }

  return (
    <div className="a01-dashboard-wrapper">
      {/* ---------------- Header ---------------- */}
      <header className="a01-header">
        <div className="a01-header-left">
          <a href="/" className="a01-logo">
            <img src={logoSvg} alt="School Lost & Found" />
          </a>
        </div>

        <nav className="a01-header-nav">
          <a href="/" className="a01-nav-link">
            <Home size={15} />
            <span>Trang chủ</span>
          </a>
          <a href="/items" className="a01-nav-link">
            <Search size={15} />
            <span>Tìm đồ</span>
          </a>
          <a href="/guide" className="a01-nav-link">
            <BookOpen size={15} />
            <span>Hướng dẫn</span>
          </a>
          <a href="/about" className="a01-nav-link">
            <Info size={15} />
            <span>Về hệ thống</span>
          </a>
        </nav>

        <div className="a01-header-right">
          <button type="button" className="a01-bell-btn" aria-label="Thông báo">
            <Bell size={18} />
            <span className="a01-bell-badge">3</span>
          </button>

          <div className="a01-role-dropdown-container">
            <button
              type="button"
              className="a01-admin-role-pill"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            >
              <Crown size={14} className="crown-icon" />
              <span>Quản trị viên</span>
              <ChevronDown size={14} />
            </button>

            {roleMenuOpen && (
              <div className="a01-role-menu">
                <a href="/admin" className="a01-role-menu-item active">
                  <Crown size={14} color="#D48806" />
                  <span>Quản trị viên (Admin)</span>
                </a>
                <a href="/staff" className="a01-role-menu-item">
                  <Users size={14} color="#2E7D32" />
                  <span>Cán bộ hỗ trợ (Staff)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------------- Layout Body ---------------- */}
      <div className="a01-body">
        {/* Sidebar */}
        <aside className="a01-sidebar">
          <div className="a01-user-card">
            <img src={adminAvatar} alt="Admin" className="a01-avatar-img" />
            <div className="a01-user-info">
              <span className="a01-user-name">Quản trị viên</span>
              <span className="a01-user-badge">Admin</span>
            </div>
          </div>

          <nav className="a01-sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeMenu === item.id
              return (
                <a
                  key={item.id}
                  href={item.path}
                  className={`a01-menu-btn ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    if (!item.ready) e.preventDefault()
                    setActiveMenu(item.id)
                  }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>

          <div className="a01-sidebar-bottom">
            <button
              type="button"
              className="a01-logout-btn"
              onClick={() => alert('Đăng xuất')}
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="a01-main">
          {/* Welcome Banner Card */}
          <section className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <Crown size={22} className="banner-crown" />
                <span>Trang tổng quan quản trị</span>
              </h1>
              <p className="a01-banner-subtitle">
                Theo dõi hoạt động, quản lý người dùng và vận hành hệ thống
                School Lost &amp; Found.
              </p>
            </div>
            <img
              src={bannerMascot}
              alt="Mascot Miu & Thư viện"
              className="a01-banner-img"
            />
          </section>

          {/* 4 Stat Cards Row */}
          <section className="a01-stats-row">
            {statCards.map((card) => {
              const Icon = card.Icon
              return (
                <div key={card.id} className="a01-stat-card">
                  <div className={`a01-stat-icon-wrapper ${card.iconClass}`}>
                    <Icon size={22} />
                  </div>
                  <div className="a01-stat-info">
                    <span className="a01-stat-value">{card.value}</span>
                    <span className="a01-stat-label">{card.label}</span>
                    <span className={`a01-stat-trend ${card.trendClass}`}>
                      {card.trend !== '0%' ? `↑ ${card.trend}` : card.trend}
                      <span className="trend-subtext">so với tháng trước</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </section>

          {/* Middle Section: Line Chart & Donut Chart */}
          <section className="a01-two-col-grid">
            {/* Left: Line Chart */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <TrendingUp size={18} />
                  <span>Thống kê tin đăng theo thời gian</span>
                </div>
                <select className="a01-filter-select" defaultValue="7-days">
                  <option value="7-days">7 ngày qua</option>
                  <option value="30-days">30 ngày qua</option>
                </select>
              </div>

              <div className="a01-chart-container">
                <div className="a01-chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot-found" />
                    <span>FOUND (Nhặt được)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot-lost" />
                    <span>LOST (Báo mất)</span>
                  </div>
                </div>

                <svg
                  viewBox="0 0 460 145"
                  className="a01-svg-chart"
                  aria-label="Line chart"
                >
                  {/* Grid Lines */}
                  {[20, 44, 68, 92, 116].map((gy) => (
                    <line
                      key={gy}
                      x1="30"
                      y1={gy}
                      x2="450"
                      y2={gy}
                      stroke="#F0ECE4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Y-axis Labels */}
                  <text x="8" y="24" fontSize="10" fill="#8B9E94">50</text>
                  <text x="8" y="48" fontSize="10" fill="#8B9E94">40</text>
                  <text x="8" y="72" fontSize="10" fill="#8B9E94">30</text>
                  <text x="8" y="96" fontSize="10" fill="#8B9E94">20</text>
                  <text x="8" y="120" fontSize="10" fill="#8B9E94">10</text>
                  <text x="14" y="136" fontSize="10" fill="#8B9E94">0</text>

                  {/* X-axis Labels */}
                  {['04/11', '05/11', '06/11', '07/11', '08/11', '09/11', '10/11'].map(
                    (date, idx) => (
                      <text
                        key={date}
                        x={35 + idx * 65}
                        y="138"
                        fontSize="10"
                        fill="#8B9E94"
                        textAnchor="middle"
                      >
                        {date}
                      </text>
                    ),
                  )}

                  {/* Curves */}
                  <path
                    d={makeSmoothPath(chartPointsLost)}
                    fill="none"
                    stroke="#FB8C00"
                    strokeWidth="2.2"
                  />
                  <path
                    d={makeSmoothPath(chartPointsFound)}
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="2.2"
                  />

                  {/* Points */}
                  {chartPointsLost.map((p) => (
                    <circle
                      key={`lost-${p.x}`}
                      cx={p.x}
                      cy={p.y}
                      r="3.5"
                      fill="#FB8C00"
                    />
                  ))}
                  {chartPointsFound.map((p) => (
                    <circle
                      key={`found-${p.x}`}
                      cx={p.x}
                      cy={p.y}
                      r="3.5"
                      fill="#2E7D32"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Right: Donut Chart */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <Clock size={18} />
                  <span>Tình trạng xử lý yêu cầu</span>
                </div>
              </div>

              <div className="a01-donut-layout">
                <div className="a01-donut-svg-wrapper">
                  <svg
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    aria-label="Donut chart"
                  >
                    {/* Ring: Radius 36, Circumference 226.2 */}
                    {/* Segment 1: ACCEPTED - 78.3% (~177.1) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="none"
                      stroke="#43A047"
                      strokeWidth="12"
                      strokeDasharray="177.1 226.2"
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                    {/* Segment 2: REJECTED - 16.3% (~36.9) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="none"
                      stroke="#E57373"
                      strokeWidth="12"
                      strokeDasharray="36.9 226.2"
                      strokeDashoffset="-177.1"
                      transform="rotate(-90 50 50)"
                    />
                    {/* Segment 3: PENDING - 5.4% (~12.2) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="none"
                      stroke="#FDD835"
                      strokeWidth="12"
                      strokeDasharray="12.2 226.2"
                      strokeDashoffset="-214"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="a01-donut-center-text">
                    <div className="donut-center-val">276</div>
                    <div className="donut-center-sub">Yêu cầu</div>
                  </div>
                </div>

                <div className="a01-donut-legend">
                  <div className="donut-legend-row">
                    <span className="donut-legend-label">
                      <span className="donut-dot-pending" />
                      <span>PENDING – 5.4%</span>
                    </span>
                    <span className="donut-legend-val">15</span>
                  </div>

                  <div className="donut-legend-row">
                    <span className="donut-legend-label">
                      <span className="donut-dot-accepted" />
                      <span>ACCEPTED – 78.3%</span>
                    </span>
                    <span className="donut-legend-val">216</span>
                  </div>

                  <div className="donut-legend-row">
                    <span className="donut-legend-label">
                      <span className="donut-dot-rejected" />
                      <span>REJECTED – 16.3%</span>
                    </span>
                    <span className="donut-legend-val">45</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Section: Table & Activity */}
          <section className="a01-bottom-grid">
            {/* Left: Recent Items Table */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <FileText size={18} />
                  <span>Tin đăng mới nhất</span>
                </div>
                <a href="#xem-tat-ca-tin" className="a01-card-link">
                  <span>Xem tất cả</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <table className="a01-table">
                <thead>
                  <tr>
                    <th style={{ width: '24px' }}>#</th>
                    <th>Tiêu đề</th>
                    <th style={{ width: '60px' }}>Loại</th>
                    <th>Người đăng</th>
                    <th>Thời gian</th>
                    <th style={{ width: '90px' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item) => {
                    const StatusIcon = item.statusIcon
                    return (
                      <tr key={item.id}>
                        <td style={{ color: '#7B8B82' }}>{item.id}</td>
                        <td>
                          <div className="a01-item-cell">
                            <img
                              src={item.thumb}
                              alt=""
                              className="a01-thumb-img"
                            />
                            <span className="a01-item-title">{item.title}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`a01-badge-type ${
                              item.type === 'FOUND'
                                ? 'badge-found'
                                : 'badge-lost'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="a01-user-code">{item.author}</td>
                        <td className="a01-time-col">{item.time}</td>
                        <td>
                          <span
                            className={`a01-status-pill status-${item.status}`}
                          >
                            <StatusIcon size={12} />
                            <span>{item.statusLabel}</span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Right: Recent Activity */}
            <div className="a01-card">
              <div className="a01-card-header">
                <div className="a01-card-title">
                  <Clock size={18} />
                  <span>Hoạt động gần đây</span>
                </div>
                <a href="#xem-tat-ca-hoat-dong" className="a01-card-link">
                  <span>Xem tất cả</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="a01-activity-list">
                {recentActivities.map((act) => {
                  const Icon = act.Icon
                  return (
                    <div key={act.id} className="a01-activity-item">
                      <div
                        className={`a01-activity-icon ${
                          act.type === 'green'
                            ? 'act-icon-green'
                            : 'act-icon-red'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="a01-activity-content">
                        <span className="a01-activity-text">{act.title}</span>
                        <span className="a01-activity-meta">{act.meta}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
