import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Undo2,
  Eye,
  ShieldCheck,
  MapPin,
  PackageCheck,
  Maximize2,
} from 'lucide-react'
import PublicHeader from '../../components/PublicHeader'
import { ConfirmDialog, ImageLightboxDialog } from '../../components/ActionDialogs'
import { useAuth } from '../../contexts/useAuth'
import { resolveUploadUrl } from '../../services/apiClient'
import { claimService } from '../../services/claimService'
import { formatDateTime } from '../../utils/itemImageHelper'
import './Home.css'
import './ExploreItems.css'

const STATUS_BADGE = {
  PENDING: { label: 'Đang chờ đối chiếu', bg: '#FEF3C7', color: '#92400E', Icon: Clock },
  ACCEPTED: { label: 'Đã bàn giao (ACCEPTED)', bg: '#DCFCE7', color: '#166534', Icon: CheckCircle2 },
  REJECTED: { label: 'Đã từ chối', bg: '#FEE2E2', color: '#991B1B', Icon: XCircle },
  WITHDRAWN: { label: 'Đã tự rút yêu cầu', bg: '#F3F4F6', color: '#4B5563', Icon: Undo2 },
}

const PROOF_TYPE_LABEL = {
  DESCRIPTION: 'Mô tả nhận dạng',
  SERIAL_NUMBER: 'Số Serial / IMEI',
  CONTACT: 'Thông tin liên hệ',
  ATTACHMENT_URL: 'Ảnh minh chứng',
}

export default function MyClaimsPage() {
  const { isAuthenticated, loadingAuth } = useAuth()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [withdrawTarget, setWithdrawTarget] = useState(null)
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState('')

  useEffect(() => {
    if (loadingAuth) return
    if (!isAuthenticated) {
      let cancelled = false
      Promise.resolve().then(() => {
        if (!cancelled) {
          setClaims([])
          setLoading(false)
        }
      })
      return () => {
        cancelled = true
      }
    }

    let cancelled = false
    claimService
      .getMyClaims()
      .then((list) => {
        if (!cancelled) {
          setClaims(list)
          setFeedback((prev) => (prev.type === 'error' ? { type: '', text: '' } : prev))
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
  }, [isAuthenticated, loadingAuth])

  const handleConfirmWithdraw = async () => {
    if (!withdrawTarget) return
    setSubmittingWithdraw(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await claimService.withdrawClaim(withdrawTarget.id)
      setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      setFeedback({ type: 'success', text: `Đã rút yêu cầu #CLM-${updated.id} thành công.` })
      setWithdrawTarget(null)
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmittingWithdraw(false)
    }
  }

  const filteredClaims =
    statusFilter === 'ALL' ? claims : claims.filter((c) => c.status === statusFilter)

  return (
    <div className="p02-page-wrapper">
      <PublicHeader />

      <main className="p02-main" style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 20px 48px' }}>
        <section className="p02-banner-card" style={{ marginBottom: 22 }}>
          <div className="p02-banner-text">
            <h1 className="p02-banner-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Send size={22} />
              <span>Yêu cầu nhận đồ của tôi</span>
            </h1>
            <p className="p02-banner-subtitle">
              Theo dõi trạng thái xác minh bằng chứng riêng tư (Proof Privacy) và chủ động rút yêu cầu khi đang chờ xử lý.
            </p>
          </div>
        </section>

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

        {!loadingAuth && !isAuthenticated ? (
          <div style={{ padding: 40, background: '#fff', borderRadius: 16, textAlign: 'center', border: '1px solid #E8E2D5' }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Vui lòng đăng nhập để xem yêu cầu nhận đồ của bạn</h2>
            <p style={{ fontSize: 14, color: '#67786F', marginBottom: 16 }}>
              Thông tin bằng chứng đối chiếu được bảo mật riêng tư theo từng tài khoản.
            </p>
            <Link to="/login" className="slf-btn-primary">
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {[
                { id: 'ALL', label: `Tất cả (${claims.length})` },
                { id: 'PENDING', label: `Đang chờ (${claims.filter((c) => c.status === 'PENDING').length})` },
                { id: 'ACCEPTED', label: `Đã nhận đồ (${claims.filter((c) => c.status === 'ACCEPTED').length})` },
                { id: 'REJECTED', label: `Bị từ chối (${claims.filter((c) => c.status === 'REJECTED').length})` },
                { id: 'WITHDRAWN', label: `Đã rút (${claims.filter((c) => c.status === 'WITHDRAWN').length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    border: statusFilter === tab.id ? '1px solid #2E7D32' : '1px solid #E2E8F0',
                    background: statusFilter === tab.id ? '#E8F5E9' : '#FFFFFF',
                    color: statusFilter === tab.id ? '#1B5E20' : '#475569',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: 40, background: '#fff', borderRadius: 16, textAlign: 'center' }}>
                Đang tải danh sách yêu cầu từ máy chủ...
              </div>
            ) : filteredClaims.length === 0 ? (
              <div style={{ padding: 40, background: '#fff', borderRadius: 16, textAlign: 'center', border: '1px solid #E8E2D5' }}>
                <p style={{ fontSize: 15, color: '#67786F', marginBottom: 14 }}>
                  Bạn chưa có yêu cầu nhận đồ nào ở mục này.
                </p>
                <Link to="/search" className="slf-btn-primary">
                  Tìm kiếm đồ nhặt được
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filteredClaims.map((claim) => {
                  const badge = STATUS_BADGE[claim.status] || STATUS_BADGE.PENDING
                  const BadgeIcon = badge.Icon
                  const textProofs = (claim.proofs || []).filter((p) => p.proofType !== 'ATTACHMENT_URL')
                  const imageProofs = (claim.proofs || []).filter((p) => p.proofType === 'ATTACHMENT_URL')

                  return (
                    <article
                      key={claim.id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 16,
                        border: '1px solid #E8E2D5',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                        boxShadow: '0 2px 8px rgba(52,68,59,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#527A61', background: '#EAF1EC', padding: '3px 8px', borderRadius: 6 }}>
                              #CLM-{claim.id}
                            </span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                fontSize: 12,
                                fontWeight: 700,
                                padding: '3px 10px',
                                borderRadius: 999,
                                background: badge.bg,
                                color: badge.color,
                              }}
                            >
                              <BadgeIcon size={13} />
                              <span>{badge.label}</span>
                            </span>
                            <span style={{ fontSize: 12, color: '#67786F' }}>
                              Gửi lúc: {formatDateTime(claim.createdAt)}
                            </span>
                          </div>

                          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#34443B', marginTop: 4 }}>
                            {claim.item?.title || `Tin đăng #${claim.itemId}`}
                          </h2>
                          {claim.item?.approximateLocation && (
                            <p style={{ fontSize: 13, color: '#67786F', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                              <MapPin size={13} />
                              <span>{claim.item.approximateLocation}</span>
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <Link
                            to={`/items/${claim.itemId}`}
                            className="slf-btn-secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                          >
                            <Eye size={14} />
                            <span>Xem tin đăng</span>
                          </Link>
                          {claim.status === 'PENDING' && (
                            <button
                              type="button"
                              className="slf-btn-danger"
                              onClick={() => setWithdrawTarget(claim)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                            >
                              <Undo2 size={14} />
                              <span>Rút yêu cầu</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ background: '#FAF8F5', border: '1px solid #EDE7DD', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#2E7D32' }}>
                          <ShieldCheck size={15} />
                          <span>Bằng chứng riêng tư đã gửi</span>
                        </div>

                        {textProofs.map((p) => (
                          <div key={p.id} style={{ fontSize: 13, color: '#34443B' }}>
                            <strong>{PROOF_TYPE_LABEL[p.proofType] || p.proofType}:</strong> {p.proofContent}
                          </div>
                        ))}

                        {imageProofs.length > 0 && (
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {imageProofs.map((img) => {
                              const url = resolveUploadUrl(img.proofContent)
                              return (
                                <button
                                  key={img.id}
                                  type="button"
                                  onClick={() => setLightboxUrl(url)}
                                  title="Phóng to ảnh minh chứng"
                                  style={{
                                    position: 'relative',
                                    width: 72,
                                    height: 72,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    border: '1px solid #CBD5E1',
                                    padding: 0,
                                  }}
                                >
                                  <img src={url} alt="Minh chứng" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 4, padding: 2 }}>
                                    <Maximize2 size={10} />
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {claim.handover && (
                        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: 12, fontSize: 13, color: '#065F46', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                            <PackageCheck size={15} />
                            <span>Biên bản bàn giao đã xác nhận</span>
                          </div>
                          <div>Người xác nhận: {claim.handover.handoverByName || 'Cán bộ hỗ trợ'} — Lúc {formatDateTime(claim.handover.handoverAt)}</div>
                          {claim.handover.note && <div>Ghi chú: {claim.handover.note}</div>}
                        </div>
                      )}

                      {!claim.handover && claim.note && (
                        <div style={{ fontSize: 13, color: '#475569', background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <strong>Phản hồi xử lý:</strong> {claim.note}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      <ConfirmDialog
        open={Boolean(withdrawTarget)}
        title="Xác nhận rút yêu cầu nhận đồ"
        message={`Bạn chắc chắn muốn rút yêu cầu #CLM-${withdrawTarget?.id || ''} đối với "${withdrawTarget?.item?.title || ''}"? Bạn vẫn có thể gửi lại yêu cầu mới sau nếu cần.`}
        confirmLabel="Rút yêu cầu"
        danger
        submitting={submittingWithdraw}
        onClose={() => setWithdrawTarget(null)}
        onConfirm={handleConfirmWithdraw}
      />

      <ImageLightboxDialog imageUrl={lightboxUrl} onClose={() => setLightboxUrl('')} />
    </div>
  )
}
