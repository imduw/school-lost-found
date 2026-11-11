import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  FileText, Send, TrendingUp, CheckCircle, Package,
  ChevronRight, Calendar, MapPin, Check, X, MoreHorizontal, User, LayoutGrid,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { ReasonDialog } from '../../components/ActionDialogs'
import { useAuth } from '../../contexts/useAuth'
import { adminService } from '../../services/adminService'
import { itemService } from '../../services/itemService'
import { claimService } from '../../services/claimService'
import { getItemThumbnail, formatDateTime } from '../../utils/itemImageHelper'
import { buildDailyItemSeries } from '../../utils/dashboardHelper'
import bannerMascot from '../../assets/dashboard/banner-staff-mascot.png'
import '../admin/AdminDashboard.css'
import './StaffDashboard.css'

export default function StaffDashboardPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const canAccess = isAuthenticated && ['ADMIN', 'MODERATOR'].includes(currentUser?.role)

  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [pendingClaims, setPendingClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartRange, setChartRange] = useState('7days')
  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [rejectItemTarget, setRejectItemTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    Promise.all([
      adminService.getStats(),
      itemService.getItems(),
      claimService.getAllClaims({ status: 'PENDING' }),
    ])
      .then(([statsData, itemsData, claimsData]) => {
        if (!cancelled) {
          setStats(statsData)
          setItems(itemsData)
          setPendingClaims(claimsData)
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

  const refreshData = async () => {
    const [statsData, itemsData, claimsData] = await Promise.all([
      adminService.getStats(),
      itemService.getItems(),
      claimService.getAllClaims({ status: 'PENDING' }),
    ])
    setStats(statsData)
    setItems(itemsData)
    setPendingClaims(claimsData)
  }

  const handleQuickApprove = async (itemId) => {
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      await itemService.updateItemVisibility(itemId, {
        publicationStatus: 'APPROVED',
        reason: 'Cán bộ duyệt hiển thị nhanh từ bảng điều khiển',
      })
      await refreshData()
      setFeedback({ type: 'success', text: `Đã duyệt hiển thị tin #${itemId}.` })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmRejectItem = async (reason) => {
    if (!rejectItemTarget) return
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      await itemService.updateItemVisibility(rejectItemTarget.id, {
        publicationStatus: 'HIDDEN',
        reason,
      })
      setRejectItemTarget(null)
      await refreshData()
      setFeedback({ type: 'success', text: `Đã ẩn tin "${rejectItemTarget.title}".` })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const reviewQueue = items
    .filter((i) => i.publicationStatus === 'PENDING_REVIEW' || i.publicationStatus === 'HIDDEN')
    .slice(0, 3)
  const displayItems = reviewQueue.length > 0 ? reviewQueue : items.slice(0, 3)

  const chartDays = buildDailyItemSeries(items, chartRange === '30days' ? 30 : 7)
  const maxVal = Math.max(4, ...chartDays.map((d) => Math.max(d.found, d.lost)))
  const getY = (val) => 135 - (val / maxVal) * 115
  const getX = (idx) => 40 + idx * 72
  const foundPoints = chartDays.map((d, i) => `${getX(i)},${getY(d.found)}`).join(' ')
  const lostPoints = chartDays.map((d, i) => `${getX(i)},${getY(d.lost)}`).join(' ')

  const approvedCount = stats
    ? Math.max(0, stats.items.total - stats.items.hiddenCount - stats.items.pendingReviewCount)
    : 0

  return (
    <PortalShell
      portal="staff"
      activeMenu="overview"
      wrapperClass="m01-dashboard-wrapper"
      bodyClass="m01-body"
      pendingCount={(stats?.claims?.pendingCount || 0) + (stats?.items?.pendingReviewCount || 0)}
    >
      <main className="m01-main">
        <div className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <LayoutGrid size={22} className="banner-staff-icon" />
              Trang tổng quan cán bộ
            </h1>
            <p className="a01-banner-subtitle">
              Theo dõi, xử lý tin đăng và yêu cầu nhận đồ của sinh viên.
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

        <div className="m01-stats-row">
          <button type="button" className="m01-stat-card" onClick={() => navigate('/staff/review')} style={{ textAlign: 'left' }}>
            <div className="m01-stat-left">
              <div className="a01-stat-icon-wrapper icon-wrap-green">
                <FileText size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">{loading ? '...' : stats?.items?.pendingReviewCount ?? 0}</span>
                <span className="a01-stat-label">Tin chờ kiểm duyệt</span>
              </div>
            </div>
            <ChevronRight size={16} className="m01-stat-arrow" />
          </button>

          <button type="button" className="m01-stat-card" onClick={() => navigate('/staff/claims')} style={{ textAlign: 'left' }}>
            <div className="m01-stat-left">
              <div className="a01-stat-icon-wrapper icon-wrap-orange">
                <Send size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">{loading ? '...' : stats?.claims?.pendingCount ?? 0}</span>
                <span className="a01-stat-label">Yêu cầu chờ xác minh</span>
              </div>
            </div>
            <ChevronRight size={16} className="m01-stat-arrow" />
          </button>

          <button type="button" className="m01-stat-card" onClick={() => navigate('/search')} style={{ textAlign: 'left' }}>
            <div className="m01-stat-left">
              <div className="a01-stat-icon-wrapper icon-wrap-green">
                <Package size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">{loading ? '...' : approvedCount}</span>
                <span className="a01-stat-label">Tin đang công khai</span>
              </div>
            </div>
            <ChevronRight size={16} className="m01-stat-arrow" />
          </button>

          <button type="button" className="m01-stat-card" onClick={() => navigate('/staff/handover')} style={{ textAlign: 'left' }}>
            <div className="m01-stat-left">
              <div className="a01-stat-icon-wrapper icon-wrap-blue">
                <CheckCircle size={20} />
              </div>
              <div className="a01-stat-info">
                <span className="a01-stat-value">{loading ? '...' : stats?.handoversTotal ?? 0}</span>
                <span className="a01-stat-label">Đã bàn giao thành công</span>
              </div>
            </div>
            <ChevronRight size={16} className="m01-stat-arrow" />
          </button>
        </div>

        <div className="m01-two-col-grid">
          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <TrendingUp size={16} />
                <span>Thống kê tin đăng theo thời gian</span>
              </div>
              <select
                aria-label="Khoảng thời gian thống kê"
                className="a01-filter-select"
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
              </select>
            </div>

            <div className="a01-chart-container">
              <div className="a01-chart-legend">
                <div className="legend-item">
                  <span className="legend-dot-found" />
                  <span>Nhặt được (FOUND)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot-lost" />
                  <span>Báo mất (LOST)</span>
                </div>
              </div>

              <svg className="a01-svg-chart" viewBox="0 0 520 160">
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const val = Math.round(maxVal * ratio)
                  const y = getY(val)
                  return (
                    <g key={ratio}>
                      <line x1="36" y1={y} x2="500" y2={y} stroke="#F0ECE4" strokeWidth="1" />
                      <text x="18" y={y + 3.5} fontSize="9.5" fill="#7B8B82" textAnchor="middle">{val}</text>
                    </g>
                  )
                })}

                {chartDays.map((day, idx) => (
                  <text key={day.key} x={getX(idx)} y="152" fontSize="9.5" fill="#7B8B82" textAnchor="middle">
                    {day.label}
                  </text>
                ))}

                {chartDays.length > 0 && (
                  <>
                    <polyline
                      fill="none"
                      stroke="#2E7D32"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={foundPoints}
                    />
                    {chartDays.map((day, idx) => (
                      <circle
                        key={`f-${day.key}`}
                        cx={getX(idx)}
                        cy={getY(day.found)}
                        r="3.5"
                        fill="#FFFFFF"
                        stroke="#2E7D32"
                        strokeWidth="2"
                      />
                    ))}

                    <polyline
                      fill="none"
                      stroke="#FB8C00"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={lostPoints}
                    />
                    {chartDays.map((day, idx) => (
                      <circle
                        key={`l-${day.key}`}
                        cx={getX(idx)}
                        cy={getY(day.lost)}
                        r="3.5"
                        fill="#FFFFFF"
                        stroke="#FB8C00"
                        strokeWidth="2"
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>
          </div>

          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <Calendar size={16} />
                <span>Công việc cần xử lý</span>
              </div>
            </div>

            <div className="m01-tasks-list">
              <Link to="/staff/review" className="m01-task-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="m01-task-left">
                  <div className="m01-task-icon">
                    <FileText size={16} />
                  </div>
                  <span className="m01-task-title">Kiểm duyệt & Ẩn/Hiện tin đăng</span>
                </div>
                <div className="m01-task-right">
                  <span className="m01-task-badge">{(stats?.items?.pendingReviewCount || 0) + (stats?.items?.hiddenCount || 0)}</span>
                  <ChevronRight size={14} color="#8B9E94" />
                </div>
              </Link>

              <Link to="/staff/claims" className="m01-task-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="m01-task-left">
                  <div className="m01-task-icon">
                    <Send size={16} />
                  </div>
                  <span className="m01-task-title">Xác minh yêu cầu nhận đồ</span>
                </div>
                <div className="m01-task-right">
                  <span className="m01-task-badge">{pendingClaims.length}</span>
                  <ChevronRight size={14} color="#8B9E94" />
                </div>
              </Link>

              <Link to="/staff/handover" className="m01-task-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="m01-task-left">
                  <div className="m01-task-icon">
                    <Package size={16} />
                  </div>
                  <span className="m01-task-title">Xác nhận bàn giao đồ</span>
                </div>
                <div className="m01-task-right">
                  <span className="m01-task-badge">{pendingClaims.length}</span>
                  <ChevronRight size={14} color="#8B9E94" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="m01-two-col-grid">
          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <FileText size={16} />
                <span>{reviewQueue.length > 0 ? 'Tin cần kiểm duyệt / đang ẩn' : 'Tin đăng mới nhất'}</span>
              </div>
              <Link to="/staff/review" className="a01-card-link">
                Xem tất cả →
              </Link>
            </div>

            <div className="m01-review-list">
              {loading ? (
                <div style={{ padding: 20, fontSize: 13, color: '#67786F' }}>Đang tải dữ liệu...</div>
              ) : displayItems.length === 0 ? (
                <div style={{ padding: 20, fontSize: 13, color: '#67786F' }}>Chưa có tin đăng nào.</div>
              ) : (
                displayItems.map((item) => (
                  <div key={item.id} className="m01-review-item">
                    <img src={getItemThumbnail(item)} alt={item.title} className="m01-review-thumb" />
                    <div className="m01-review-info">
                      <div className="m01-review-headline">
                        <span className={`m01-type-badge ${item.itemType === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                          {item.itemType}
                        </span>
                        <span className="m01-review-title">{item.title}</span>
                      </div>
                      <div className="m01-review-meta">
                        <div className="m01-meta-item">
                          <MapPin size={12} />
                          <span>{item.approximateLocation}</span>
                        </div>
                        <div className="m01-meta-item">
                          <Calendar size={12} />
                          <span>{formatDateTime(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="m01-review-actions">
                      {item.publicationStatus !== 'APPROVED' && (
                        <button
                          type="button"
                          disabled={submitting}
                          className="m01-btn-approve"
                          onClick={() => handleQuickApprove(item.id)}
                        >
                          <Check size={13} />
                          Duyệt
                        </button>
                      )}
                      {item.publicationStatus !== 'HIDDEN' && (
                        <button
                          type="button"
                          disabled={submitting}
                          className="m01-btn-reject"
                          onClick={() => setRejectItemTarget(item)}
                        >
                          <X size={13} />
                          Ẩn tin
                        </button>
                      )}
                      <button
                        type="button"
                        className="m01-btn-more"
                        aria-label="Xem kiểm duyệt chi tiết"
                        onClick={() => navigate(`/staff/review?itemId=${item.id}`)}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <Send size={16} />
                <span>Yêu cầu nhận đồ chờ xác minh</span>
              </div>
              <Link to="/staff/claims" className="a01-card-link">
                Xem tất cả →
              </Link>
            </div>

            <div className="m01-claims-list">
              {loading ? (
                <div style={{ padding: 20, fontSize: 13, color: '#67786F' }}>Đang tải dữ liệu...</div>
              ) : pendingClaims.length === 0 ? (
                <div style={{ padding: 20, fontSize: 13, color: '#67786F' }}>Không có yêu cầu nào đang chờ xác minh.</div>
              ) : (
                pendingClaims.slice(0, 3).map((claim) => (
                  <div key={claim.id} className="m01-claim-item">
                    <img src={getItemThumbnail(claim.item)} alt={claim.item?.title || ''} className="m01-claim-thumb" />
                    <div className="m01-claim-info">
                      <span className="m01-claim-title">Yêu cầu: {claim.item?.title || `#${claim.itemId}`}</span>
                      <div className="m01-claim-detail">
                        <User size={12} />
                        <span>SV: {claim.claimant?.studentId || claim.claimant?.fullName}</span>
                      </div>
                      <div className="m01-claim-detail">
                        <Calendar size={12} />
                        <span>Gửi: {formatDateTime(claim.createdAt)}</span>
                      </div>
                    </div>
                    <div className="m01-claim-actions">
                      <span className="m01-claim-status-pill">{claim.status}</span>
                      <button
                        type="button"
                        className="m01-btn-verify"
                        onClick={() => navigate(`/staff/handover?claimId=${claim.id}`)}
                      >
                        Xác minh
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <ReasonDialog
        key={`staff-hide-${rejectItemTarget?.id || 'none'}`}
        open={Boolean(rejectItemTarget)}
        title={`Ẩn tin đăng #${rejectItemTarget?.id || ''}`}
        description={`Tin "${rejectItemTarget?.title || ''}" sẽ chuyển sang HIDDEN (vẫn giữ nguyên trạng thái OPEN/CLOSED).`}
        fieldLabel="Lý do ẩn tin"
        confirmLabel="Xác nhận ẩn tin"
        submitting={submitting}
        onClose={() => setRejectItemTarget(null)}
        onConfirm={handleConfirmRejectItem}
      />
    </PortalShell>
  )
}
