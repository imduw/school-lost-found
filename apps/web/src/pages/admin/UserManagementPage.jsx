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
  GraduationCap,
  Filter,
  Activity,
  RotateCw,
  Pencil,
  Lock,
  Unlock,
  MoreHorizontal,
  Mail,
  User,
  Calendar,
  Clock,
  UserCheck,
  Trash2,
  Info as InfoIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react'
import './AdminDashboard.css'
import './UserManagement.css'

// Authentic assets
import logoSvg from '../../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../../assets/dashboard/admin-avatar.png'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'

// User avatars
import avatarChien from '../../assets/users/avatar-chien.png'
import avatarMai from '../../assets/users/avatar-mai.png'
import avatarTrung from '../../assets/users/avatar-trung.png'
import avatarBich from '../../assets/users/avatar-bich.png'
import avatarDuc from '../../assets/users/avatar-duc.png'
import avatarDetailChien from '../../assets/users/avatar-detail-chien.png'

export default function UserManagementPage() {
  const [activeMenu, setActiveMenu] = useState('users')
  const [selectedUser, setSelectedUser] = useState('23IT.EB013')
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
      id: 'total-users',
      value: '1.248',
      label: 'Tổng người dùng',
      sub: null,
      iconClass: 'icon-wrap-green',
      Icon: Users,
    },
    {
      id: 'students',
      value: '1.128',
      label: 'Sinh viên',
      sub: '(90.4%)',
      iconClass: 'icon-wrap-blue',
      Icon: GraduationCap,
    },
    {
      id: 'moderators',
      value: '112',
      label: 'Cán bộ hỗ trợ',
      sub: '(9.0%)',
      iconClass: 'icon-wrap-orange',
      Icon: ShieldCheck,
    },
    {
      id: 'admins',
      value: '8',
      label: 'Quản trị viên',
      sub: '(0.6%)',
      iconClass: 'icon-wrap-purple',
      Icon: Crown,
    },
  ]

  const usersList = [
    {
      id: 1,
      code: '23IT.EB013',
      name: 'Doãn Văn Chiến',
      avatar: avatarChien,
      email: 'dvchien@vku.udn.vn',
      role: 'STUDENT',
      roleClass: 'role-student',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdDate: '01/09/2023',
      isLocked: false,
    },
    {
      id: 2,
      code: '23IT.EB028',
      name: 'Nguyễn Thị Mai',
      avatar: avatarMai,
      email: 'ntmai@vku.udn.vn',
      role: 'STUDENT',
      roleClass: 'role-student',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdDate: '05/09/2023',
      isLocked: false,
    },
    {
      id: 3,
      code: '23IT.EB045',
      name: 'Trần Quốc Trung',
      avatar: avatarTrung,
      email: 'tqtrung@vku.udn.vn',
      role: 'MODERATOR',
      roleClass: 'role-moderator',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdDate: '12/09/2023',
      isLocked: false,
    },
    {
      id: 4,
      code: '23IT.EB017',
      name: 'Lê Thị Bích',
      avatar: avatarBich,
      email: 'ltbich@vku.udn.vn',
      role: 'STUDENT',
      roleClass: 'role-student',
      status: 'locked',
      statusLabel: 'Đã khóa',
      createdDate: '20/09/2023',
      isLocked: true,
    },
    {
      id: 5,
      code: null,
      name: 'Phạm Minh Đức',
      avatar: avatarDuc,
      email: 'admin@vku.udn.vn',
      role: 'ADMIN',
      roleClass: 'role-admin',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdDate: '01/08/2023',
      isLocked: false,
    },
  ]

  return (
    <div className="a02-page-wrapper">
      {/* ---------------- Top Header ---------------- */}
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
      <div className="a02-body">
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
        <main className="a02-main">
          {/* Welcome Banner Card */}
          <section className="a01-banner-card">
            <div className="a01-banner-text">
              <h1 className="a01-banner-title">
                <Users size={22} className="banner-users-icon" />
                <span>Quản lý người dùng</span>
              </h1>
              <p className="a01-banner-subtitle">
                Quản lý tài khoản, phân quyền và trạng thái hoạt động của người
                dùng trong hệ thống.
              </p>
            </div>
            <img
              src={bannerMascot}
              alt="Mascot Miu & Thư viện"
              className="a01-banner-img"
            />
          </section>

          {/* 4 Stat Cards Row */}
          <section className="a02-stats-row">
            {statCards.map((card) => {
              const Icon = card.Icon
              return (
                <div key={card.id} className="a01-stat-card">
                  <div className={`a01-stat-icon-wrapper ${card.iconClass}`}>
                    <Icon size={22} />
                  </div>
                  <div className="a01-stat-info">
                    <span className="a01-stat-value">{card.value}</span>
                    <span className="a01-stat-label">
                      {card.label}
                      {card.sub && (
                        <span className="a02-stat-sub">{card.sub}</span>
                      )}
                    </span>
                  </div>
                </div>
              )
            })}
          </section>

          {/* 2 Column Main Section */}
          <div className="a02-content-grid">
            {/* Left Panel: Filter & Data Table */}
            <div className="a02-left-panel">
              {/* Filter Bar */}
              <div className="a02-filter-bar">
                <div className="a02-search-box">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Tìm theo mã SV, họ tên, email..."
                  />
                </div>

                <button type="button" className="a02-dropdown-btn">
                  <Filter size={14} />
                  <span>Tất cả vai trò</span>
                  <ChevronDown size={14} />
                </button>

                <button type="button" className="a02-dropdown-btn">
                  <Activity size={14} />
                  <span>Tất cả trạng thái</span>
                  <ChevronDown size={14} />
                </button>

                <button
                  type="button"
                  className="a02-refresh-btn"
                  title="Làm mới"
                >
                  <RotateCw size={15} />
                </button>
              </div>

              {/* Data Table */}
              <table className="a02-table">
                <thead>
                  <tr>
                    <th style={{ width: '24px' }}>#</th>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th style={{ width: '90px' }}>Vai trò</th>
                    <th style={{ width: '100px' }}>Trạng thái</th>
                    <th style={{ width: '85px' }}>Ngày tạo</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        backgroundColor:
                          selectedUser === user.code ? '#FAF8F5' : 'transparent',
                      }}
                      onClick={() => user.code && setSelectedUser(user.code)}
                    >
                      <td style={{ color: '#7B8B82' }}>{user.id}</td>
                      <td>
                        <div className="a02-user-cell">
                          <img
                            src={user.avatar}
                            alt=""
                            className="a02-user-avatar"
                          />
                          <div className="a02-user-names">
                            <span className="a02-name-txt">{user.name}</span>
                            {user.code && (
                              <span className="a02-id-txt">{user.code}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="a02-email-txt">{user.email}</td>
                      <td>
                        <span className={`a02-role-pill ${user.roleClass}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`a02-status-txt ${
                            user.status === 'active'
                              ? 'status-active-txt'
                              : 'status-locked-txt'
                          }`}
                        >
                          <span
                            className={
                              user.status === 'active'
                                ? 'a02-status-dot-green'
                                : 'a02-status-dot-red'
                            }
                          />
                          <span>{user.statusLabel}</span>
                        </span>
                      </td>
                      <td className="a02-date-txt">{user.createdDate}</td>
                      <td>
                        <div className="a02-actions-cell">
                          <button
                            type="button"
                            className="a02-action-btn"
                            title="Sửa"
                          >
                            <Pencil size={14} />
                          </button>
                          {user.isLocked ? (
                            <button
                              type="button"
                              className="a02-action-btn a02-action-unlock"
                              title="Mở khóa"
                            >
                              <Unlock size={14} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="a02-action-btn"
                              title="Khóa"
                            >
                              <Lock size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="a02-action-btn"
                            title="Thao tác khác"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Bar */}
              <div className="a02-pagination-bar">
                <span>Hiển thị 1 – 5 trong 1.248 người dùng</span>

                <div className="a02-pagination-controls">
                  <button type="button" className="a02-page-btn">
                    <ChevronLeft size={13} />
                  </button>
                  <button type="button" className="a02-page-btn active">
                    1
                  </button>
                  <button type="button" className="a02-page-btn">
                    2
                  </button>
                  <button type="button" className="a02-page-btn">
                    3
                  </button>
                  <button type="button" className="a02-page-btn">
                    4
                  </button>
                  <button type="button" className="a02-page-btn">
                    5
                  </button>
                  <span className="a02-page-ellipsis">...</span>
                  <button type="button" className="a02-page-btn">
                    250
                  </button>
                  <button type="button" className="a02-page-btn">
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="a02-page-rows-select">
                  <span>Số dòng:</span>
                  <select defaultValue="5">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Panel: User Details & Actions */}
            <div className="a02-right-panel">
              {/* Card 1: User Info */}
              <div className="a02-detail-card">
                <div className="a02-card-sec-title">
                  <ClipboardList size={16} />
                  <span>Thông tin người dùng</span>
                </div>

                <div className="a02-detail-profile-center">
                  <img
                    src={avatarDetailChien}
                    alt=""
                    className="a02-detail-avatar-lg"
                  />
                  <span className="a02-detail-name">Doãn Văn Chiến</span>
                  <span className="a02-detail-status-pill">
                    <span className="a02-status-dot-green" />
                    <span>Hoạt động</span>
                  </span>
                </div>

                <div className="a02-detail-fields">
                  <div className="a02-field-row">
                    <span className="a02-field-label">
                      <User size={13} />
                      <span>Mã sinh viên:</span>
                    </span>
                    <span className="a02-field-value">23IT.EB013</span>
                  </div>

                  <div className="a02-field-row">
                    <span className="a02-field-label">
                      <Mail size={13} />
                      <span>Email:</span>
                    </span>
                    <span className="a02-field-value">
                      dvchien@vku.udn.vn
                    </span>
                  </div>

                  <div className="a02-field-row">
                    <span className="a02-field-label">
                      <User size={13} />
                      <span>Vai trò:</span>
                    </span>
                    <button type="button" className="a02-role-select-pill">
                      <span>STUDENT</span>
                      <ChevronDown size={13} />
                    </button>
                  </div>

                  <div className="a02-field-row">
                    <span className="a02-field-label">
                      <Calendar size={13} />
                      <span>Ngày tạo:</span>
                    </span>
                    <span className="a02-field-value">
                      01/09/2023 &nbsp;14:20
                    </span>
                  </div>

                  <div className="a02-field-row">
                    <span className="a02-field-label">
                      <Clock size={13} />
                      <span>Cập nhật lần cuối:</span>
                    </span>
                    <span className="a02-field-value">
                      10/11/2026 &nbsp;09:24
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Administrative Actions */}
              <div className="a02-detail-card">
                <div className="a02-card-sec-title">
                  <ShieldCheck size={16} />
                  <span>Thao tác quản trị</span>
                </div>

                <div className="a02-admin-actions-grid">
                  <button type="button" className="a02-admin-btn admin-btn-role">
                    <UserCheck size={18} />
                    <span>Cập nhật vai trò</span>
                  </button>

                  <button type="button" className="a02-admin-btn admin-btn-lock">
                    <Lock size={18} />
                    <span>Khóa tài khoản</span>
                  </button>

                  <button
                    type="button"
                    className="a02-admin-btn admin-btn-delete"
                  >
                    <Trash2 size={18} />
                    <span>Xóa tài khoản</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Notice */}
              <div className="a02-notice-card">
                <div className="a02-notice-title">
                  <InfoIcon size={15} />
                  <span>Lưu ý</span>
                </div>
                <div className="a02-notice-list">
                  <p>
                    • Khóa tài khoản: Tạm ngưng quyền truy cập hệ thống.
                  </p>
                  <p>
                    • Xóa tài khoản: Xóa vĩnh viễn và không thể khôi phục.
                  </p>
                  <p>
                    • Thay đổi vai trò cần phù hợp với phân quyền hệ thống.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

