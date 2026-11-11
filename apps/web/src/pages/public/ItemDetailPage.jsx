import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  MapPin, Calendar, Tag, ArrowRight,
  Send, ShieldCheck, Flag, Sparkles, Bookmark,
  Package, User, Edit3, CheckCircle, AlertCircle,
} from 'lucide-react'
import PublicHeader from '../../components/PublicHeader'
import { useAuth } from '../../contexts/useAuth'
import { itemService } from '../../services/itemService'
import { getItemThumbnail, formatShortDate } from '../../utils/itemImageHelper'
import claimBoxMascot from '../../assets/detail/claim-box-mascot.png'
import './Home.css'
import './ExploreItems.css'
import './ItemDetail.css'

export default function ItemDetailPage() {
  const { id } = useParams()
  const itemId = id || '1'
  const { currentUser, isAuthenticated } = useAuth()

  const [item, setItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    itemService
      .getItemById(itemId)
      .then((data) => {
        if (!cancelled) {
          setItem(data)
          setEditTitle(data.title)
          setEditLocation(data.approximateLocation)
          setEditDesc(data.description)
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setItem(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    itemService
      .getItems()
      .then((list) => {
        if (!cancelled) {
          setRelatedItems(list.filter((i) => String(i.id) !== String(itemId)).slice(0, 4))
        }
      })
      .catch(() => {
        if (!cancelled) setRelatedItems([])
      })

    return () => {
      cancelled = true
    }
  }, [itemId])

  const isOwner = isAuthenticated && item && Number(currentUser.id) === Number(item.userId)

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setActionMsg('')
    try {
      const updated = await itemService.updateItem(item.id, {
        title: editTitle,
        approximateLocation: editLocation,
        description: editDesc,
      })
      setItem(updated)
      setEditing(false)
      setActionMsg('✅ Cập nhật tin thành công!')
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleResolve = async () => {
    setSaving(true)
    setActionMsg('')
    try {
      const updated = await itemService.resolveItem(item.id)
      setItem(updated)
      setActionMsg('✅ Đã đánh dấu tin là ĐÃ TÌM THẤY (RESOLVED)!')
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p03-page-wrapper">
      <PublicHeader />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="p03-main">
        <Link to="/search" className="p03-back-link">
          ← Quay lại danh sách
        </Link>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', background: '#fff', borderRadius: 16 }}>
            Đang tải chi tiết tin từ Supabase...
          </div>
        ) : error ? (
          <div
            style={{
              padding: 36,
              textAlign: 'center',
              background: '#FEF2F2',
              borderRadius: 16,
              border: '1px solid #FECACA',
              color: '#B91C1C',
            }}
          >
            <AlertCircle size={32} style={{ marginBottom: 8 }} />
            <h3 style={{ margin: '0 0 6px' }}>Không thể hiển thị tin đăng</h3>
            <p style={{ margin: '0 0 16px', fontSize: 14 }}>{error}</p>
            <Link to="/search" style={{ color: '#2E7D32', fontWeight: 700 }}>
              Quay lại trang tìm kiếm
            </Link>
          </div>
        ) : item ? (
          <div className="p03-content-grid">
            {/* Left Card: Item Info & Gallery */}
            <div className="p03-main-card">
              <div className="p03-gallery-col">
                <div className="p03-main-photo-wrap">
                  <img src={getItemThumbnail(item)} alt={item.title} className="p03-main-photo" />
                </div>
              </div>

              <div className="p03-info-col">
                <div className="p03-badges-row">
                  <span className={item.itemType === 'FOUND' ? 'p03-badge-found-solid' : 'm01-type-badge m01-type-lost'}>
                    {item.itemType === 'FOUND' ? 'Nhặt được (FOUND)' : 'Báo mất (LOST)'}
                  </span>
                  <span className="p03-badge-open">{item.businessStatus}</span>
                  {item.publicationStatus === 'HIDDEN' && (
                    <span style={{ padding: '4px 10px', borderRadius: 999, background: '#374151', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                      ĐANG BỊ ẨN (HIDDEN)
                    </span>
                  )}
                </div>

                {actionMsg && (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #CBD5E1', fontSize: 13, marginBottom: 10 }}>
                    {actionMsg}
                  </div>
                )}

                {!editing ? (
                  <>
                    <h1 className="p03-item-title">{item.title}</h1>

                    <div className="p03-meta-list">
                      <div className="p03-meta-row">
                        <Calendar size={14} />
                        <span>
                          <span className="p03-meta-bold-label">Thời gian xảy ra:</span>{' '}
                          {new Date(item.occurredAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div className="p03-meta-row">
                        <MapPin size={14} />
                        <span>
                          <span className="p03-meta-bold-label">Khu vực:</span> {item.approximateLocation}
                        </span>
                      </div>
                      <div className="p03-meta-row">
                        <Tag size={14} />
                        <span>
                          <span className="p03-meta-bold-label">Danh mục:</span> {item.category?.name}
                        </span>
                      </div>
                    </div>

                    <div className="p03-desc-block">
                      <span className="p03-desc-title">Mô tả chi tiết</span>
                      <p className="p03-desc-text">{item.description}</p>
                    </div>

                    {isOwner && item.businessStatus === 'OPEN' && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 14px',
                            borderRadius: 10,
                            border: '1px solid #2563EB',
                            background: '#EFF6FF',
                            color: '#1D4ED8',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Sửa tin của tôi</span>
                        </button>

                        {item.itemType === 'LOST' && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={handleResolve}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '8px 14px',
                              borderRadius: 10,
                              border: 'none',
                              background: '#16A34A',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle size={14} />
                            <span>Đánh dấu đã tìm thấy</span>
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Tiêu đề</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Khu vực</label>
                      <input
                        type="text"
                        required
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Mô tả</label>
                      <textarea
                        rows={3}
                        required
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="submit"
                        disabled={saving}
                        style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2E7D32', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#fff', cursor: 'pointer' }}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}

                <div className="p03-custody-card">
                  <div className="p03-custody-left">
                    <div className="p03-custody-icon">
                      <Package size={18} />
                    </div>
                    <div className="p03-custody-text">
                      <span className="p03-custody-title">Trạng thái xử lý</span>
                      <span className="p03-custody-val">
                        {item.businessStatus === 'OPEN'
                          ? 'Đang mở — Chờ đối chiếu / bàn giao'
                          : `Đã cập nhật trạng thái: ${item.businessStatus}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="p03-side-col">
              <div className="p03-cta-card">
                <img src={claimBoxMascot} alt="" className="p03-cta-mascot-img" />
                <h3 className="p03-cta-title">Bạn là chủ nhân của món đồ?</h3>
                <p className="p03-cta-desc">
                  Tính năng gửi yêu cầu nhận đồ kèm bằng chứng riêng sẽ được mở ở API Đợt 2 (LF-12).
                </p>
                <button
                  type="button"
                  className="p03-btn-send-claim"
                  onClick={() => alert('Chức năng Gửi Claim bảo mật Proof đang được hoàn thiện ở Đợt 2 (LF-12)!')}
                >
                  <Send size={14} />
                  <span>Gửi yêu cầu nhận đồ</span>
                </button>
              </div>

              <div className="p03-poster-card">
                <span className="p03-card-heading">Thông tin người đăng</span>
                <div className="p03-poster-body">
                  <div className="p03-poster-avatar-circle">
                    <User size={20} />
                  </div>
                  <div className="p03-poster-text">
                    <span className="p03-poster-name">{item.author?.fullName || 'Sinh viên VKU'}</span>
                    <span className="p03-poster-joined">
                      <ShieldCheck size={12} color="#7B8B82" />
                      <span>MSSV: {item.author?.studentId || 'Ẩn'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <a href="#report" className="p03-report-card" onClick={(e) => e.preventDefault()}>
                <Flag size={14} />
                <span>Báo cáo vi phạm</span>
              </a>
            </div>
          </div>
        ) : null}

        {/* ---------------- Bottom: Related Items ---------------- */}
        {relatedItems.length > 0 && (
          <section className="p03-related-section">
            <div className="p03-related-header">
              <div className="p03-related-title">
                <Sparkles size={16} />
                <span>Các tin khác</span>
              </div>
              <Link to="/search" className="p01-latest-view-all">
                <span>Xem tất cả</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="p02-cards-grid">
              {relatedItems.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/items/${rel.id}`}
                  className="p02-item-card"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="p01-card-top-row">
                    <span className={`m01-type-badge ${rel.itemType === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                      {rel.itemType}
                    </span>
                    <button
                      type="button"
                      className="p01-card-bookmark-btn"
                      aria-label="Lưu tin"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <Bookmark size={15} />
                    </button>
                  </div>

                  <div className="p02-card-img-box">
                    <img src={getItemThumbnail(rel)} alt={rel.title} />
                  </div>

                  <h3 className="p02-card-item-title">{rel.title}</h3>

                  <div className="p02-card-meta-box">
                    <div className="p02-card-meta-line">
                      <MapPin size={11} />
                      <span>{rel.approximateLocation}</span>
                    </div>
                    <div className="p02-card-meta-line">
                      <Calendar size={11} />
                      <span>{formatShortDate(rel.occurredAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
