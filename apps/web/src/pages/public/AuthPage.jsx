import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { LogIn, UserPlus, AlertCircle, KeyRound } from 'lucide-react'
import PublicHeader from '../../components/PublicHeader'
import { useAuth } from '../../contexts/useAuth'
import './Home.css'

const QUICK_ACCOUNTS = [
  { label: 'Chiến (ADMIN)', email: 'vanchien@vku.udn.vn', role: 'ADMIN' },
  { label: 'Hải (ADMIN)', email: 'xuanhai@vku.udn.vn', role: 'ADMIN' },
  { label: 'Đức (MOD)', email: 'minhduc@vku.udn.vn', role: 'MODERATOR' },
  { label: 'Trang (USER)', email: 'thitrang@vku.udn.vn', role: 'USER' },
  { label: 'Nam Sơn (USER)', email: 'namson@vku.udn.vn', role: 'USER' },
]

export default function AuthPage({ defaultMode = 'login' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const isRegister = location.pathname === '/register' || defaultMode === 'register'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isRegister) {
        await register({ fullName, email, password, studentId, phone })
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickFill = (accEmail) => {
    setEmail(accEmail)
    setPassword('Test@123456')
    setError('')
  }

  return (
    <div className="p01-home-wrapper">
      <PublicHeader />

      <main style={{ maxWidth: 460, margin: '36px auto', padding: '0 16px' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 10px 30px rgba(31, 61, 43, 0.08)',
            border: '1px solid #E5ECE7',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: '#E8F5E9',
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              {isRegister ? <UserPlus size={22} /> : <LogIn size={22} />}
            </div>
            <h1 style={{ margin: 0, fontSize: 22, color: '#1F3D2B' }}>
              {isRegister ? 'Đăng ký tài khoản mới' : 'Đăng nhập hệ thống'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748B' }}>
              {isRegister
                ? 'Tài khoản sinh viên mới sẽ được mặc định gán quyền USER'
                : 'Kết nối trực tiếp tới Backend API & Supabase PostgreSQL'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 18, background: '#F3F7F4', padding: 4, borderRadius: 12 }}>
            <Link
              to="/login"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '8px 12px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                background: !isRegister ? '#FFFFFF' : 'transparent',
                color: !isRegister ? '#2E7D32' : '#64748B',
                boxShadow: !isRegister ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '8px 12px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                background: isRegister ? '#FFFFFF' : 'transparent',
                color: isRegister ? '#2E7D32' : '#64748B',
                boxShadow: isRegister ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Đăng ký
            </Link>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 10,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                Email trường học *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@vku.udn.vn"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                Mật khẩu *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
              />
            </div>

            {isRegister && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                    Mã sinh viên
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="23IT001"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0905123456"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: 4,
                padding: '11px 16px',
                borderRadius: 10,
                border: 'none',
                background: '#2E7D32',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Đang xử lý...' : isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
            </button>
          </form>

          {!isRegister && (
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px dashed #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569', marginBottom: 8, fontWeight: 600 }}>
                <KeyRound size={14} />
                <span>Điền nhanh tài khoản nhóm để test phân quyền (Pass: Test@123456):</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {QUICK_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickFill(acc.email)}
                    style={{
                      padding: '5px 9px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      color: '#334155',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
