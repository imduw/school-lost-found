import { Link, useLocation, useNavigate } from 'react-router'
import { Home, Search, PlusCircle, Shield, LogOut, Send } from 'lucide-react'
import logoSrc from '../assets/svg/logo/school-lost-found-logo.svg'
import { useAuth } from '../contexts/useAuth'

const ROLE_LABELS = {
  ADMIN: { text: 'ADMIN', bg: '#FEE2E2', color: '#991B1B' },
  MODERATOR: { text: 'MOD', bg: '#FEF3C7', color: '#92400E' },
  USER: { text: 'USER', bg: '#DBEAFE', color: '#1E40AF' },
}

export default function PublicHeader() {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const roleBadge = ROLE_LABELS[currentUser?.role] || null
  const isHome = location.pathname === '/'
  const isSearch = location.pathname.startsWith('/search') || location.pathname === '/items'
  const isCreate = location.pathname === '/items/new'
  const isMyClaims = location.pathname === '/my-claims'

  return (
    <header className="p01-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoSrc} alt="School Lost & Found" style={{ height: 36 }} />
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/" className={isHome ? 'p01-header-nav-pill' : 'a01-nav-link'}>
            <Home size={15} />
            <span>Trang chủ</span>
          </Link>
          <Link to="/search" className={isSearch ? 'p01-header-nav-pill' : 'a01-nav-link'}>
            <Search size={15} />
            <span>Tìm đồ</span>
          </Link>
          <Link to="/items/new" className={isCreate ? 'p01-header-nav-pill' : 'a01-nav-link'}>
            <PlusCircle size={15} />
            <span>Đăng tin</span>
          </Link>
          {isAuthenticated && (
            <Link to="/my-claims" className={isMyClaims ? 'p01-header-nav-pill' : 'a01-nav-link'}>
              <Send size={15} />
              <span>Yêu cầu của tôi</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="p01-header-right" style={{ gap: 10 }}>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="p01-btn-login">Đăng nhập</Link>
            <Link to="/register" className="p01-btn-register">Đăng ký</Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {(currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
              <Link
                to={currentUser.role === 'ADMIN' ? '/admin' : '/staff'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#FEF3C7',
                  color: '#92400E',
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid #F59E0B',
                }}
              >
                <Shield size={13} />
                <span>{currentUser.role === 'ADMIN' ? 'Trang Admin' : 'Kiểm duyệt'}</span>
              </Link>
            )}

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                background: '#F4F7F5',
                borderRadius: 999,
                border: '1px solid #DCE6DF',
                fontSize: 13,
              }}
            >
              <span style={{ fontWeight: 600, color: '#1F2937' }}>{currentUser.fullName}</span>
              {roleBadge && (
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 800,
                    background: roleBadge.bg,
                    color: roleBadge.color,
                  }}
                >
                  {roleBadge.text}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '7px 12px',
                borderRadius: 999,
                border: '1px solid #FCA5A5',
                background: '#FEF2F2',
                color: '#B91C1C',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <LogOut size={13} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
