import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  MapPin, Calendar, Tag, ArrowRight,
  Send, ShieldCheck, Sparkles, Bookmark,
  Package, User, Edit3, CheckCircle, AlertCircle, ImagePlus, Trash2,
  Eye, EyeOff, Undo2, Paperclip, X, Maximize2,
} from 'lucide-react'
import PublicHeader from '../../components/PublicHeader'
import { ConfirmDialog, ImageLightboxDialog, ReasonDialog } from '../../components/ActionDialogs'
import { useAuth } from '../../contexts/useAuth'
import { resolveUploadUrl } from '../../services/apiClient'
import { itemService } from '../../services/itemService'
import { claimService } from '../../services/claimService'
import { getItemThumbnail, formatShortDate, formatDateTime } from '../../utils/itemImageHelper'
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
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)

  // Phase 2: Claim & Proof Privacy state
  const [myClaim, setMyClaim] = useState(null)
  const [claimFormOpen, setClaimFormOpen] = useState(false)
  const [proofType, setProofType] = useState('DESCRIPTION')
  const [proofContent, setProofContent] = useState('')
  const [proofFiles, setProofFiles] = useState([])
  const [submittingClaim, setSubmittingClaim] = useState(false)
  const [claimFeedback, setClaimFeedback] = useState({ type: '', text: '' })
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  // Phase 2: Staff quick moderation & image preview dialogs
  const [hideDialogOpen, setHideDialogOpen] = useState(false)
  const [moderating, setModerating] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState('')

  useEffect(() => {
    let cancelled = false
    itemService
      .getItemById(itemId)
      .then((data) => {
        if (!cancelled) {
          setItem(data)
          setActiveImageIdx(0)
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

  useEffect(() => {
    let cancelled = false
    if (!isAuthenticated) {
      Promise.resolve().then(() => {
        if (!cancelled) setMyClaim(null)
      })
      return () => {
        cancelled = true
      }
    }

    claimService
      .getMyClaims()
      .then((list) => {
        if (!cancelled) {
          const matching = list.filter((c) => String(c.itemId) === String(itemId))
          const activeOrLatest =
            matching.find((c) => c.status === 'PENDING') ||
            matching.find((c) => c.status === 'ACCEPTED') ||
            matching[0] ||
            null
          setMyClaim(activeOrLatest)
        }
      })
      .catch(() => {
        if (!cancelled) setMyClaim(null)
      })

    return () => {
      cancelled = true
    }
  }, [itemId, isAuthenticated])

  const isOwner = isAuthenticated && item && Number(currentUser.id) === Number(item.userId)
  const isStaff = isAuthenticated && ['ADMIN', 'MODERATOR'].includes(currentUser.role)
  const canManageImages = Boolean(item && (isStaff || (isOwner && item.businessStatus === 'OPEN')))

  const uploadedImages = item?.images || []
  const mainPhotoSrc =
    uploadedImages.length > 0
      ? resolveUploadUrl(uploadedImages[Math.min(activeImageIdx, uploadedImages.length - 1)]?.storageUrl)
      : getItemThumbnail(item)

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

  const handleUploadMoreImages = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (files.length === 0 || !item) return

    setUploadingImg(true)
    setActionMsg('')
    try {
      const added = await itemService.uploadItemImages(item.id, files)
      setItem((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...added],
      }))
      setActionMsg(`✅ Đã tải lên thêm ${added.length} ảnh và lưu vào database!`)
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    } finally {
      setUploadingImg(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!item) return
    setActionMsg('')
    try {
      await itemService.deleteItemImage(item.id, imageId)
      setItem((prev) => {
        const nextImages = (prev.images || []).filter((img) => img.id !== imageId)
        return { ...prev, images: nextImages }
      })
      setActiveImageIdx(0)
      setActionMsg('✅ Đã xóa ảnh khỏi tin đăng!')
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    }
  }

  const handleProofFilesChange = (e) => {
    const selected = Array.from(e.target.files || [])
    e.target.value = ''
    if (selected.length === 0) return
    setProofFiles((prev) => [...prev, ...selected].slice(0, 5))
  }

  const handleSubmitClaim = async (e) => {
    e.preventDefault()
    if (!item) return

    if (!proofContent.trim() && proofFiles.length === 0) {
      setClaimFeedback({
        type: 'error',
        text: 'Vui lòng nhập mô tả bằng chứng hoặc đính kèm ít nhất 1 ảnh minh chứng.',
      })
      return
    }

    setSubmittingClaim(true)
    setClaimFeedback({ type: '', text: '' })
    try {
      const createdClaim = await claimService.createClaim(item.id, {
        proofType,
        proofContent,
        files: proofFiles,
      })
      setMyClaim(createdClaim)
      setProofContent('')
      setProofFiles([])
      setClaimFormOpen(false)
      setClaimFeedback({
        type: 'success',
        text: `Đã gửi yêu cầu #CLM-${createdClaim.id}. Bằng chứng của bạn được bảo mật riêng tư để cán bộ đối chiếu.`,
      })
    } catch (err) {
      setClaimFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmittingClaim(false)
    }
  }

  const handleWithdrawClaim = async () => {
    if (!myClaim) return
    setWithdrawing(true)
    setClaimFeedback({ type: '', text: '' })
    try {
      const updated = await claimService.withdrawClaim(myClaim.id)
      setMyClaim(updated)
      setWithdrawOpen(false)
      setClaimFeedback({ type: 'success', text: `Đã rút yêu cầu #CLM-${updated.id}.` })
    } catch (err) {
      setClaimFeedback({ type: 'error', text: err.message })
    } finally {
      setWithdrawing(false)
    }
  }

  const handleHideItem = async (reason) => {
    if (!item) return
    setModerating(true)
    setActionMsg('')
    try {
      const updated = await itemService.updateItemVisibility(item.id, {
        publicationStatus: 'HIDDEN',
        reason,
      })
      setItem(updated)
      setHideDialogOpen(false)
      setActionMsg('✅ Đã ẩn tin đăng (HIDDEN) khỏi danh sách công khai.')
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    } finally {
      setModerating(false)
    }
  }

  const handleRestoreItem = async () => {
    if (!item) return
    setModerating(true)
    setActionMsg('')
    try {
      const updated = await itemService.updateItemVisibility(item.id, {
        publicationStatus: 'APPROVED',
        reason: 'Khôi phục hiển thị công khai từ trang chi tiết',
      })
      setItem(updated)
      setActionMsg('✅ Đã khôi phục hiển thị tin đăng (APPROVED).')
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    } finally {
      setModerating(false)
    }
  }

  const renderRightClaimPanel = () => {
    if (!item) return null

    if (item.itemType === 'LOST') {
      return (
        <div className="p03-cta-card">
          <img src={claimBoxMascot} alt="" className="p03-cta-mascot-img" />
          <h3 className="p03-cta-title">Bạn nhặt được món đồ này?</h3>
          <p className="p03-cta-desc">
            Đây là tin Báo mất (LOST). Hãy đăng tin Nhặt được (FOUND) hoặc liên hệ Phòng Công tác sinh viên để hỗ trợ bàn giao cho chủ nhân.
          </p>
          <Link
            to="/items/new?type=FOUND"
            className="p03-btn-send-claim"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Send size={14} />
            <span>Đăng tin nhặt được (FOUND)</span>
          </Link>
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <div className="p03-cta-card">
          <img src={claimBoxMascot} alt="" className="p03-cta-mascot-img" />
          <h3 className="p03-cta-title">Bạn là chủ nhân của món đồ?</h3>
          <p className="p03-cta-desc">
            Đăng nhập bằng tài khoản sinh viên VKU để gửi bằng chứng riêng tư (Proof Privacy) nhận lại đồ thất lạc.
          </p>
          <Link
            to="/login"
            className="p03-btn-send-claim"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Send size={14} />
            <span>Đăng nhập để gửi yêu cầu</span>
          </Link>
        </div>
      )
    }

    if (isOwner) {
      return (
        <div className="p03-cta-card">
          <img src={claimBoxMascot} alt="" className="p03-cta-mascot-img" />
          <h3 className="p03-cta-title">Tin đăng do bạn tạo</h3>
          <p className="p03-cta-desc">
            Bằng chứng của người đến nhận đồ sẽ được bảo mật riêng tư để Cán bộ hỗ trợ đối chiếu và xác nhận bàn giao.
          </p>
        </div>
      )
    }

    return (
      <div className="p03-cta-card">
        <img src={claimBoxMascot} alt="" className="p03-cta-mascot-img" />
        <h3 className="p03-cta-title">Bạn là chủ nhân của món đồ?</h3>
        <p className="p03-cta-desc">
          Mọi bằng chứng bạn gửi (mô tả đặc điểm, serial, ảnh minh chứng) chỉ bạn và Cán bộ hỗ trợ được phép xem.
        </p>

        {claimFeedback.text && (
          <div
            role="status"
            aria-live="polite"
            className={`slf-banner-feedback ${claimFeedback.type === 'error' ? 'slf-banner-error' : 'slf-banner-success'}`}
            style={{ width: '100%', textAlign: 'left', marginBottom: 10 }}
          >
            <span>{claimFeedback.text}</span>
          </div>
        )}

        {myClaim && (
          <div
            style={{
              width: '100%',
              background: '#FAF8F5',
              border: '1px solid #E5DED2',
              borderRadius: 12,
              padding: 12,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <strong style={{ fontSize: 13, color: '#2E7D32' }}>Yêu cầu #CLM-{myClaim.id}</strong>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background:
                    myClaim.status === 'ACCEPTED'
                      ? '#DCFCE7'
                      : myClaim.status === 'REJECTED'
                        ? '#FEE2E2'
                        : myClaim.status === 'WITHDRAWN'
                          ? '#E5E7EB'
                          : '#FEF3C7',
                  color:
                    myClaim.status === 'ACCEPTED'
                      ? '#166534'
                      : myClaim.status === 'REJECTED'
                        ? '#991B1B'
                        : myClaim.status === 'WITHDRAWN'
                          ? '#374151'
                          : '#92400E',
                }}
              >
                {myClaim.status}
              </span>
            </div>

            <div style={{ fontSize: 12, color: '#67786F' }}>Gửi lúc: {formatDateTime(myClaim.createdAt)}</div>

            {(myClaim.proofs || [])
              .filter((p) => p.proofType !== 'ATTACHMENT_URL')
              .map((p) => (
                <div key={p.id} style={{ fontSize: 12, color: '#34443B', wordBreak: 'break-word' }}>
                  <strong>{p.proofType}:</strong> {p.proofContent}
                </div>
              ))}

            {(myClaim.proofs || []).some((p) => p.proofType === 'ATTACHMENT_URL') && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(myClaim.proofs || [])
                  .filter((p) => p.proofType === 'ATTACHMENT_URL')
                  .map((p) => {
                    const url = resolveUploadUrl(p.proofContent)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setLightboxUrl(url)}
                        style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', border: '1px solid #CBD5E1', padding: 0 }}
                        title="Xem ảnh minh chứng"
                      >
                        <img src={url} alt="Minh chứng" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    )
                  })}
              </div>
            )}

            {myClaim.note && (
              <div style={{ fontSize: 12, color: '#475569' }}>
                <strong>Ghi chú:</strong> {myClaim.note}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {myClaim.status === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(true)}
                  className="slf-btn-danger"
                  style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <Undo2 size={12} />
                  <span>Rút yêu cầu</span>
                </button>
              )}
              <Link
                to="/my-claims"
                className="slf-btn-secondary"
                style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}
              >
                Quản lý yêu cầu của tôi
              </Link>
            </div>
          </div>
        )}

        {item.businessStatus !== 'OPEN' ? (
          <div style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#F3F4F6', color: '#4B5563', fontSize: 13, fontWeight: 600 }}>
            Tin này đang ở trạng thái {item.businessStatus}, không nhận thêm yêu cầu mới.
          </div>
        ) : myClaim?.status === 'PENDING' ? null : !claimFormOpen ? (
          <button
            type="button"
            className="p03-btn-send-claim"
            onClick={() => {
              setClaimFormOpen(true)
              setClaimFeedback({ type: '', text: '' })
            }}
          >
            <Send size={14} />
            <span>{myClaim ? 'Gửi lại yêu cầu mới' : 'Gửi yêu cầu nhận đồ'}</span>
          </button>
        ) : (
          <form onSubmit={handleSubmitClaim} style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label htmlFor="claim-proof-type" style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                Loại bằng chứng đối chiếu
              </label>
              <select
                id="claim-proof-type"
                value={proofType}
                onChange={(e) => setProofType(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#fff' }}
              >
                <option value="DESCRIPTION">Mô tả đặc điểm nhận dạng</option>
                <option value="SERIAL_NUMBER">Số Serial / IMEI / Mã thẻ</option>
                <option value="CONTACT">Thông tin liên hệ xác minh</option>
              </select>
            </div>

            <div>
              <label htmlFor="claim-proof-content" style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                Nội dung bằng chứng riêng tư
              </label>
              <textarea
                id="claim-proof-content"
                rows={3}
                value={proofContent}
                onChange={(e) => setProofContent(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', resize: 'vertical' }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px dashed #2E7D32',
                  background: '#F4F9F5',
                  color: '#2E7D32',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Paperclip size={13} />
                <span>Đính kèm ảnh minh chứng ({proofFiles.length}/5)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleProofFilesChange}
                  style={{ display: 'none' }}
                />
              </label>

              {proofFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                  {proofFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, background: '#F8FAFC', padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 190 }}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setProofFiles((prev) => prev.filter((_, i) => i !== idx))}
                        aria-label={`Bỏ ảnh ${file.name}`}
                        style={{ color: '#DC2626', display: 'inline-flex', padding: 2 }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="submit"
                disabled={submittingClaim}
                className="p03-btn-send-claim"
                style={{ flex: 1, marginTop: 0 }}
              >
                <Send size={14} />
                <span>{submittingClaim ? 'Đang gửi...' : 'Gửi bằng chứng'}</span>
              </button>
              <button
                type="button"
                disabled={submittingClaim}
                onClick={() => setClaimFormOpen(false)}
                className="slf-btn-secondary"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    )
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
                <div className="p03-main-photo-wrap" style={{ position: 'relative' }}>
                  <img src={mainPhotoSrc} alt={item.title} className="p03-main-photo" style={{ objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(mainPhotoSrc)}
                    aria-label="Phóng to ảnh"
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'rgba(15, 23, 42, 0.65)',
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="p03-thumbs-row" style={{ flexWrap: 'wrap' }}>
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className={`p03-sub-thumb ${idx === activeImageIdx ? 'active' : ''}`}
                        onClick={() => setActiveImageIdx(idx)}
                        style={{ position: 'relative' }}
                      >
                        <img src={resolveUploadUrl(img.storageUrl)} alt="" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        {canManageImages && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteImage(img.id)
                            }}
                            title="Xóa ảnh"
                            style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: 'none',
                              background: 'rgba(185, 28, 28, 0.85)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {canManageImages && uploadedImages.length < 5 && (
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      marginTop: 10,
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: '1px dashed #2E7D32',
                      background: '#F4F9F5',
                      color: '#2E7D32',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: uploadingImg ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ImagePlus size={14} />
                    <span>{uploadingImg ? 'Đang tải ảnh...' : `Thêm ảnh (${uploadedImages.length}/5)`}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      disabled={uploadingImg}
                      onChange={handleUploadMoreImages}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
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
              {renderRightClaimPanel()}

              {isStaff && (
                <div className="p03-poster-card" style={{ gap: 10 }}>
                  <span className="p03-card-heading">Kiểm duyệt nhanh (Staff / Admin)</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.publicationStatus === 'APPROVED' ? (
                      <button
                        type="button"
                        disabled={moderating}
                        onClick={() => setHideDialogOpen(true)}
                        className="slf-btn-danger"
                        style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <EyeOff size={14} />
                        <span>Ẩn tin đăng (HIDDEN)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={moderating}
                        onClick={handleRestoreItem}
                        className="slf-btn-primary"
                        style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <Eye size={14} />
                        <span>Khôi phục hiển thị (APPROVED)</span>
                      </button>
                    )}

                    {item.itemType === 'FOUND' && (
                      <Link
                        to={`/staff/claims?itemId=${item.id}`}
                        className="slf-btn-secondary"
                        style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
                      >
                        Xem các yêu cầu nhận đồ
                      </Link>
                    )}
                  </div>
                </div>
              )}

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

      <ConfirmDialog
        open={withdrawOpen}
        title="Rút yêu cầu nhận đồ"
        message={`Bạn muốn rút yêu cầu #CLM-${myClaim?.id || ''}? Sau khi rút, bạn có thể gửi lại yêu cầu mới nếu món đồ vẫn đang mở.`}
        confirmLabel="Rút yêu cầu"
        danger
        submitting={withdrawing}
        onClose={() => setWithdrawOpen(false)}
        onConfirm={handleWithdrawClaim}
      />

      <ReasonDialog
        key={`hide-detail-${item?.id || 'none'}`}
        open={hideDialogOpen}
        title="Ẩn tin đăng khỏi bảng tin công khai"
        description="Trạng thái nghiệp vụ (OPEN/CLOSED) của tin vẫn được giữ nguyên; chỉ người đăng và cán bộ mới thấy tin này."
        fieldLabel="Lý do ẩn tin"
        confirmLabel="Xác nhận ẩn tin"
        submitting={moderating}
        onClose={() => setHideDialogOpen(false)}
        onConfirm={handleHideItem}
      />

      <ImageLightboxDialog
        imageUrl={lightboxUrl}
        title={item?.title || 'Xem ảnh'}
        onClose={() => setLightboxUrl('')}
      />
    </div>
  )
}
