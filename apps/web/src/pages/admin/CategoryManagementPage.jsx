import { useState } from 'react'
import { Search, ChevronDown, LayoutGrid, Layers, Eye, EyeOff, Pencil, MoreHorizontal, Plus, RefreshCw, X, Check, Info, Home, BookOpen, CircleAlert, Bell, Crown, Users, Settings, FileText, BarChart3, LogOut, ShieldCheck } from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'
import './CategoryManagement.css'
import '../admin/AdminDashboard.css'

/* ====== Sidebar menu items ====== */
const menuItems = [
  { id: 'overview',    label: 'Tổng quan',            icon: Home,       path: '/admin',             ready: true  },
  { id: 'users',       label: 'Quản lý người dùng',   icon: Users,      path: '/admin/users',       ready: true  },
  { id: 'categories',  label: 'Quản lý danh mục',     icon: Layers,     path: '/admin/categories',  ready: true  },
  { id: 'items',       label: 'Quản lý tin đăng',     icon: FileText,   path: '/admin/items',       ready: false },
  { id: 'settings',    label: 'Cấu hình hệ thống',    icon: Settings,   path: '/admin/settings',    ready: false },
  { id: 'audit',       label: 'Nhật ký hoạt động',    icon: ShieldCheck,path: '/admin/audit',       ready: true  },
  { id: 'reports',     label: 'Thống kê & báo cáo',   icon: BarChart3,  path: '/admin/reports',     ready: false },
]

/* ====== Category data from design ====== */
const categories = [
  { id: 1, name: 'Ví, bóp', desc: 'Ví tiền, bóp, ví giấy tờ,...', count: 56, status: 'visible', iconColor: 'cat-icon-brown', iconType: 'wallet' },
  { id: 2, name: 'Điện thoại', desc: 'Điện thoại di động, smartphone,...', count: 48, status: 'visible', iconColor: 'cat-icon-blue', iconType: 'phone' },
  { id: 3, name: 'Balo, túi xách', desc: 'Balo, túi xách, túi laptop,...', count: 42, status: 'visible', iconColor: 'cat-icon-purple', iconType: 'backpack' },
  { id: 4, name: 'Sách, tài liệu', desc: 'Sách, giáo trình, tài liệu học tập,...', count: 37, status: 'visible', iconColor: 'cat-icon-teal', iconType: 'book' },
  { id: 5, name: 'Thẻ, giấy tờ', desc: 'Thẻ sinh viên, CCCD, giấy tờ tùy thân,...', count: 29, status: 'visible', iconColor: 'cat-icon-red', iconType: 'card' },
  { id: 6, name: 'Đồ điện tử khác', desc: 'Tai nghe, sạc, chuột, USB,...', count: 18, status: 'visible', iconColor: 'cat-icon-cyan', iconType: 'electronics' },
  { id: 7, name: 'Đồ cá nhân', desc: 'Bình nước, ô, mũ, kính,...', count: 15, status: 'visible', iconColor: 'cat-icon-pink', iconType: 'personal' },
  { id: 8, name: 'Khác', desc: 'Các đồ vật khác chưa thuộc danh mục trên.', count: 9, status: 'hidden', iconColor: 'cat-icon-grey', iconType: 'other' },
]

/* Category icons (SVG inline based on type) */
function CategoryIcon({ type }) {
  switch (type) {
    case 'wallet':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      )
    case 'phone':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
        </svg>
      )
    case 'backpack':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" /><path d="M8 10h8" /><path d="M8 18h8" />
        </svg>
      )
    case 'book':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      )
    case 'card':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      )
    case 'electronics':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" /><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )
    case 'personal':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'other':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
      )
    default:
      return <LayoutGrid size={16} />
  }
}

export default function CategoryManagementPage() {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  return (
    <div className="a01-dashboard-wrapper">
      {/* ==================== TOP HEADER (reused A01) ==================== */}
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
              className="a01-admin-role-pill"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            >
              <Crown size={14} className="crown-icon" />
              <span>Quản trị viên</span>
              <ChevronDown size={13} />
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

      <div className="a03-body">
        {/* ==================== SIDEBAR (reused A01) ==================== */}
        <aside className="a01-sidebar">
          <div className="a01-user-card">
            <img src={adminAvatar} alt="Quản trị viên" className="a01-avatar-img" />
            <div className="a01-user-info">
              <span className="a01-user-name">Quản trị viên</span>
              <span className="a01-user-badge">Admin</span>
            </div>
          </div>
          <nav className="a01-sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={item.path}
                  className={`a01-menu-btn${item.id === 'categories' ? ' active' : ''}`}
                  onClick={(e) => { if (!item.ready) e.preventDefault() }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
          <div className="a01-sidebar-bottom">
            <button className="a01-logout-btn"><LogOut size={16} /> Đăng xuất</button>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="a03-main">
          {/* Banner Card */}
          <div className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <LayoutGrid size={22} className="banner-category-icon" />
                Quản lý danh mục
              </h1>
              <p className="a01-banner-subtitle">
                Quản lý các danh mục đồ vật (ví, điện thoại, balo, sách, ...) trong hệ thống.
              </p>
            </div>
            <img src={bannerMascot} alt="" className="a01-banner-img" />
          </div>

          {/* 3 Stat Cards + Add Button */}
          <div className="a03-stats-row">
            <div className="a01-stat-card">
              <div className="a01-stat-icon-wrapper icon-wrap-green">
                <Layers size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">8</span>
                <span className="a01-stat-label">Tổng danh mục</span>
              </div>
            </div>
            <div className="a01-stat-card">
              <div className="a01-stat-icon-wrapper icon-wrap-blue">
                <Eye size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">7</span>
                <span className="a01-stat-label">Đang hiển thị</span>
              </div>
            </div>
            <div className="a01-stat-card">
              <div className="a01-stat-icon-wrapper icon-wrap-orange">
                <EyeOff size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">1</span>
                <span className="a01-stat-label">Đang ẩn</span>
              </div>
            </div>
            <button className="a03-add-btn">
              <Plus size={18} />
              Thêm danh mục
            </button>
          </div>

          {/* Content Grid: Table + Right Panel */}
          <div className="a03-content-grid">
            {/* Left: Table */}
            <div className="a03-left-panel">
              {/* Filter Bar */}
              <div className="a03-filter-bar">
                <div className="a03-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input type="text" placeholder="Tìm theo tên danh mục, mô tả..." />
                </div>
                <button className="a03-dropdown-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                  Tất cả trạng thái
                  <ChevronDown size={13} />
                </button>
                <button className="a03-dropdown-btn">
                  Sắp xếp: Mới nhất
                  <ChevronDown size={13} />
                </button>
              </div>

              {/* Table */}
              <table className="a03-table">
                <thead>
                  <tr>
                    <th style={{ width: '36px' }}>#</th>
                    <th>Danh mục</th>
                    <th>Mô tả</th>
                    <th style={{ textAlign: 'center' }}>Số tin</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className={cat.id === 1 ? 'a03-row-selected' : ''}>
                      <td>{cat.id}</td>
                      <td>
                        <div className="a03-category-cell">
                          <div className={`a03-cat-icon-wrapper ${cat.iconColor}`}>
                            <CategoryIcon type={cat.iconType} />
                          </div>
                          <span className="a03-cat-name">{cat.name}</span>
                        </div>
                      </td>
                      <td><span className="a03-desc-txt">{cat.desc}</span></td>
                      <td className="a03-count-txt">{cat.count}</td>
                      <td>
                        <span className={`a03-status-pill ${cat.status === 'visible' ? 'status-visible' : 'status-hidden-cat'}`}>
                          {cat.status === 'visible' ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                      <td>
                        <div className="a03-actions-cell">
                          <button className="a03-action-btn" title="Chỉnh sửa"><Pencil size={14} /></button>
                          <button className="a03-action-btn" title="Xem"><Eye size={14} /></button>
                          <button className="a03-action-btn" title="Thêm"><MoreHorizontal size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="a03-pagination-bar">
                <span>Hiển thị 1 – 8 trong 8 danh mục</span>
                <div className="a03-pagination-controls">
                  <button className="a03-page-btn">&lt;</button>
                  <button className="a03-page-btn active">1</button>
                  <button className="a03-page-btn">&gt;</button>
                </div>
              </div>
            </div>

            {/* Right Panel: Category Detail Form */}
            <div className="a03-right-panel">
              <div className="a03-detail-card">
                <div className="a03-card-sec-title">
                  <Pencil size={16} />
                  Thông tin danh mục
                </div>

                {/* Category Name */}
                <div className="a03-form-group">
                  <label className="a03-form-label">Tên danh mục <span className="required">*</span></label>
                  <input type="text" className="a03-form-input" defaultValue="Ví, bóp" />
                </div>

                {/* Description */}
                <div className="a03-form-group">
                  <label className="a03-form-label">Mô tả</label>
                  <div className="a03-form-textarea-wrap">
                    <textarea className="a03-form-textarea" defaultValue="Ví tiền, bóp, ví giấy tờ,..." />
                    <span className="a03-char-count">24 / 200</span>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="a03-toggle-row">
                  <span className="a03-form-label">Trạng thái</span>
                  <div className="a03-toggle-label-row">
                    <button className="a03-toggle-switch active" type="button">
                      <span className="a03-toggle-knob"></span>
                    </button>
                    <span className="a03-toggle-text">Hiển thị trên hệ thống</span>
                  </div>
                </div>

                {/* Info Notice */}
                <div className="a03-info-notice">
                  <Info size={14} />
                  <span>Danh mục ẩn sẽ không hiển thị khi người dùng đăng tin mới, nhưng vẫn giữ nguyên các tin đăng cũ.</span>
                </div>

                {/* Action Buttons */}
                <div className="a03-form-actions">
                  <button className="a03-btn-refresh">
                    <RefreshCw size={13} />
                    Làm mới
                  </button>
                  <button className="a03-btn-cancel">
                    <X size={13} />
                    Hủy thay đổi
                  </button>
                  <button className="a03-btn-save">
                    <Check size={13} />
                    Lưu thay đổi
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

