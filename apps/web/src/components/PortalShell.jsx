import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Home,
  Search,
  PlusCircle,
  Bell,
  Crown,
  ChevronDown,
  Users,
  Layers,
  FileText,
  ShieldCheck,
  LogOut,
  Send,
  PackageCheck,
  User,
  Lock,
} from 'lucide-react'
import PublicHeader from './PublicHeader'
import { useAuth } from '../contexts/useAuth'
import logoSrc from '../assets/svg/logo/school-lost-found-logo.svg'
import adminAvatar from '../assets/dashboard/admin-avatar.png'

const ADMIN_MENU = [
  { id: 'overview', label: 'Tổng quan', icon: Home, path: '/admin' },
  { id: 'users', label: 'Quản lý người dùng', icon: Users, path: '/admin/users' },
  { id: 'categories', label: 'Quản lý danh mục', icon: Layers, path: '/admin/categories' },
  { id: 'review', label: 'Kiểm duyệt tin đăng', icon: FileText, path: '/staff/review' },
  { id: 'claims', label: 'Quản lý yêu cầu & bàn giao', icon: Send, path: '/staff/claims' },
  { id: 'audit', label: 'Nhật ký hoạt động', icon: ShieldCheck, path: '/admin/audit' },
]

const STAFF_MENU = [
  { id: 'overview', label: 'Tổng quan', icon: Home, path: '/staff' },
  { id: 'review', label: 'Kiểm duyệt tin', icon: FileText, path: '/staff/review' },
  { id: 'claims', label: 'Quản lý yêu cầu nhận đồ', icon: Send, path: '/staff/claims' },
  { id: 'handover', label: 'Xác nhận bàn giao', icon: PackageCheck, path: '/staff/handover' },
  { id: 'search', label: 'Tra cứu & tìm kiếm', icon: Search, path: '/search' },
]

export default function PortalShell({
  portal = 'staff',
  activeMenu = 'overview',
  wrapperClass = 'a01-dashboard-wrapper',
  bodyClass = 'a01-body',
  pendingCount = 0,
  children,
}) {
  const { currentUser, isAuthenticated, loadingAuth, logout } = useAuth()
  const navigate = useNavigate()
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loadingAuth) {
    return (
      <div className={wrapperClass}>
        <PublicHeader />
        <div style={{ maxWidth: 560, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 16, textAlign: 'center', border: '1px solid #E8E2D5' }}>
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    )
  }

  const hasAccess =
    isAuthenticated &&
    (portal === 'admin'
      ? currentUser.role === 'ADMIN'
      : ['ADMIN', 'MODERATOR'].includes(currentUser.role))

  if (!hasAccess) {
    return (
      <div className={wrapperClass}>
        <PublicHeader />
        <div
          style={{
            maxWidth: 540,
            margin: '56px auto',
            padding: 36,
            background: '#FFFFFF',
            borderRadius: 18,
            border: '1px solid #E8E2D5',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#34443B' }}>
            {!isAuthenticated ? 'Vui lòng đăng nhập để tiếp tục' : 'Bạn không có quyền truy cập khu vực này'}
          </h2>
          <p style={{ fontSize: 14, color: '#67786F' }}>
            {!isAuthenticated
              ? 'Cổng quản trị và kiểm duyệt yêu cầu tài khoản Cán bộ (MODERATOR) hoặc Quản trị viên (ADMIN).'
              : portal === 'admin'
                ? `Tài khoản hiện tại có vai trò ${currentUser.role}, chỉ ADMIN mới truy cập được cổng Quản trị.`
                : `Tài khoản hiện tại có vai trò ${currentUser.role}, không thể truy cập cổng Kiểm duyệt.`}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {!isAuthenticated ? (
              <Link to="/login" className="slf-btn-primary">
                Đăng nhập ngay
              </Link>
            ) : currentUser.role === 'MODERATOR' && portal === 'admin' ? (
              <Link to="/staff" className="slf-btn-primary">
                Chuyển sang cổng Cán bộ hỗ trợ
              </Link>
            ) : null}
            <Link to="/" className="slf-btn-secondary">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isAdminPortal = portal === 'admin'
  const menuItems = isAdminPortal ? ADMIN_MENU : STAFF_MENU

  return (
    <div className={wrapperClass}>
      <header className="a01-header">
        <div className="a01-header-left">
          <Link to="/" className="a01-logo">
            <img src={logoSrc} alt="School Lost & Found" />
          </Link>
        </div>

        <nav className="a01-header-nav">
          <Link to="/" className="a01-nav-link">
            <Home size={15} />
            <span>Trang chủ</span>
          </Link>
          <Link to="/search" className="a01-nav-link">
            <Search size={15} />
            <span>Tìm đồ</span>
          </Link>
          <Link to="/items/new" className="a01-nav-link">
            <PlusCircle size={15} />
            <span>Đăng tin</span>
          </Link>
          <Link to="/my-claims" className="a01-nav-link">
            <Send size={15} />
            <span>Yêu cầu của tôi</span>
          </Link>
        </nav>

        <div className="a01-header-right">
          <Link to="/staff/claims" className="a01-bell-btn" aria-label="Xem yêu cầu chờ xử lý">
            <Bell size={18} />
            {pendingCount > 0 && <span className="a01-bell-badge">{pendingCount}</span>}
          </Link>

          <div className="a01-role-dropdown-container">
            <button
              type="button"
              className={isAdminPortal ? 'a01-admin-role-pill' : 'm01-staff-role-pill'}
              onClick={() => setRoleMenuOpen((prev) => !prev)}
            >
              {isAdminPortal ? (
                <Crown size={14} className="crown-icon" />
              ) : (
                <span className="role-user-circle">
                  <User size={13} />
                </span>
              )}
              <span>{isAdminPortal ? 'Quản trị viên' : 'Cán bộ hỗ trợ'}</span>
              <ChevronDown size={13} />
            </button>

            {roleMenuOpen && (
              <div className="a01-role-menu">
                {currentUser.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`a01-role-menu-item ${isAdminPortal ? 'active' : ''}`}
                    onClick={() => setRoleMenuOpen(false)}
                  >
                    <Crown size={14} color="#D48806" />
                    <span>Quản trị viên (Admin)</span>
                  </Link>
                )}
                <Link
                  to="/staff"
                  className={`a01-role-menu-item ${!isAdminPortal ? 'active' : ''}`}
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <User size={14} color="#2E7D32" />
                  <span>Cán bộ hỗ trợ (Staff)</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={bodyClass}>
        <aside className="a01-sidebar">
          <div className="a01-user-card">
            <img src={adminAvatar} alt={currentUser.fullName} className="a01-avatar-img" />
            <div className="a01-user-info">
              <span className="a01-user-name">{currentUser.fullName}</span>
              <span
                className="a01-user-badge"
                style={
                  isAdminPortal
                    ? undefined
                    : { backgroundColor: '#E8F5E9', color: '#2E7D32' }
                }
              >
                {currentUser.role}
              </span>
            </div>
          </div>

          <nav className="a01-sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeMenu === item.id
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`a01-menu-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="a01-sidebar-bottom">
            <button type="button" className="a01-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {children}
      </div>
    </div>
  )
}
