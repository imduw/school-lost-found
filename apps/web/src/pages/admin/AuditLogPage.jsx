import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell, Crown, ChevronDown,
  Users, FileText, Settings, ShieldCheck, BarChart3,
  LogOut, Layers, RefreshCw, Eye, UserPlus, Lock, CheckCircle,
  Pencil, Calendar,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'
import avatarChien from '../../assets/users/avatar-chien.png'
import avatarDuc from '../../assets/users/avatar-duc.png'
import './AuditLog.css'
import '../admin/AdminDashboard.css'

/* ====== Audit log data from design ====== */
const auditLogs = [
  {
    id: 1,
    date: '10/11/2026',
    time: '16:22',
    actor: { name: 'Phạm Minh Đức', avatar: avatarDuc },
    role: 'ADMIN',
    action: 'Tạo tài khoản',
    target: 'user#1287',
    summary: 'Tạo tài khoản moderator cho 23IT.EB045',
    iconType: 'create',
  },
  {
    id: 2,
    date: '10/11/2026',
    time: '14:05',
    actor: { name: 'Doãn Văn Chiến', avatar: avatarChien },
    role: 'MODERATOR',
    action: 'Ẩn tin đăng',
    target: 'post#318',
    summary: 'Ẩn tin đăng do chứa thông tin cá nhân.',
    iconType: 'lock',
  },
  {
    id: 3,
    date: '10/11/2026',
    time: '09:40',
    actor: { name: 'Phạm Minh Đức', avatar: avatarDuc },
    role: 'ADMIN',
    action: 'Cập nhật vai trò',
    target: 'user#1254',
    summary: 'Đổi vai trò từ STUDENT sang MODERATOR.',
    iconType: 'update',
  },
  {
    id: 4,
    date: '09/11/2026',
    time: '16:30',
    actor: { name: 'Doãn Văn Chiến', avatar: avatarChien },
    role: 'MODERATOR',
    action: 'Xác nhận bàn giao',
    target: 'claim#0013',
    summary: 'Xác nhận bàn giao đồ cho sinh viên 23IT.EB017.',
    iconType: 'verify',
  },
  {
    id: 5,
    date: '09/11/2026',
    time: '15:18',
    actor: { name: 'Phạm Minh Đức', avatar: avatarDuc },
    role: 'ADMIN',
    action: 'Cập nhật danh mục',
    target: 'category#05',
    summary: 'Sửa tên danh mục "Đồ điện tử".',
    iconType: 'edit',
  },
]

/* Sidebar menu */
const menuItems = [
  { id: 'overview',    label: 'Tổng quan',            icon: Home,       path: '/admin',             ready: true  },
  { id: 'users',       label: 'Quản lý người dùng',   icon: Users,      path: '/admin/users',       ready: true  },
  { id: 'categories',  label: 'Quản lý danh mục',     icon: Layers,     path: '/admin/categories',  ready: true  },
  { id: 'items',       label: 'Quản lý tin đăng',     icon: FileText,   path: '/admin/items',       ready: false },
  { id: 'settings',    label: 'Cấu hình hệ thống',    icon: Settings,   path: '/admin/settings',    ready: false },
  { id: 'audit',       label: 'Nhật ký hoạt động',    icon: ShieldCheck,path: '/admin/audit',       ready: true  },
  { id: 'reports',     label: 'Thống kê & báo cáo',   icon: BarChart3,  path: '/admin/reports',     ready: false },
]

/* Row icon by type */
function RowIcon({ type }) {
  const cls = {
    create: 'a04-row-icon-create',
    lock:   'a04-row-icon-lock',
    update: 'a04-row-icon-update',
    verify: 'a04-row-icon-verify',
    edit:   'a04-row-icon-edit',
  }[type]

  const Icon = {
    create: UserPlus,
    lock:   Lock,
    update: RefreshCw,
    verify: CheckCircle,
    edit:   Pencil,
  }[type]

  return (
    <span className={`a04-row-icon ${cls}`}>
      <Icon size={12} />
    </span>
  )
}

export default function AuditLogPage() {
  const selectedLog = auditLogs[0]
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  return (
    <div className="a01-dashboard-wrapper">
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

      <div className="a04-body">
        {/* ==================== SIDEBAR ==================== */}
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
                  className={`a01-menu-btn${item.id === 'audit' ? ' active' : ''}`}
                  onClick={(e) => { if (!item.ready) e.preventDefault() }}
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
        <main className="a04-main">
          {/* Banner */}
          <div className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <ShieldCheck size={22} className="banner-audit-icon" />
                Nhật ký hoạt động
              </h1>
              <p className="a01-banner-subtitle">
                Theo dõi và tra cứu lịch sử các thao tác quản trị trong hệ thống.
              </p>
            </div>
            <img src={bannerMascot} alt="" className="a01-banner-img" />
          </div>

          {/* 4 Stat Cards */}
          <div className="a04-stats-row">
            <div className="a01-stat-card">
              <div className="a01-stat-icon-wrapper icon-wrap-blue">
                <FileText size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">1.842</span>
                <span className="a01-stat-label">Tổng nhật ký</span>
              </div>
            </div>
            <div className="a01-stat-card">
              <div className="a01-stat-icon-wrapper icon-wrap-green">
                <Users size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">156</span>
                <span className="a01-stat-label">Hành động quản trị</span>
              </div>
            </div>
            <div className="a01-stat-card">
              <div className="a01-stat-icon-wrapper icon-wrap-orange">
                <Lock size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">34</span>
                <span className="a01-stat-label">Khóa / mở khóa tài khoản</span>
              </div>
            </div>
            <div className="a01-stat-card">
              <div className="a01-stat-icon-wrapper icon-wrap-purple">
                <Settings size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">28</span>
                <span className="a01-stat-label">Thay đổi hệ thống</span>
              </div>
            </div>
          </div>

          {/* Content Grid: Table + Detail */}
          <div className="a04-content-grid">
            {/* Left: Table */}
            <div className="a04-left-panel">
              {/* Filter Bar */}
              <div className="a04-filter-bar">
                <div className="a04-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input type="text" />
                </div>
                <button className="a04-dropdown-btn">
                  <Calendar size={13} />
                  Khoảng thời gian
                  <ChevronDown size={12} />
                </button>
                <button className="a04-dropdown-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                  Tất cả hành động
                  <ChevronDown size={12} />
                </button>
                <button className="a04-dropdown-btn">
                  <Users size={13} />
                  Tất cả vai trò
                  <ChevronDown size={12} />
                </button>
                <button className="a04-refresh-btn" title="Làm mới">
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Table */}
              <table className="a04-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Thời gian</th>
                    <th>Người thực hiện</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                    <th>Đối tượng</th>
                    <th>Nội dung tóm tắt</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className={log.id === 1 ? 'a04-row-selected' : ''}>
                      <td>
                        <div className="a04-idx-cell">
                          <RowIcon type={log.iconType} />
                          {log.id}
                        </div>
                      </td>
                      <td>
                        <div className="a04-time-cell">
                          <span className="a04-date-txt">{log.date}</span>
                          <span className="a04-time-txt">{log.time}</span>
                        </div>
                      </td>
                      <td>
                        <div className="a04-actor-cell">
                          <img src={log.actor.avatar} alt={log.actor.name} className="a04-actor-avatar" />
                          <span className="a04-actor-name">{log.actor.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`a04-role-pill ${log.role === 'ADMIN' ? 'role-admin-pill' : 'role-mod-pill'}`}>
                          {log.role}
                        </span>
                      </td>
                      <td><span className="a04-action-txt">{log.action}</span></td>
                      <td><span className="a04-target-txt">{log.target}</span></td>
                      <td><span className="a04-summary-txt">{log.summary}</span></td>
                      <td>
                        <button className="a04-view-btn" title="Xem chi tiết">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="a04-pagination-bar">
                <span>Hiển thị 1 – 5 trong 1.842 nhật ký</span>
                <div className="a04-pagination-controls">
                  <button className="a04-page-btn">&lt;</button>
                  <button className="a04-page-btn active">1</button>
                  <button className="a04-page-btn">2</button>
                  <button className="a04-page-btn">3</button>
                  <span className="a04-page-ellipsis">...</span>
                  <button className="a04-page-btn">369</button>
                  <button className="a04-page-btn">&gt;</button>
                </div>
                <div className="a04-page-rows-select">
                  Số dòng:
                  <select defaultValue="5">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Panel: Log Detail */}
            <div className="a04-right-panel">
              <div className="a04-detail-card">
                {/* Title */}
                <div className="a04-card-sec-title">
                  <FileText size={16} />
                  Chi tiết nhật ký
                </div>

                {/* Basic info */}
                <div className="a04-detail-fields">
                  <div className="a04-field-row">
                    <span className="a04-field-label">
                      <FileText size={13} color="#8B9E94" />
                      Mã nhật ký:
                    </span>
                    <span className="a04-field-value-code">LOG-20261110-01622</span>
                  </div>
                  <div className="a04-field-row">
                    <span className="a04-field-label">
                      <Calendar size={13} color="#8B9E94" />
                      Thời gian:
                    </span>
                    <span className="a04-field-value">10/11/2026 · 16:22</span>
                  </div>
                  <div className="a04-field-row" style={{ alignItems: 'center' }}>
                    <span className="a04-field-label">
                      <Users size={13} color="#8B9E94" />
                      Người thực hiện:
                    </span>
                    <div className="a04-detail-actor">
                      <div className="a04-detail-actor-info">
                        <span className="a04-detail-actor-name">{selectedLog.actor.name}</span>
                        <span className="a04-detail-actor-email">(admin@vku.udn.vn)</span>
                      </div>
                      <img src={selectedLog.actor.avatar} alt={selectedLog.actor.name} className="a04-detail-actor-avatar" />
                    </div>
                  </div>
                  <div className="a04-field-row">
                    <span className="a04-field-label">
                      <ShieldCheck size={13} color="#8B9E94" />
                      Vai trò:
                    </span>
                    <span className={`a04-role-pill ${selectedLog.role === 'ADMIN' ? 'role-admin-pill' : 'role-mod-pill'}`}>
                      {selectedLog.role}
                    </span>
                  </div>
                </div>

                <hr className="a04-section-divider" />

                {/* Action Info */}
                <div className="a04-action-info-title">
                  <Settings size={15} />
                  Thông tin hành động
                </div>

                <div className="a04-action-detail-block">
                  <div className="a04-action-detail-row">
                    <span className="a04-action-detail-label">Hành động:</span>
                    <span className="a04-action-detail-value">{selectedLog.action}</span>
                  </div>
                  <div className="a04-action-detail-row">
                    <span className="a04-action-detail-label">Đối tượng:</span>
                    <span className="a04-action-detail-value">{selectedLog.target}</span>
                  </div>
                  <div className="a04-action-detail-row">
                    <span className="a04-action-detail-label">Nội dung chi tiết:</span>
                  </div>
                  <div className="a04-full-detail-box">
                    Tạo tài khoản moderator cho sinh viên 23IT.EB045 (Trần Quốc Trung).
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
