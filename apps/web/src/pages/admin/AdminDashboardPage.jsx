import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Users,
  FileText,
  Send,
  Layers,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
  EyeOff,
  PackageCheck,
  Check,
  Eye,
  Crown,
  RefreshCw,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { useAuth } from '../../contexts/useAuth'
import { adminService } from '../../services/adminService'
import { itemService } from '../../services/itemService'
import { getItemThumbnail, formatDateTime } from '../../utils/itemImageHelper'
import {
  AUDIT_ACTION_META,
  PUBLICATION_BADGE_MAP,
  buildDailyItemSeries,
} from '../../utils/dashboardHelper'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'
import './AdminDashboard.css'

const CIRCUMFERENCE = 2 * Math.PI * 36 // 226.19

export default function AdminDashboardPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const canAccess = isAuthenticated && currentUser?.role === 'ADMIN'

  const [stats, setStats] = useState(null)
  const [categories, setCategories] = useState([])
  const [recentItems, setRecentItems] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chartRange, setChartRange] = useState('7-days')

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    Promise.all([
      adminService.getStats(),
      adminService.getCategories(),
      itemService.getItems(),
      adminService.getAuditLogs(),
    ])
      .then(([statsData, categoriesData, itemsData, logsData]) => {
        if (!cancelled) {
          setStats(statsData)
          setCategories(categoriesData)
          setRecentItems(itemsData)
          setAuditLogs(logsData)
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [canAccess])

  const series = buildDailyItemSeries(recentItems, chartRange === '30-days' ? 30 : 7)
  const maxVal = Math.max(4, ...series.map((d) => Math.max(d.found, d.lost)))
  const toY = (v) => 116 - (v / maxVal) * 96
  const toX = (i) => 35 + i * 65

  const chartPointsFound = series.map((d, i) => ({ x: toX(i), y: toY(d.found) }))
  const chartPointsLost = series.map((d, i) => ({ x: toX(i), y: toY(d.lost) }))

  const makeSmoothPath = (pts) => {
    if (pts.length === 0) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i += 1) {
      const p0 = pts[i]
      const p1 = pts[i + 1]
      const mx = (p0.x + p1.x) / 2
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`
    }
    return d
  }

  const totalClaims = stats?.claims?.total || 0
  const acceptedCount = stats?.claims?.acceptedCount || 0
  const rejectedCount = stats?.claims?.rejectedCount || 0
  const pendingCount = stats?.claims?.pendingCount || 0

  const accLen = totalClaims > 0 ? (acceptedCount / totalClaims) * CIRCUMFERENCE : 0
  const rejLen = totalClaims > 0 ? (rejectedCount / totalClaims) * CIRCUMFERENCE : 0
  const penLen = totalClaims > 0 ? (pendingCount / totalClaims) * CIRCUMFERENCE : 0

  const pct = (val) => (totalClaims > 0 ? `${((val / totalClaims) * 100).toFixed(1)}%` : '0%')

  const statCards = [
    {
      id: 'users-count',
      value: loading ? '...' : stats?.users?.total ?? 0,
      label: 'Tài khoản người dùng',
      subText: `${stats?.users?.active ?? 0} đang hoạt động`,
      trendClass: 'trend-green',
      iconClass: 'icon-wrap-green',
      Icon: Users,
    },
    {
      id: 'items-count',
      value: loading ? '...' : stats?.items?.total ?? 0,
      label: 'Tin đăng',
      subText: `${stats?.items?.openCount ?? 0} đang mở`,
      trendClass: 'trend-green',
      iconClass: 'icon-wrap-blue',
      Icon: FileText,
    },
    {
      id: 'claims-count',
      value: loading ? '...' : stats?.claims?.total ?? 0,
      label: 'Yêu cầu nhận đồ',
      subText: `${stats?.handoversTotal ?? 0} đã bàn giao`,
      trendClass: 'trend-green',
      iconClass: 'icon-wrap-orange',
      Icon: Send,
    },
    {
      id: 'categories-count',
      value: loading ? '...' : categories.length,
      label: 'Danh mục tin',
      subText: `${categories.filter((c) => c.isActive).length} đang hiển thị`,
      trendClass: 'trend-purple',
      iconClass: 'icon-wrap-purple',
      Icon: Layers,
    },
  ]

  const getActivityIcon = (action) => {
    switch (action) {
      case 'HIDE_ITEM':
      case 'REJECT_ITEM':
      case 'REJECT_CLAIM':
        return EyeOff
      case 'COMPLETE_HANDOVER':
        return PackageCheck
      case 'UPDATE_USER_ROLE':
      case 'UPDATE_USER_STATUS':
        return RefreshCw
      default:
        return CheckCircle
    }
  }

  return (
    <PortalShell
      portal="admin"
      activeMenu="overview"
      wrapperClass="a01-dashboard-wrapper"
      bodyClass="a01-body"
      pendingCount={pendingCount + (stats?.items?.pendingReviewCount || 0)}
    >
      <main className="a01-main">
        <section className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <Crown size={22} className="banner-crown" />
              <span>Trang tổng quan quản trị</span>
            </h1>
            <p className="a01-banner-subtitle">
              Theo dõi hoạt động, quản lý người dùng và vận hành hệ thống School Lost &amp; Found theo dữ liệu thời gian thực.
            </p>
          </div>
          <img src={bannerMascot} alt="Mascot Miu & Thư viện" className="a01-banner-img" />
        </section>

        {error && (
          <div role="alert" className="slf-banner-feedback slf-banner-error" style={{ marginBottom: 16 }}>
            <span>{error}</span>
          </div>
        )}

        <section className="a01-stats-row">
          {statCards.map((card) => {
            const Icon = card.Icon
            return (
              <div key={card.id} className="a01-stat-card">
                <div className={`a01-stat-icon-wrapper ${card.iconClass}`}>
                  <Icon size={22} />
                </div>
                <div className="a01-stat-info">
                  <span className="a01-stat-value">{card.value}</span>
                  <span className="a01-stat-label">{card.label}</span>
                  <span className={`a01-stat-trend ${card.trendClass}`}>
                    <span className="trend-subtext">{card.subText}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </section>

        <section className="a01-two-col-grid">
          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <TrendingUp size={18} />
                <span>Thống kê tin đăng theo thời gian</span>
              </div>
              <select
                aria-label="Chọn khoảng thời gian"
                className="a01-filter-select"
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
              >
                <option value="7-days">7 ngày qua</option>
                <option value="30-days">30 ngày qua</option>
              </select>
            </div>

            <div className="a01-chart-container">
              <div className="a01-chart-legend">
                <div className="legend-item">
                  <span className="legend-dot-found" />
                  <span>FOUND (Nhặt được)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot-lost" />
                  <span>LOST (Báo mất)</span>
                </div>
              </div>

              <svg viewBox="0 0 460 145" className="a01-svg-chart" aria-label="Biểu đồ tin đăng">
                {[0, 0.25, 0.5, 0.75, 1].map((r) => {
                  const val = Math.round(maxVal * r)
                  const gy = toY(val)
                  return (
                    <g key={r}>
                      <line x1="30" y1={gy} x2="450" y2={gy} stroke="#F0ECE4" strokeWidth="1" />
                      <text x="8" y={gy + 4} fontSize="10" fill="#8B9E94">{val}</text>
                    </g>
                  )
                })}

                {series.map((bucket, idx) => (
                  <text
                    key={bucket.key}
                    x={toX(idx)}
                    y="138"
                    fontSize="10"
                    fill="#8B9E94"
                    textAnchor="middle"
                  >
                    {bucket.label}
                  </text>
                ))}

                {chartPointsLost.length > 0 && (
                  <path d={makeSmoothPath(chartPointsLost)} fill="none" stroke="#FB8C00" strokeWidth="2.2" />
                )}
                {chartPointsFound.length > 0 && (
                  <path d={makeSmoothPath(chartPointsFound)} fill="none" stroke="#2E7D32" strokeWidth="2.2" />
                )}

                {chartPointsLost.map((p, idx) => (
                  <circle key={`lost-${series[idx].key}`} cx={p.x} cy={p.y} r="3.5" fill="#FB8C00" />
                ))}
                {chartPointsFound.map((p, idx) => (
                  <circle key={`found-${series[idx].key}`} cx={p.x} cy={p.y} r="3.5" fill="#2E7D32" />
                ))}
              </svg>
            </div>
          </div>

          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <Clock size={18} />
                <span>Tình trạng xử lý yêu cầu</span>
              </div>
            </div>

            <div className="a01-donut-layout">
              <div className="a01-donut-svg-wrapper">
                <svg viewBox="0 0 100 100" width="100%" height="100%" aria-label="Tỷ lệ trạng thái yêu cầu">
                  {totalClaims === 0 ? (
                    <circle cx="50" cy="50" r="36" fill="none" stroke="#EAECEB" strokeWidth="12" />
                  ) : (
                    <>
                      <circle
                        cx="50"
                        cy="50"
                        r="36"
                        fill="none"
                        stroke="#43A047"
                        strokeWidth="12"
                        strokeDasharray={`${accLen} ${CIRCUMFERENCE}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="36"
                        fill="none"
                        stroke="#E57373"
                        strokeWidth="12"
                        strokeDasharray={`${rejLen} ${CIRCUMFERENCE}`}
                        strokeDashoffset={-accLen}
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="36"
                        fill="none"
                        stroke="#FDD835"
                        strokeWidth="12"
                        strokeDasharray={`${penLen} ${CIRCUMFERENCE}`}
                        strokeDashoffset={-(accLen + rejLen)}
                        transform="rotate(-90 50 50)"
                      />
                    </>
                  )}
                </svg>
                <div className="a01-donut-center-text">
                  <div className="donut-center-val">{totalClaims}</div>
                  <div className="donut-center-sub">Yêu cầu</div>
                </div>
              </div>

              <div className="a01-donut-legend">
                <div className="donut-legend-row">
                  <span className="donut-legend-label">
                    <span className="donut-dot-pending" />
                    <span>PENDING – {pct(pendingCount)}</span>
                  </span>
                  <span className="donut-legend-val">{pendingCount}</span>
                </div>

                <div className="donut-legend-row">
                  <span className="donut-legend-label">
                    <span className="donut-dot-accepted" />
                    <span>ACCEPTED – {pct(acceptedCount)}</span>
                  </span>
                  <span className="donut-legend-val">{acceptedCount}</span>
                </div>

                <div className="donut-legend-row">
                  <span className="donut-legend-label">
                    <span className="donut-dot-rejected" />
                    <span>REJECTED – {pct(rejectedCount)}</span>
                  </span>
                  <span className="donut-legend-val">{rejectedCount}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="a01-bottom-grid">
          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <FileText size={18} />
                <span>Tin đăng mới nhất</span>
              </div>
              <Link to="/staff/review" className="a01-card-link">
                <span>Xem tất cả</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <table className="a01-table">
              <thead>
                <tr>
                  <th style={{ width: '24px' }}>#</th>
                  <th>Tiêu đề</th>
                  <th style={{ width: '60px' }}>Loại</th>
                  <th>Người đăng</th>
                  <th>Thời gian</th>
                  <th style={{ width: '96px' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.slice(0, 5).map((item) => {
                  const badge = PUBLICATION_BADGE_MAP[item.publicationStatus] || PUBLICATION_BADGE_MAP.APPROVED
                  const StatusIcon =
                    item.publicationStatus === 'APPROVED'
                      ? Check
                      : item.publicationStatus === 'PENDING_REVIEW'
                        ? Clock
                        : Eye
                  return (
                    <tr key={item.id}>
                      <td style={{ color: '#7B8B82' }}>{item.id}</td>
                      <td>
                        <Link to={`/items/${item.id}`} className="a01-item-cell" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <img src={getItemThumbnail(item)} alt="" className="a01-thumb-img" />
                          <span className="a01-item-title">{item.title}</span>
                        </Link>
                      </td>
                      <td>
                        <span className={`a01-badge-type ${item.itemType === 'FOUND' ? 'badge-found' : 'badge-lost'}`}>
                          {item.itemType}
                        </span>
                      </td>
                      <td className="a01-user-code">{item.author?.studentId || item.author?.fullName}</td>
                      <td className="a01-time-col">{formatDateTime(item.createdAt)}</td>
                      <td>
                        <span className={`a01-status-pill ${badge.cls}`}>
                          <StatusIcon size={12} />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="a01-card">
            <div className="a01-card-header">
              <div className="a01-card-title">
                <Clock size={18} />
                <span>Hoạt động gần đây</span>
              </div>
              <Link to="/admin/audit" className="a01-card-link">
                <span>Xem tất cả</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="a01-activity-list">
              {auditLogs.length === 0 ? (
                <div style={{ padding: 16, fontSize: 13, color: '#67786F' }}>Chưa có nhật ký hoạt động nào.</div>
              ) : (
                auditLogs.slice(0, 5).map((log) => {
                  const meta = AUDIT_ACTION_META[log.action] || { label: log.action, badge: 'green' }
                  const Icon = getActivityIcon(log.action)
                  return (
                    <div key={log.id} className="a01-activity-item">
                      <div className={`a01-activity-icon ${meta.badge === 'green' ? 'act-icon-green' : 'act-icon-red'}`}>
                        <Icon size={14} />
                      </div>
                      <div className="a01-activity-content">
                        <span className="a01-activity-text">
                          {meta.label} ({log.targetType} #{log.targetId})
                        </span>
                        <span className="a01-activity-meta">
                          Bởi: {log.actor?.fullName} · {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>
      </main>
    </PortalShell>
  )
}
