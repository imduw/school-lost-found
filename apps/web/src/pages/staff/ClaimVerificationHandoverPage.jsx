import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  Search,
  FileText,
  Calendar,
  MapPin,
  Check,
  Clock,
  User,
  Eye,
  Maximize2,
  Paperclip,
  Handshake,
  Package,
  CheckSquare,
  CircleAlert,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { ImageLightboxDialog, ReasonDialog } from '../../components/ActionDialogs'
import { useAuth } from '../../contexts/useAuth'
import { resolveUploadUrl } from '../../services/apiClient'
import { claimService } from '../../services/claimService'
import { getItemThumbnail, formatDateTime } from '../../utils/itemImageHelper'
import bannerMascot from '../../assets/dashboard/banner-handover-mascot.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'
import './ItemModeration.css'
import './ClaimsManagement.css'
import './ClaimVerificationHandover.css'

function getDefaultLocalDateTime() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export default function ClaimVerificationHandoverPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const claimIdParam = searchParams.get('claimId')
  const canAccess = isAuthenticated && ['ADMIN', 'MODERATOR'].includes(currentUser?.role)

  const [pendingClaims, setPendingClaims] = useState([])
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)

  const [checks, setChecks] = useState({ descMatch: true, proofValid: true, directVerify: true })
  const [handoverAt, setHandoverAt] = useState(getDefaultLocalDateTime)
  const [handoverLocation, setHandoverLocation] = useState('Phòng Công tác sinh viên (A101)')
  const [noteText, setNoteText] = useState('Đã đối chiếu thông tin và bàn giao thành công.')

  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [rejectOpen, setRejectOpen] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState('')

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    const loadClaims = async () => {
      try {
        const pendingList = await claimService.getAllClaims({ status: 'PENDING' })
        let target = null
        if (claimIdParam) {
          target = await claimService.getClaimById(claimIdParam)
        } else {
          target = pendingList[0] || null
        }
        if (!cancelled) {
          setPendingClaims(pendingList)
          setClaim(target)
        }
      } catch (err) {
        if (!cancelled) {
          setFeedback({ type: 'error', text: err.message })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadClaims()
    return () => {
      cancelled = true
    }
  }, [canAccess, claimIdParam])

  const imageProofs = (claim?.proofs || []).filter((p) => p.proofType === 'ATTACHMENT_URL')
  const textProofs = (claim?.proofs || []).filter((p) => p.proofType !== 'ATTACHMENT_URL')

  const handleConfirmHandover = async () => {
    if (!claim) return
    if (!checks.descMatch || !checks.proofValid || !checks.directVerify) {
      setFeedback({
        type: 'error',
        text: 'Vui lòng kiểm tra và đánh dấu đủ 3 bước xác minh trước khi bàn giao.',
      })
      return
    }

    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const combinedNote = `[${handoverLocation}] ${noteText.trim()}`.slice(0, 300)
      const isoTime = handoverAt ? new Date(handoverAt).toISOString() : undefined
      const result = await claimService.completeHandover(claim.id, {
        note: combinedNote,
        handoverAt: isoTime,
      })

      const [updatedClaim, refreshedPending] = await Promise.all([
        claimService.getClaimById(claim.id),
        claimService.getAllClaims({ status: 'PENDING' }),
      ])
      setClaim(updatedClaim)
      setPendingClaims(refreshedPending)
      setFeedback({
        type: 'success',
        text: `Đã hoàn tất bàn giao #CLM-${claim.id} và đóng tin (${result.itemBusinessStatus}). Tự động từ chối ${result.autoRejectedClaimsCount} yêu cầu khác cùng món đồ.`,
      })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectClaim = async (reason) => {
    if (!claim) return
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await claimService.rejectClaim(claim.id, { note: reason })
      const refreshedPending = await claimService.getAllClaims({ status: 'PENDING' })
      setClaim(updated)
      setPendingClaims(refreshedPending)
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
      activeMenu="handover"
      wrapperClass="m04-page-wrapper"
      bodyClass="m04-body"
      pendingCount={pendingClaims.length}
    >
      <main className="m04-main">
        <div className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <Handshake size={22} className="banner-claim-icon" />
              Xác minh và bàn giao đồ
            </h1>
            <p className="a01-banner-subtitle">
              Đối chiếu thông tin, xác minh quyền sở hữu và xác nhận bàn giao thực tế (chống bàn giao trùng lặp).
            </p>
          </div>
          <img src={bannerMascot} alt="" className="a01-banner-img" />
        </div>

        <div className="m04-top-nav-row" style={{ flexWrap: 'wrap', gap: 12 }}>
          <Link to="/staff/claims" className="m04-back-link">
            ← Quay lại danh sách yêu cầu
          </Link>

          {pendingClaims.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label htmlFor="select-pending-claim" style={{ fontSize: 13, fontWeight: 600 }}>
                Chọn yêu cầu đang chờ:
              </label>
              <select
                id="select-pending-claim"
                value={claim?.id || ''}
                onChange={(e) => setSearchParams({ claimId: e.target.value })}
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#fff', fontSize: 13 }}
              >
                {claim && !pendingClaims.some((p) => p.id === claim.id) && (
                  <option value={claim.id}>
                    CLM-{claim.id} — {claim.item?.title} ({claim.status})
                  </option>
                )}
                {pendingClaims.map((p) => (
                  <option key={p.id} value={p.id}>
                    CLM-{p.id} — {p.item?.title} ({p.claimant?.fullName})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="m04-stepper-bar">
            <div className="m04-step-item">
              <span className="m04-step-badge-done">
                <Check size={13} />
                <span>1. Xem yêu cầu</span>
              </span>
            </div>
            <span className="m04-step-arrow">→</span>

            <div className="m04-step-item">
              <span className={claim?.status === 'ACCEPTED' ? 'm04-step-badge-done' : 'm04-step-badge-active'}>
                {claim?.status === 'ACCEPTED' ? <Check size={13} /> : <span className="m04-step-num-active">2</span>}
                <span>2. Xác minh & đối chiếu</span>
              </span>
            </div>
            <span className="m04-step-arrow">→</span>

            <div className="m04-step-item">
              <span className={claim?.status === 'ACCEPTED' ? 'm04-step-badge-done' : 'm04-step-badge-next'}>
                {claim?.status === 'ACCEPTED' ? <Check size={13} /> : <span className="m04-step-num-next">3</span>}
                <span>3. Xác nhận bàn giao</span>
              </span>
            </div>
          </div>
        </div>

        {feedback.text && (
          <div
            role="status"
            aria-live="polite"
            className={`slf-banner-feedback ${feedback.type === 'error' ? 'slf-banner-error' : 'slf-banner-success'}`}
            style={{ marginBottom: 16 }}
          >
            <span>{feedback.text}</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: 48, background: '#fff', borderRadius: 16, textAlign: 'center' }}>
            Đang tải hồ sơ xác minh từ máy chủ...
          </div>
        ) : !claim ? (
          <div style={{ padding: 48, background: '#fff', borderRadius: 16, textAlign: 'center', border: '1px solid #E8E2D5' }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Hiện không có yêu cầu nhận đồ nào đang chờ bàn giao</h2>
            <p style={{ fontSize: 14, color: '#67786F', marginBottom: 16 }}>
              Bạn có thể quay lại danh sách yêu cầu để xem lịch sử các yêu cầu đã xử lý.
            </p>
            <Link to="/staff/claims" className="slf-btn-primary">
              Xem danh sách yêu cầu
            </Link>
          </div>
        ) : (
          <div className="m04-content-grid">
            <div className="m04-left-col">
              <div className="m04-two-cards-row">
                <div className="m04-card">
                  <div className="m04-card-title">
                    <FileText size={15} />
                    <span>Thông tin yêu cầu</span>
                  </div>
                  <div className="m04-fields-list">
                    <div className="m04-field-row">
                      <User size={13} />
                      <span className="m04-field-label">Mã yêu cầu:</span>
                      <span className="m04-field-val">CLM-{claim.id}</span>
                    </div>
                    <div className="m04-field-row">
                      <User size={13} />
                      <span className="m04-field-label">Người yêu cầu:</span>
                      <span className="m04-field-val">
                        {claim.claimant?.fullName} {claim.claimant?.studentId ? `(${claim.claimant.studentId})` : ''}
                      </span>
                    </div>
                    <div className="m04-field-row">
                      <Clock size={13} />
                      <span className="m04-field-label">Thời gian gửi:</span>
                      <span className="m04-field-val">{formatDateTime(claim.createdAt)}</span>
                    </div>
                    <div className="m04-field-row">
                      <CircleAlert size={13} />
                      <span className="m04-field-label">Trạng thái:</span>
                      <span
                        className={
                          claim.status === 'ACCEPTED'
                            ? 'm03-status-accepted'
                            : claim.status === 'REJECTED'
                              ? 'm03-status-rejected'
                              : 'm03-status-pending'
                        }
                      >
                        {claim.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="m04-card">
                  <div className="m04-card-title">
                    <Package size={15} />
                    <span>Tin đăng liên quan</span>
                  </div>
                  <div className="m04-linked-item-box">
                    <img src={getItemThumbnail(claim.item)} alt={claim.item?.title || ''} className="m04-linked-thumb" />
                    <div className="m04-linked-right">
                      <div className="m04-linked-title-row">
                        <span className="m01-type-badge m01-type-found" style={{ width: 'fit-content' }}>
                          {claim.item?.itemType || 'FOUND'}
                        </span>
                        <span className="m04-linked-item-name">{claim.item?.title}</span>
                      </div>
                      <div className="m04-linked-meta-list">
                        <div className="m04-meta-line">
                          <User size={11} />
                          <span>Người đăng: {claim.item?.authorName || 'Sinh viên VKU'}</span>
                        </div>
                        <div className="m04-meta-line">
                          <MapPin size={11} />
                          <span>Khu vực: {claim.item?.approximateLocation || 'Trong trường'}</span>
                        </div>
                        <div className="m04-meta-line">
                          <Package size={11} />
                          <span>Trạng thái tin: {claim.item?.businessStatus}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="m04-btn-view-link"
                        onClick={() => navigate(`/items/${claim.itemId}`)}
                      >
                        <Eye size={11} />
                        <span>Xem chi tiết tin</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="m04-evidence-card">
                <div className="m04-card-title">
                  <CheckSquare size={15} />
                  <span>Bằng chứng đối chiếu quyền sở hữu</span>
                </div>
                <div className="m04-evidence-grid">
                  <div>
                    <span className="m03-sub-label" style={{ marginBottom: 6 }}>
                      <Paperclip size={12} />
                      Ảnh minh chứng ({imageProofs.length})
                    </span>
                    {imageProofs.length === 0 ? (
                      <div style={{ fontSize: 12, color: '#67786F' }}>Không có ảnh minh chứng đính kèm.</div>
                    ) : (
                      <div className="m04-evidence-photos-wrap">
                        {imageProofs.map((img) => {
                          const url = resolveUploadUrl(img.proofContent)
                          return (
                            <button
                              key={img.id}
                              type="button"
                              className="m04-evidence-img-box"
                              onClick={() => setLightboxUrl(url)}
                              title="Phóng to ảnh minh chứng"
                            >
                              <img src={url} alt="Minh chứng" />
                              <span className="m04-expand-icon">
                                <Maximize2 size={10} />
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="m03-sub-label" style={{ marginBottom: 6 }}>
                      <FileText size={12} />
                      Nội dung đối chiếu ({textProofs.length})
                    </span>
                    <div className="m04-desc-box">
                      {textProofs.length === 0
                        ? 'Chỉ đính kèm ảnh minh chứng.'
                        : textProofs.map((p) => (
                            <div key={p.id} style={{ marginBottom: 6 }}>
                              <strong>[{p.proofType}]</strong> {p.proofContent}
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="m04-notice-card">
                <div className="m04-notice-title">
                  <CircleAlert size={14} />
                  <span>Lưu ý xác minh & Chống bàn giao trùng lặp</span>
                </div>
                <ul className="m04-notice-list" style={{ listStyleType: 'disc', paddingLeft: 18 }}>
                  <li>Đối chiếu thông tin mô tả, đặc điểm nhận dạng với món đồ thực tế.</li>
                  <li>Khi xác nhận bàn giao, tin sẽ tự động chuyển sang CLOSED và từ chối mọi yêu cầu PENDING khác trên món đồ này.</li>
                  <li>Nếu 2 cán bộ cùng bấm xác nhận đồng thời, hệ thống khóa giao dịch và chỉ cho phép 1 bàn giao thành công.</li>
                </ul>
              </div>
            </div>

            <div className="m04-right-panel">
              <div className="m04-right-header">
                <div className="m04-card-title">
                  <FileText size={16} />
                  <span>Kết quả xử lý</span>
                </div>
                <span className="m02-status-pending-pill">
                  <Clock size={11} />
                  {claim.status}
                </span>
              </div>

              {claim.status !== 'PENDING' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
                  <div className={`slf-banner-feedback ${claim.status === 'ACCEPTED' ? 'slf-banner-success' : 'slf-banner-error'}`}>
                    <span>Yêu cầu #CLM-{claim.id} đã ở trạng thái {claim.status}.</span>
                  </div>
                  {claim.handover && (
                    <div style={{ fontSize: 13, background: '#FAF8F5', padding: 12, borderRadius: 10, border: '1px solid #E5DED2' }}>
                      <div><strong>Người xác nhận:</strong> {claim.handover.handoverByName}</div>
                      <div><strong>Thời gian:</strong> {formatDateTime(claim.handover.handoverAt)}</div>
                      <div><strong>Ghi chú:</strong> {claim.handover.note}</div>
                    </div>
                  )}
                  <Link to="/staff/claims" className="slf-btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                    Quay lại danh sách yêu cầu
                  </Link>
                </div>
              ) : (
                <>
                  <div className="m03-section-block">
                    <div className="m03-section-title">
                      <Search size={14} />
                      <span>Đối chiếu & xác minh</span>
                    </div>
                    <div className="m04-checklist-box">
                      <label className="m04-check-item">
                        <input
                          type="checkbox"
                          className="m02-card-checkbox"
                          checked={checks.descMatch}
                          onChange={(e) => setChecks((prev) => ({ ...prev, descMatch: e.target.checked }))}
                        />
                        <span>Thông tin mô tả khớp với món đồ.</span>
                      </label>
                      <label className="m04-check-item">
                        <input
                          type="checkbox"
                          className="m02-card-checkbox"
                          checked={checks.proofValid}
                          onChange={(e) => setChecks((prev) => ({ ...prev, proofValid: e.target.checked }))}
                        />
                        <span>Bằng chứng do sinh viên cung cấp là hợp lệ.</span>
                      </label>
                      <label className="m04-check-item">
                        <input
                          type="checkbox"
                          className="m02-card-checkbox"
                          checked={checks.directVerify}
                          onChange={(e) => setChecks((prev) => ({ ...prev, directVerify: e.target.checked }))}
                        />
                        <span>Đã đối chiếu trực tiếp và xác định đúng quyền sở hữu.</span>
                      </label>
                    </div>
                  </div>

                  <div className="m03-section-block">
                    <div className="m03-section-title">
                      <Package size={14} />
                      <span>Xác nhận bàn giao</span>
                    </div>

                    <div className="m04-form-group">
                      <label htmlFor="handover-at-input" className="m04-form-label">
                        <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Thời gian bàn giao <span className="required">*</span>
                      </label>
                      <input
                        id="handover-at-input"
                        type="datetime-local"
                        value={handoverAt}
                        onChange={(e) => setHandoverAt(e.target.value)}
                        style={{ width: '100%', padding: '9px 10px', borderRadius: 10, border: '1px solid #CBD5E1' }}
                      />
                    </div>

                    <div className="m04-form-group">
                      <label htmlFor="handover-location-select" className="m04-form-label">
                        <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Địa điểm bàn giao <span className="required">*</span>
                      </label>
                      <select
                        id="handover-location-select"
                        className="m04-select-dropdown"
                        value={handoverLocation}
                        onChange={(e) => setHandoverLocation(e.target.value)}
                      >
                        <option value="Phòng Công tác sinh viên (A101)">Phòng Công tác sinh viên (A101)</option>
                        <option value="Phòng Đoàn - Hội (B202)">Phòng Đoàn - Hội (B202)</option>
                        <option value="Thư viện tầng 1">Thư viện tầng 1</option>
                      </select>
                    </div>

                    <div className="m04-form-group">
                      <label htmlFor="handover-note-input" className="m04-form-label">
                        <FileText size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Ghi chú (tùy chọn)
                      </label>
                      <div className="m04-textarea-wrap">
                        <textarea
                          id="handover-note-input"
                          className="m04-textarea"
                          maxLength={200}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        />
                        <span className="m04-textarea-counter">{noteText.length} / 200</span>
                      </div>
                    </div>
                  </div>

                  <div className="m04-form-actions-row">
                    <button
                      type="button"
                      disabled={submitting}
                      className="m04-btn-reject-lg"
                      onClick={() => setRejectOpen(true)}
                    >
                      ✕ Từ chối yêu cầu
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      className="m04-btn-confirm-lg"
                      onClick={handleConfirmHandover}
                    >
                      {submitting ? 'Đang xử lý...' : '✓ Xác nhận bàn giao'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <ReasonDialog
        key={`handover-reject-${claim?.id || 'none'}`}
        open={rejectOpen}
        title={`Từ chối yêu cầu #CLM-${claim?.id || ''}`}
        description="Yêu cầu sẽ chuyển sang REJECTED và ghi nhận vào Audit Log."
        fieldLabel="Lý do từ chối"
        confirmLabel="Xác nhận từ chối"
        submitting={submitting}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleRejectClaim}
      />

      <ImageLightboxDialog
        imageUrl={lightboxUrl}
        title={`Ảnh minh chứng #CLM-${claim?.id || ''}`}
        onClose={() => setLightboxUrl('')}
      />
    </PortalShell>
  )
}
