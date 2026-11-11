import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PlusCircle, AlertCircle, Lock } from 'lucide-react'
import PublicHeader from '../../components/PublicHeader'
import { useAuth } from '../../contexts/useAuth'
import { itemService } from '../../services/itemService'
import './Home.css'

export default function CreateItemPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated, loadingAuth } = useAuth()

  const defaultType = searchParams.get('type') === 'FOUND' ? 'FOUND' : 'LOST'

  const [categories, setCategories] = useState([])
  const [itemType, setItemType] = useState(defaultType)
  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [approximateLocation, setApproximateLocation] = useState('')
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    itemService
      .getCategories()
      .then((cats) => {
        setCategories(cats)
        if (cats.length > 0) {
          setCategoryId(String(cats[0].id))
        }
      })
      .catch((err) => setError(err.message))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const created = await itemService.createItem({
        itemType,
        categoryId: Number(categoryId),
        title,
        description,
        approximateLocation,
        occurredAt: new Date(occurredAt).toISOString(),
      })
      navigate(`/items/${created.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p01-home-wrapper">
      <PublicHeader />

      <main style={{ maxWidth: 640, margin: '28px auto', padding: '0 16px' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 10px 30px rgba(31, 61, 43, 0.08)',
            border: '1px solid #E5ECE7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <PlusCircle size={22} color="#2E7D32" />
            <h1 style={{ margin: 0, fontSize: 21, color: '#1F3D2B' }}>Đăng tin Báo mất / Nhặt được đồ</h1>
          </div>

          {!loadingAuth && !isAuthenticated ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 16px',
                background: '#F8FAFC',
                borderRadius: 14,
                border: '1px dashed #CBD5E1',
              }}
            >
              <Lock size={32} color="#64748B" style={{ marginBottom: 8 }} />
              <h3 style={{ margin: '0 0 6px', color: '#1E293B' }}>Bạn cần đăng nhập để đăng tin</h3>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B' }}>
                Hệ thống yêu cầu xác thực tài khoản sinh viên để lưu thông tin người đăng bài.
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '9px 20px',
                  borderRadius: 10,
                  background: '#2E7D32',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: 'none',
                }}
              >
                Đi tới trang Đăng nhập
              </Link>
            </div>
          ) : (
            <>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                      Loại tin *
                    </label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                    >
                      <option value="LOST">LOST (Tôi bị mất đồ)</option>
                      <option value="FOUND">FOUND (Tôi nhặt được đồ)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                      Danh mục tài sản *
                    </label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                    Tiêu đề tin đăng *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Nhặt được thẻ sinh viên tại thư viện tầng 2"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                    Mô tả công khai *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả màu sắc, đặc điểm chung (tránh ghi thông tin bí mật để đối chiếu)..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                      Khu vực mất / nhặt được *
                    </label>
                    <input
                      type="text"
                      required
                      value={approximateLocation}
                      onChange={(e) => setApproximateLocation(e.target.value)}
                      placeholder="VD: Giảng đường V - Phòng V.201"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: '#374151' }}>
                      Thời gian xảy ra *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={occurredAt}
                      onChange={(e) => setOccurredAt(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '11px 16px',
                      borderRadius: 10,
                      border: 'none',
                      background: '#2E7D32',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? 'Đang lưu lên Supabase...' : 'Đăng tin ngay'}
                  </button>
                  <Link
                    to="/search"
                    style={{
                      padding: '11px 18px',
                      borderRadius: 10,
                      border: '1px solid #CBD5E1',
                      color: '#475569',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Hủy
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
