import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  Search,
  FileText,
  Send,
  Calendar,
  MapPin,
  Check,
  XCircle,
  LayoutGrid,
  Clock,
  ChevronRight,
  User,
  Eye,
  Maximize2,
  Paperclip,
  ShieldCheck,
  Package,
  ArrowLeft,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { ImageLightboxDialog, ReasonDialog } from '../../components/ActionDialogs'
import { useAuth } from '../../contexts/useAuth'
import { resolveUploadUrl } from '../../services/apiClient'
import { claimService } from '../../services/claimService'
import { getItemThumbnail, formatDateTime } from '../../utils/itemImageHelper'
import bannerMascot from '../../assets/dashboard/banner-staff-mascot.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'
import './ItemModeration.css'
import './ClaimsManagement.css'

const PAGE_SIZE = 5

const CLAIM_STATUS_CLASS = {
  PENDING: 'm03-status-pending',
  ACCEPTED: 'm03-status-accepted',
  REJECTED: 'm03-status-rejected',
  WITHDRAWN: 'm03-status-rejected',
}

export default function ClaimsManagementPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const itemIdFilter = searchParams.get('itemId') || ''
  const initialClaimId = searchParams.get('claimId')
  const initialTab = searchParams.get('tab') || 'pending'
  const canAccess = isAuthenticated && ['ADMIN', 'MODERATOR'].includes(currentUser?.role)

  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedClaimId, setSelectedClaimId] = useState(initialClaimId ? Number(initialClaimId) : null)
  const [keyword, setKeyword] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [rejectOpen, setRejectOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState('')

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    claimService
      .getAllClaims(itemIdFilter ? { itemId: itemIdFilter } : {})
      .then((list) => {
        if (!cancelled) {
          setClaims(list)
          setSelectedClaimId((prev) => {
            if (prev && list.some((c) => c.id === prev)) return prev
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
  }, [canAccess, itemIdFilter])

  const pendingCount = claims.filter((c) => c.status === 'PENDING').length
  const acceptedCount = claims.filter((c) => c.status === 'ACCEPTED').length
  const rejectedCount = claims.filter((c) => c.status === 'REJECTED').length

  const filteredClaims = claims
    .filter((c) => {
      if (activeTab === 'pending' && c.status !== 'PENDING') return false
      if (activeTab === 'accepted' && c.status !== 'ACCEPTED') return false
      if (activeTab === 'rejected' && !['REJECTED', 'WITHDRAWN'].includes(c.status)) return false
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase()
        const hay = `clm-${c.id} ${c.item?.title || ''} ${c.claimant?.fullName || ''} ${c.claimant?.studentId || ''}`.toLowerCase()
        if (!hay.includes(kw)) return false
      }
      return true
    })
    .sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt)
      return sortOrder === 'newest' ? diff : -diff
    })

  const totalPages = Math.max(1, Math.ceil(filteredClaims.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedClaims = filteredClaims.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectedClaim =
    claims.find((c) => c.id === selectedClaimId) || pagedClaims[0] || filteredClaims[0] || null

  const imageProofs = (selectedClaim?.proofs || []).filter((p) => p.proofType === 'ATTACHMENT_URL')
  const textProofs = (selectedClaim?.proofs || []).filter((p) => p.proofType !== 'ATTACHMENT_URL')

  const handleConfirmReject = async (note) => {
    if (!selectedClaim) return
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await claimService.rejectClaim(selectedClaim.id, { note })
      setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      setRejectOpen(false)
      setFeedback({ type: 'success', text: `Đã từ chối yêu cầu #CLM-${updated.id}.` })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PortalShell
      portal="staff"
      activeMenu="claims"
      wrapperClass="m03-page-wrapper"
      bodyClass="m03-body"
      pendingCount={pendingCount}
    >
      <main className="m03-main">
        <div className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <Send size={22} className="banner-claim-icon" />
              Quản lý yêu cầu nhận đồ
            </h1>
            <p className="a01-banner-subtitle">
              Theo dõi, đối chiếu bằng chứng riêng tư (Proof Privacy) và xử lý yêu cầu nhận lại đồ của sinh viên.
            </p>
          </div>
          <img src={bannerMascot} alt="" className="a01-banner-img" />
        </div>

        {itemIdFilter && (
          <div className="slf-banner-feedback" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', marginBottom: 14 }}>
            <span>Đang lọc yêu cầu của riêng Tin #{itemIdFilter}</span>
            <button
              type="button"
              className="slf-btn-secondary"
              style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => {
                setSearchParams({})
                setPage(1)
              }}
            >
              Xem tất cả tin
            </button>
          </div>
        )}

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
            <span>Đang chờ ({pendingCount})</span>
          </button>
          <button
            type="button"
            className={`m02-tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
            onClick={() => { setActiveTab('accepted'); setPage(1) }}
          >
            <Check size={14} />
            <span>Đã chấp nhận ({acceptedCount})</span>
          </button>
          <button
            type="button"
            className={`m02-tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => { setActiveTab('rejected'); setPage(1) }}
          >
            <XCircle size={14} color="#CF1322" />
            <span>Đã từ chối ({rejectedCount})</span>
          </button>
          <button
            type="button"
            className={`m02-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all'); setPage(1) }}
          >
            <LayoutGrid size={14} />
            <span>Tất cả ({claims.length})</span>
          </button>
        </div>

        <div className="m03-content-grid">
          <div className="m03-left-panel">
            <search>
              <div className="m02-filter-bar">
                <div className="m02-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input
                    type="search"
                    aria-label="Tìm kiếm yêu cầu nhận đồ"
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
                  />
                </div>
                <select
                  aria-label="Sắp xếp theo thời gian"
                  className="m02-dropdown-btn"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Thời gian: Mới nhất</option>
                  <option value="oldest">Thời gian: Cũ nhất</option>
                </select>
              </div>
            </search>

            <div className="m02-items-list">
              {loading ? (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 13 }}>Đang tải danh sách yêu cầu...</div>
              ) : pagedClaims.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: '#67786F' }}>
                  Không có yêu cầu nhận đồ nào ở mục này.
                </div>
              ) : (
                pagedClaims.map((claim) => {
                  const isSelected = selectedClaim?.id === claim.id
                  return (
                    <div
                      key={claim.id}
                      className={`m03-claim-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedClaimId(claim.id)}
                    >
                      <input
                        type="checkbox"
                        className="m02-card-checkbox"
                        checked={selectedIds.includes(claim.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds((prev) => [...prev, claim.id])
                          else setSelectedIds((prev) => prev.filter((id) => id !== claim.id))
                        }}
                      />
                      <img src={getItemThumbnail(claim.item)} alt={claim.item?.title || ''} className="m02-card-thumb" />
                      <div className="m03-claim-info">
                        <div className="m03-claim-top-row">
                          <span className="m03-claim-code">CLM-{claim.id}</span>
                          <span className={CLAIM_STATUS_CLASS[claim.status] || 'm03-status-pending'}>
                            {claim.status}
                          </span>
                        </div>
                        <span className="m03-claim-title">{claim.item?.title || `Tin #${claim.itemId}`}</span>
                        <div className="m03-claim-meta-row">
                          <div className="m02-meta-tag">
                            <User size={12} />
                            <span>{claim.claimant?.studentId || claim.claimant?.fullName}</span>
                          </div>
                          <div className="m02-meta-tag">
                            <Calendar size={12} />
                            <span>{formatDateTime(claim.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="m03-btn-view-detail"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedClaimId(claim.id)
                        }}
                      >
                        <Eye size={12} />
                        <span>Xem chi tiết</span>
                        <ChevronRight size={12} />
                      </button>
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
                  checked={pagedClaims.length > 0 && pagedClaims.every((c) => selectedIds.includes(c.id))}
                  onChange={(e) => setSelectedIds(e.target.checked ? pagedClaims.map((c) => c.id) : [])}
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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

          <div className="m03-right-panel">
            {!selectedClaim ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#67786F' }}>
                Chọn một yêu cầu nhận đồ ở danh sách bên trái để đối chiếu bằng chứng.
              </div>
            ) : (
              <>
                <div className="m02-detail-header">
                  <div className="m02-detail-title">
                    <FileText size={16} />
                    <span>Chi tiết yêu cầu nhận đồ</span>
                  </div>
                  <span className={CLAIM_STATUS_CLASS[selectedClaim.status] || 'm02-status-pending-pill'}>
                    {selectedClaim.status}
                  </span>
                </div>

                <div className="m03-section-block">
                  <div className="m03-section-title">
                    <FileText size={15} />
                    <span>Thông tin yêu cầu</span>
                  </div>
                  <div className="m03-info-fields-box">
                    <div className="m03-info-field-row">
                      <User size={13} />
                      <span className="m03-field-name">Mã yêu cầu:</span>
                      <span className="m03-field-val">CLM-{selectedClaim.id}</span>
                    </div>
                    <div className="m03-info-field-row">
                      <User size={13} />
                      <span className="m03-field-name">Người yêu cầu:</span>
                      <span className="m03-field-val">
                        {selectedClaim.claimant?.fullName}{' '}
                        {selectedClaim.claimant?.studentId ? `(${selectedClaim.claimant.studentId})` : ''}
                        {selectedClaim.claimant?.phone ? ` · ${selectedClaim.claimant.phone}` : ''}
                      </span>
                    </div>
                    <div className="m03-info-field-row">
                      <Clock size={13} />
                      <span className="m03-field-name">Thời gian gửi:</span>
                      <span className="m03-field-val">{formatDateTime(selectedClaim.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="m03-section-block">
                  <div className="m03-section-title">
                    <Package size={15} />
                    <span>Tin nhặt được liên quan (FOUND)</span>
                  </div>
                  <div className="m03-linked-item-card">
                    <img src={getItemThumbnail(selectedClaim.item)} alt={selectedClaim.item?.title || ''} className="m03-linked-thumb" />
                    <div className="m03-linked-info">
                      <div className="m03-linked-header">
                        <span className="m01-type-badge m01-type-found">{selectedClaim.item?.itemType || 'FOUND'}</span>
                        <span className="m03-linked-title">{selectedClaim.item?.title}</span>
                      </div>
                      <div className="m03-linked-meta">
                        <div className="m02-meta-tag">
                          <MapPin size={11} />
                          <span>{selectedClaim.item?.approximateLocation || 'Trong khuôn viên'}</span>
                        </div>
                        <div className="m02-meta-tag">
                          <User size={11} />
                          <span>Người đăng: {selectedClaim.item?.authorName || 'Sinh viên VKU'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="m03-btn-view-item"
                      onClick={() => navigate(`/items/${selectedClaim.itemId}`)}
                    >
                      <Eye size={11} />
                      <span>Xem chi tiết tin</span>
                    </button>
                  </div>
                </div>

                <div className="m03-section-block">
                  <div className="m03-section-title">
                    <ShieldCheck size={15} />
                    <span>Bằng chứng đối chiếu quyền sở hữu</span>
                  </div>
                  <div className="m03-evidence-grid">
                    <div className="m03-evidence-left">
                      <span className="m03-sub-label">
                        <Paperclip size={12} />
                        Ảnh minh chứng ({imageProofs.length})
                      </span>
                      {imageProofs.length === 0 ? (
                        <div style={{ fontSize: 12, color: '#67786F', padding: '10px 0' }}>Không đính kèm ảnh.</div>
                      ) : (
                        <div className="m03-evidence-photos-row">
                          {imageProofs.map((img) => {
                            const url = resolveUploadUrl(img.proofContent)
                            return (
                              <button
                                key={img.id}
                                type="button"
                                className="m03-evidence-photo-wrap"
                                onClick={() => setLightboxUrl(url)}
                                title="Phóng to ảnh minh chứng"
                              >
                                <img src={url} alt="Minh chứng" className="m03-evidence-photo" />
                                <span className="m03-photo-expand-badge">
                                  <Maximize2 size={10} />
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="m03-evidence-right">
                      <span className="m03-sub-label">
                        <FileText size={12} />
                        Nội dung đối chiếu ({textProofs.length})
                      </span>
                      <div className="m03-evidence-desc-box">
                        {textProofs.length === 0
                          ? 'Người gửi chỉ đính kèm ảnh minh chứng.'
                          : textProofs.map((p) => (
                              <div key={p.id} style={{ marginBottom: 6 }}>
                                <strong>[{p.proofType}]</strong> {p.proofContent}
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>

                {(selectedClaim.handover || selectedClaim.note) && (
                  <div className="m03-section-block">
                    <div className="m03-evidence-desc-box" style={{ background: '#F8FAFC' }}>
                      {selectedClaim.handover ? (
                        <div>
                          <strong>Biên bản bàn giao:</strong> {selectedClaim.handover.handoverByName || 'Staff'} lúc{' '}
                          {formatDateTime(selectedClaim.handover.handoverAt)} — {selectedClaim.handover.note}
                        </div>
                      ) : (
                        <div>
                          <strong>Ghi chú xử lý:</strong> {selectedClaim.note}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="m03-section-block">
                  <div className="m03-section-title">
                    <Clock size={15} />
                    <span>Hành động xử lý</span>
                  </div>
                  <div className="m03-actions-row">
                    {selectedClaim.status === 'PENDING' && (
                      <>
                        <Link
                          to={`/staff/handover?claimId=${selectedClaim.id}`}
                          className="m03-btn-accept"
                          style={{ textDecoration: 'none' }}
                        >
                          <Check size={14} />
                          <span>Xác nhận bàn giao (ACCEPTED)</span>
                        </Link>
                        <button
                          type="button"
                          disabled={submitting}
                          className="m03-btn-reject"
                          onClick={() => setRejectOpen(true)}
                        >
                          <XCircle size={14} />
                          <span>Từ chối yêu cầu (REJECTED)</span>
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="m03-btn-back"
                      onClick={() => navigate('/staff')}
                    >
                      <ArrowLeft size={13} />
                      <span>Quay lại tổng quan</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ReasonDialog
        key={`reject-claim-${selectedClaim?.id || 'none'}`}
        open={rejectOpen}
        title={`Từ chối yêu cầu #CLM-${selectedClaim?.id || ''}`}
        description="Vui lòng ghi rõ lý do từ chối (ví dụ: thông tin nhận dạng hoặc serial chưa trùng khớp) để lưu Audit Log."
        fieldLabel="Lý do từ chối"
        confirmLabel="Xác nhận từ chối"
        submitting={submitting}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleConfirmReject}
      />

      <ImageLightboxDialog
        imageUrl={lightboxUrl}
        title={`Ảnh minh chứng #CLM-${selectedClaim?.id || ''}`}
        onClose={() => setLightboxUrl('')}
      />
    </PortalShell>
  )
}
