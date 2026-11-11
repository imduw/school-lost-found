import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  Search,
  FileText,
  Calendar,
  MapPin,
  Check,
  EyeOff,
  LayoutGrid,
  Clock,
  ChevronRight,
  User,
  CheckCircle2,
  ClipboardCheck,
  ArrowLeft,
  CircleAlert,
  Eye,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { ImageLightboxDialog, ReasonDialog } from '../../components/ActionDialogs'
import { useAuth } from '../../contexts/useAuth'
import { resolveUploadUrl } from '../../services/apiClient'
import { itemService } from '../../services/itemService'
import { getItemThumbnail, formatDateTime } from '../../utils/itemImageHelper'
import bannerMascot from '../../assets/dashboard/banner-staff-mascot.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'
import './ItemModeration.css'

const PAGE_SIZE = 5

const PUB_BADGE = {
  APPROVED: { text: 'Đã duyệt', bg: '#E8F5E9', color: '#2E7D32' },
  PENDING_REVIEW: { text: 'Chờ kiểm duyệt', bg: '#FFF7E6', color: '#D48806' },
  HIDDEN: { text: 'Đã ẩn', bg: '#F3F4F6', color: '#4B5563' },
  REJECTED: { text: 'Đã từ chối', bg: '#FEE2E2', color: '#991B1B' },
}

export default function ItemModerationPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialItemId = searchParams.get('itemId')
  const initialTab = searchParams.get('tab') || 'all'
  const canAccess = isAuthenticated && ['ADMIN', 'MODERATOR'].includes(currentUser?.role)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedItemId, setSelectedItemId] = useState(initialItemId ? Number(initialItemId) : null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('newest')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [reasonModal, setReasonModal] = useState({ open: false, targetStatus: 'HIDDEN' })
  const [submitting, setSubmitting] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState('')

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    itemService
      .getItems()
      .then((list) => {
        if (!cancelled) {
          setItems(list)
          setSelectedItemId((prev) => {
            if (prev && list.some((i) => i.id === prev)) return prev
            return list[0]?.id ?? null
          })
        }
      })
      .catch((err) => {
        if (!cancelled) setFeedback({ type: 'error', text: err.message })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [canAccess])

  const pendingCount = items.filter((i) => i.publicationStatus === 'PENDING_REVIEW').length
  const approvedCount = items.filter((i) => i.publicationStatus === 'APPROVED').length
  const hiddenCount = items.filter((i) => ['HIDDEN', 'REJECTED'].includes(i.publicationStatus)).length

  const filteredItems = items
    .filter((item) => {
      if (activeTab === 'pending' && item.publicationStatus !== 'PENDING_REVIEW') return false
      if (activeTab === 'approved' && item.publicationStatus !== 'APPROVED') return false
      if (activeTab === 'hidden' && !['HIDDEN', 'REJECTED'].includes(item.publicationStatus)) return false
      if (typeFilter !== 'ALL' && item.itemType !== typeFilter) return false
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase()
        const haystack = `${item.title} ${item.description} ${item.approximateLocation} ${item.author?.fullName || ''} ${item.author?.studentId || ''}`.toLowerCase()
        if (!haystack.includes(kw)) return false
      }
      return true
    })
    .sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt)
      return sortOrder === 'newest' ? diff : -diff
    })

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedItems = filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectedItem =
    items.find((i) => i.id === selectedItemId) || pagedItems[0] || filteredItems[0] || null

  const detailImages = selectedItem?.images || []
  const mainDetailImg =
    detailImages.length > 0
      ? resolveUploadUrl(detailImages[Math.min(activeImageIdx, detailImages.length - 1)]?.storageUrl)
      : getItemThumbnail(selectedItem)

  const handleToggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(pagedItems.map((i) => i.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleApproveItem = async () => {
    if (!selectedItem) return
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await itemService.updateItemVisibility(selectedItem.id, {
        publicationStatus: 'APPROVED',
        reason: 'Cán bộ xác nhận hiển thị công khai',
      })
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
      setFeedback({ type: 'success', text: `Đã duyệt / hiển thị tin #${updated.id} (${updated.title}).` })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitVisibilityReason = async (reason) => {
    if (!selectedItem) return
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await itemService.updateItemVisibility(selectedItem.id, {
        publicationStatus: reasonModal.targetStatus,
        reason,
      })
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
      setReasonModal({ open: false, targetStatus: 'HIDDEN' })
      setFeedback({
        type: 'success',
        text: `Đã cập nhật tin #${updated.id} sang trạng thái ${updated.publicationStatus} (giữ nguyên ${updated.businessStatus}).`,
      })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const selectedBadge = PUB_BADGE[selectedItem?.publicationStatus] || PUB_BADGE.APPROVED

  return (
    <PortalShell
      portal="staff"
      activeMenu="review"
      wrapperClass="m02-page-wrapper"
      bodyClass="m02-body"
      pendingCount={pendingCount}
    >
      <main className="m02-main">
        <div className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <ClipboardCheck size={22} className="banner-mod-icon" />
              Kiểm duyệt tin đăng
            </h1>
            <p className="a01-banner-subtitle">
              Xem xét, ẩn/hiện tin vi phạm mà vẫn giữ nguyên trạng thái nghiệp vụ (OPEN/CLOSED) và tự động ghi Audit Log.
            </p>
          </div>
          <img src={bannerMascot} alt="" className="a01-banner-img" />
        </div>

        {feedback.text && (
          <div
            role="status"
            aria-live="polite"
            className={`slf-banner-feedback ${feedback.type === 'error' ? 'slf-banner-error' : 'slf-banner-success'}`}
            style={{ marginBottom: 14 }}
          >
            <span>{feedback.text}</span>
          </div>
        )}

        <div className="m02-tabs-row">
          <button
            type="button"
            className={`m02-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pending'); setPage(1) }}
          >
            <Clock size={14} />
            <span>Chờ kiểm duyệt ({pendingCount})</span>
          </button>
          <button
            type="button"
            className={`m02-tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => { setActiveTab('approved'); setPage(1) }}
          >
            <Check size={14} />
            <span>Đã duyệt ({approvedCount})</span>
          </button>
          <button
            type="button"
            className={`m02-tab-btn ${activeTab === 'hidden' ? 'active' : ''}`}
            onClick={() => { setActiveTab('hidden'); setPage(1) }}
          >
            <EyeOff size={14} />
            <span>Đã ẩn / Từ chối ({hiddenCount})</span>
          </button>
          <button
            type="button"
            className={`m02-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all'); setPage(1) }}
          >
            <LayoutGrid size={14} />
            <span>Tất cả ({items.length})</span>
          </button>
        </div>

        <div className="m02-content-grid">
          <div className="m02-left-panel">
            <search>
              <div className="m02-filter-bar">
                <div className="m02-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input
                    type="search"
                    aria-label="Tìm kiếm tin đăng"
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
                  />
                </div>
                <select
                  aria-label="Lọc theo loại tin"
                  className="m02-dropdown-btn"
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
                >
                  <option value="ALL">Tất cả loại tin</option>
                  <option value="FOUND">FOUND (Nhặt được)</option>
                  <option value="LOST">LOST (Báo mất)</option>
                </select>
                <select
                  aria-label="Sắp xếp tin đăng"
                  className="m02-dropdown-btn"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </search>

            <div className="m02-items-list">
              {loading ? (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 13 }}>Đang tải danh sách tin đăng...</div>
              ) : pagedItems.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: '#67786F' }}>
                  Không có tin đăng nào phù hợp bộ lọc.
                </div>
              ) : (
                pagedItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id
                  const badge = PUB_BADGE[item.publicationStatus] || PUB_BADGE.APPROVED
                  return (
                    <div
                      key={item.id}
                      className={`m02-mod-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedItemId(item.id)
                        setActiveImageIdx(0)
                      }}
                    >
                      <input
                        type="checkbox"
                        className="m02-card-checkbox"
                        checked={selectedIds.includes(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds((prev) => [...prev, item.id])
                          else setSelectedIds((prev) => prev.filter((id) => id !== item.id))
                        }}
                      />
                      <img src={getItemThumbnail(item)} alt={item.title} className="m02-card-thumb" />
                      <div className="m02-card-info">
                        <div className="m02-card-header-row">
                          <span className={`m01-type-badge ${item.itemType === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                            {item.itemType}
                          </span>
                          <span className="m02-card-title">{item.title}</span>
                        </div>
                        <div className="m02-card-meta-row">
                          <div className="m02-meta-tag">
                            <User size={12} />
                            <span>{item.author?.studentId || item.author?.fullName}</span>
                          </div>
                          <div className="m02-meta-tag">
                            <Calendar size={12} />
                            <span>{formatDateTime(item.createdAt)}</span>
                          </div>
                          <div className="m02-meta-tag">
                            <MapPin size={12} />
                            <span>{item.approximateLocation}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className="m02-status-pending-pill"
                        style={{ backgroundColor: badge.bg, color: badge.color }}
                      >
                        {badge.text}
                      </span>
                    </div>
                  )
                })
              )}
            </div>

            <div className="m02-list-footer">
              <label className="m02-select-all">
                <input
                  type="checkbox"
                  className="m02-card-checkbox"
                  checked={pagedItems.length > 0 && pagedItems.every((i) => selectedIds.includes(i.id))}
                  onChange={(e) => handleToggleSelectAll(e.target.checked)}
                />
                <span>Chọn trang này ({selectedIds.length})</span>
              </label>
              <div className="a04-pagination-controls">
                <button
                  type="button"
                  className="a04-page-btn"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`a04-page-btn ${safePage === num ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="a04-page-btn"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div className="m02-right-panel">
            {!selectedItem ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#67786F' }}>
                Chọn một tin đăng ở cột bên trái để xem chi tiết và kiểm duyệt.
              </div>
            ) : (
              <>
                <div className="m02-detail-header">
                  <div className="m02-detail-title">
                    <FileText size={16} />
                    <span>Chi tiết tin đăng #{selectedItem.id}</span>
                  </div>
                  <span
                    className="m02-status-pending-pill"
                    style={{ backgroundColor: selectedBadge.bg, color: selectedBadge.color }}
                  >
                    {selectedBadge.text}
                  </span>
                </div>

                <div className="m02-gallery-wrap">
                  <div className="m02-main-image-box">
                    <img
                      src={mainDetailImg}
                      alt={selectedItem.title}
                      className="m02-main-image"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setLightboxUrl(mainDetailImg)}
                    />
                  </div>
                  {detailImages.length > 0 && (
                    <div className="m02-sub-thumbs-row">
                      {detailImages.map((img, idx) => (
                        <img
                          key={img.id}
                          src={resolveUploadUrl(img.storageUrl)}
                          alt=""
                          className={`m02-sub-thumb ${activeImageIdx === idx ? 'active' : ''}`}
                          onClick={() => setActiveImageIdx(idx)}
                        />
                      ))}
                      {detailImages.length > 1 && (
                        <button
                          type="button"
                          className="m02-thumb-arrow-btn"
                          aria-label="Ảnh tiếp theo"
                          onClick={() => setActiveImageIdx((prev) => (prev + 1) % detailImages.length)}
                        >
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="m02-detail-item-info">
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className={`m01-type-badge ${selectedItem.itemType === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                      {selectedItem.itemType}
                    </span>
                    <span className="p03-badge-open">{selectedItem.businessStatus}</span>
                  </div>
                  <h2 className="m02-detail-heading">{selectedItem.title}</h2>
                  <div className="m02-detail-meta-list">
                    <div className="m02-detail-meta-row">
                      <User size={13} />
                      <span className="m02-meta-label">Người đăng:</span>
                      <span className="m02-meta-val">
                        {selectedItem.author?.fullName} {selectedItem.author?.studentId ? `(${selectedItem.author.studentId})` : ''}
                      </span>
                    </div>
                    <div className="m02-detail-meta-row">
                      <Calendar size={13} />
                      <span className="m02-meta-label">Thời gian:</span>
                      <span className="m02-meta-val">{formatDateTime(selectedItem.occurredAt)}</span>
                    </div>
                    <div className="m02-detail-meta-row">
                      <MapPin size={13} />
                      <span className="m02-meta-label">Khu vực:</span>
                      <span className="m02-meta-val">{selectedItem.approximateLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="m02-desc-section">
                  <div className="m02-sec-title">
                    <FileText size={15} />
                    <span>Mô tả chi tiết</span>
                  </div>
                  <div className="m02-desc-content-box">{selectedItem.description}</div>
                </div>

                <div className="m02-notice-box">
                  <div className="m02-notice-header">
                    <CircleAlert size={14} />
                    <span>Lưu ý khi kiểm duyệt</span>
                  </div>
                  <div className="m02-notice-checklist">
                    <div className="m02-notice-check-item">
                      <CheckCircle2 size={13} />
                      <span>Nội dung tin rõ ràng, không chứa thông tin nhạy cảm cá nhân.</span>
                    </div>
                    <div className="m02-notice-check-item">
                      <CheckCircle2 size={13} />
                      <span>Ẩn tin sẽ giữ nguyên trạng thái OPEN/CLOSED và ghi nhận vào Audit Log.</span>
                    </div>
                  </div>
                </div>

                <div className="m02-detail-actions">
                  <button type="button" className="m02-btn-back" onClick={() => navigate(`/items/${selectedItem.id}`)}>
                    <Eye size={13} />
                    <span>Xem trang tin</span>
                  </button>
                  <button
                    type="button"
                    className="m02-btn-back"
                    onClick={() => navigate('/staff')}
                  >
                    <ArrowLeft size={13} />
                    <span>Tổng quan</span>
                  </button>
                  {selectedItem.publicationStatus !== 'APPROVED' && (
                    <button
                      type="button"
                      disabled={submitting}
                      className="m02-btn-approve-lg"
                      onClick={handleApproveItem}
                    >
                      <Check size={13} />
                      <span>{selectedItem.publicationStatus === 'HIDDEN' ? 'Khôi phục hiển thị' : 'Duyệt tin'}</span>
                    </button>
                  )}
                  {selectedItem.publicationStatus !== 'HIDDEN' && (
                    <button
                      type="button"
                      disabled={submitting}
                      className="m02-btn-hide-lg"
                      onClick={() => setReasonModal({ open: true, targetStatus: 'HIDDEN' })}
                    >
                      <EyeOff size={13} />
                      <span>Ẩn tin (HIDDEN)</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ReasonDialog
        key={`mod-${selectedItem?.id || 'none'}-${reasonModal.targetStatus}`}
        open={reasonModal.open}
        title={`Ẩn tin đăng #${selectedItem?.id || ''}`}
        description="Tin đăng sẽ chuyển sang HIDDEN khỏi người dùng thường nhưng giữ nguyên businessStatus (OPEN/CLOSED)."
        fieldLabel="Lý do ẩn / kiểm duyệt tin"
        confirmLabel="Xác nhận ẩn tin"
        submitting={submitting}
        onClose={() => setReasonModal({ open: false, targetStatus: 'HIDDEN' })}
        onConfirm={handleSubmitVisibilityReason}
      />

      <ImageLightboxDialog
        imageUrl={lightboxUrl}
        title={selectedItem?.title || 'Ảnh tin đăng'}
        onClose={() => setLightboxUrl('')}
      />
    </PortalShell>
  )
}
