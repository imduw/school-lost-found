import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  Search,
  Users,
  FileText,
  Settings,
  ShieldCheck,
  RefreshCw,
  Eye,
  Lock,
  CheckCircle,
  Pencil,
  Calendar,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { useAuth } from '../../contexts/useAuth'
import { adminService } from '../../services/adminService'
import { formatShortDate, formatDateTime } from '../../utils/itemImageHelper'
import { AUDIT_ACTION_META } from '../../utils/dashboardHelper'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'
import avatarDefault from '../../assets/users/avatar-chien.png'
import './AuditLog.css'
import '../admin/AdminDashboard.css'

function RowIcon({ type }) {
  const cls =
    {
      lock: 'a04-row-icon-lock',
      update: 'a04-row-icon-update',
      verify: 'a04-row-icon-verify',
      edit: 'a04-row-icon-edit',
    }[type] || 'a04-row-icon-create'

  const Icon =
    {
      lock: Lock,
      update: RefreshCw,
      verify: CheckCircle,
      edit: Pencil,
    }[type] || ShieldCheck

  return (
    <span className={`a04-row-icon ${cls}`}>
      <Icon size={12} />
    </span>
  )
}

export default function AuditLogPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const canAccess = isAuthenticated && currentUser?.role === 'ADMIN'

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLogId, setSelectedLogId] = useState(null)

  const [keyword, setKeyword] = useState(() => searchParams.get('keyword') || '')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    adminService
      .getAuditLogs()
      .then((list) => {
        if (!cancelled) {
          setLogs(list)
          setSelectedLogId(list[0]?.id ?? null)
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

  const handleRefresh = async () => {
    setError('')
    try {
      const list = await adminService.getAuditLogs()
      setLogs(list)
    } catch (err) {
      setError(err.message)
    }
  }

  const nowMs = new Date().getTime()
  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false
    if (roleFilter !== 'ALL' && log.actor?.role !== roleFilter) return false
    if (dateRangeFilter !== 'ALL') {
      const days = dateRangeFilter === '7DAYS' ? 7 : 30
      const createdMs = new Date(log.createdAt).getTime()
      if (nowMs - createdMs > days * 86400000) return false
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      const hay = `${log.action} ${log.targetType} #${log.targetId} ${log.details || ''} ${log.actor?.fullName || ''} ${log.actor?.email || ''}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const pagedLogs = filteredLogs.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage)

  const selectedLog =
    logs.find((l) => l.id === selectedLogId) || pagedLogs[0] || filteredLogs[0] || null

  const userActionsCount = logs.filter((l) => ['UPDATE_USER_ROLE', 'UPDATE_USER_STATUS'].includes(l.action)).length
  const itemActionsCount = logs.filter((l) => ['HIDE_ITEM', 'RESTORE_ITEM', 'REJECT_ITEM'].includes(l.action)).length
  const claimActionsCount = logs.filter((l) => ['COMPLETE_HANDOVER', 'REJECT_CLAIM'].includes(l.action)).length

  return (
    <PortalShell
      portal="admin"
      activeMenu="audit"
      wrapperClass="a01-dashboard-wrapper"
      bodyClass="a04-body"
    >
      <main className="a04-main">
        <div className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <ShieldCheck size={22} className="banner-audit-icon" />
              Nhật ký hoạt động
            </h1>
            <p className="a01-banner-subtitle">
              Theo dõi và tra cứu lịch sử các thao tác kiểm duyệt, bàn giao và quản trị trong hệ thống.
            </p>
          </div>
          <img src={bannerMascot} alt="" className="a01-banner-img" />
        </div>

        {error && (
          <div role="alert" className="slf-banner-feedback slf-banner-error" style={{ marginBottom: 14 }}>
            <span>{error}</span>
          </div>
        )}

        <div className="a04-stats-row">
          <div className="a01-stat-card">
            <div className="a01-stat-icon-wrapper icon-wrap-blue">
              <FileText size={20} />
            </div>
            <div className="a01-stat-info">
              <span className="a01-stat-value">{loading ? '...' : logs.length}</span>
              <span className="a01-stat-label">Tổng nhật ký</span>
            </div>
          </div>
          <div className="a01-stat-card">
            <div className="a01-stat-icon-wrapper icon-wrap-green">
              <Users size={20} />
            </div>
            <div className="a01-stat-info">
              <span className="a01-stat-value">{loading ? '...' : userActionsCount}</span>
              <span className="a01-stat-label">Thao tác tài khoản</span>
            </div>
          </div>
          <div className="a01-stat-card">
            <div className="a01-stat-icon-wrapper icon-wrap-orange">
              <Lock size={20} />
            </div>
            <div className="a01-stat-info">
              <span className="a01-stat-value">{loading ? '...' : itemActionsCount}</span>
              <span className="a01-stat-label">Kiểm duyệt tin đăng</span>
            </div>
          </div>
          <div className="a01-stat-card">
            <div className="a01-stat-icon-wrapper icon-wrap-purple">
              <Settings size={20} />
            </div>
            <div className="a01-stat-info">
              <span className="a01-stat-value">{loading ? '...' : claimActionsCount}</span>
              <span className="a01-stat-label">Xác minh & bàn giao</span>
            </div>
          </div>
        </div>

        <div className="a04-content-grid">
          <div className="a04-left-panel">
            <search>
              <div className="a04-filter-bar">
                <div className="a04-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input
                    type="search"
                    aria-label="Tìm kiếm nhật ký hoạt động"
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
                  />
                </div>
                <select
                  aria-label="Khoảng thời gian nhật ký"
                  className="a04-dropdown-btn"
                  value={dateRangeFilter}
                  onChange={(e) => { setDateRangeFilter(e.target.value); setPage(1) }}
                >
                  <option value="ALL">Mọi thời gian</option>
                  <option value="7DAYS">7 ngày gần đây</option>
                  <option value="30DAYS">30 ngày gần đây</option>
                </select>
                <select
                  aria-label="Lọc theo hành động"
                  className="a04-dropdown-btn"
                  value={actionFilter}
                  onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
                >
                  <option value="ALL">Tất cả hành động</option>
                  <option value="HIDE_ITEM">HIDE_ITEM</option>
                  <option value="RESTORE_ITEM">RESTORE_ITEM</option>
                  <option value="REJECT_ITEM">REJECT_ITEM</option>
                  <option value="COMPLETE_HANDOVER">COMPLETE_HANDOVER</option>
                  <option value="REJECT_CLAIM">REJECT_CLAIM</option>
                  <option value="UPDATE_USER_ROLE">UPDATE_USER_ROLE</option>
                  <option value="UPDATE_USER_STATUS">UPDATE_USER_STATUS</option>
                </select>
                <select
                  aria-label="Lọc theo vai trò thực hiện"
                  className="a04-dropdown-btn"
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
                >
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MODERATOR">MODERATOR</option>
                </select>
                <button
                  type="button"
                  className="a04-refresh-btn"
                  title="Làm mới"
                  aria-label="Làm mới nhật ký"
                  onClick={handleRefresh}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </search>

            <table className="a04-table">
              <thead>
                <tr>
                  <th style={{ width: '48px' }}>#</th>
                  <th>Thời gian</th>
                  <th>Người thực hiện</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                  <th>Đối tượng</th>
                  <th>Nội dung tóm tắt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 24 }}>
                      Đang tải nhật ký hoạt động...
                    </td>
                  </tr>
                ) : pagedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 24, color: '#67786F' }}>
                      Không có bản ghi nhật ký nào khớp bộ lọc.
                    </td>
                  </tr>
                ) : (
                  pagedLogs.map((log) => {
                    const meta = AUDIT_ACTION_META[log.action] || { label: log.action, type: 'update' }
                    const timeStr = new Date(log.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                    return (
                      <tr
                        key={log.id}
                        className={selectedLog?.id === log.id ? 'a04-row-selected' : ''}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedLogId(log.id)}
                      >
                        <td>
                          <div className="a04-idx-cell">
                            <RowIcon type={meta.type} />
                            {log.id}
                          </div>
                        </td>
                        <td>
                          <div className="a04-time-cell">
                            <span className="a04-date-txt">{formatShortDate(log.createdAt)}</span>
                            <span className="a04-time-txt">{timeStr}</span>
                          </div>
                        </td>
                        <td>
                          <div className="a04-actor-cell">
                            <img src={avatarDefault} alt={log.actor?.fullName || ''} className="a04-actor-avatar" />
                            <span className="a04-actor-name">{log.actor?.fullName}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`a04-role-pill ${log.actor?.role === 'ADMIN' ? 'role-admin-pill' : 'role-mod-pill'}`}>
                            {log.actor?.role}
                          </span>
                        </td>
                        <td><span className="a04-action-txt">{meta.label}</span></td>
                        <td><span className="a04-target-txt">{log.targetType}#{log.targetId}</span></td>
                        <td><span className="a04-summary-txt">{log.details}</span></td>
                        <td>
                          <button
                            type="button"
                            className="a04-view-btn"
                            title="Xem chi tiết"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLogId(log.id)
                            }}
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            <div className="a04-pagination-bar">
              <span>
                Hiển thị {filteredLogs.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1} –{' '}
                {Math.min(safePage * rowsPerPage, filteredLogs.length)} trong {filteredLogs.length} nhật ký
              </span>
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
              <div className="a04-page-rows-select">
                Số dòng:
                <select
                  aria-label="Số dòng nhật ký mỗi trang"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>

          <div className="a04-right-panel">
            {!selectedLog ? (
              <div className="a04-detail-card" style={{ textAlign: 'center', padding: 32, color: '#67786F' }}>
                Chọn một dòng nhật ký bên trái để xem thông tin chi tiết.
              </div>
            ) : (
              <div className="a04-detail-card">
                <div className="a04-card-sec-title">
                  <FileText size={16} />
                  Chi tiết nhật ký
                </div>

                <div className="a04-detail-fields">
                  <div className="a04-field-row">
                    <span className="a04-field-label">
                      <FileText size={13} color="#8B9E94" />
                      Mã nhật ký:
                    </span>
                    <span className="a04-field-value-code">LOG-{selectedLog.id}</span>
                  </div>
                  <div className="a04-field-row">
                    <span className="a04-field-label">
                      <Calendar size={13} color="#8B9E94" />
                      Thời gian:
                    </span>
                    <span className="a04-field-value">{formatDateTime(selectedLog.createdAt)}</span>
                  </div>
                  <div className="a04-field-row" style={{ alignItems: 'center' }}>
                    <span className="a04-field-label">
                      <Users size={13} color="#8B9E94" />
                      Người thực hiện:
                    </span>
                    <div className="a04-detail-actor">
                      <div className="a04-detail-actor-info">
                        <span className="a04-detail-actor-name">{selectedLog.actor?.fullName}</span>
                        <span className="a04-detail-actor-email">({selectedLog.actor?.email})</span>
                      </div>
                      <img src={avatarDefault} alt={selectedLog.actor?.fullName || ''} className="a04-detail-actor-avatar" />
                    </div>
                  </div>
                  <div className="a04-field-row">
                    <span className="a04-field-label">
                      <ShieldCheck size={13} color="#8B9E94" />
                      Vai trò:
                    </span>
                    <span className={`a04-role-pill ${selectedLog.actor?.role === 'ADMIN' ? 'role-admin-pill' : 'role-mod-pill'}`}>
                      {selectedLog.actor?.role}
                    </span>
                  </div>
                </div>

                <hr className="a04-section-divider" />

                <div className="a04-action-info-title">
                  <Settings size={15} />
                  Thông tin hành động
                </div>

                <div className="a04-action-detail-block">
                  <div className="a04-action-detail-row">
                    <span className="a04-action-detail-label">Hành động:</span>
                    <span className="a04-action-detail-value">
                      {(AUDIT_ACTION_META[selectedLog.action]?.label || selectedLog.action)} ({selectedLog.action})
                    </span>
                  </div>
                  <div className="a04-action-detail-row">
                    <span className="a04-action-detail-label">Đối tượng:</span>
                    <span className="a04-action-detail-value">
                      {selectedLog.targetType} #{selectedLog.targetId}
                    </span>
                  </div>
                  {selectedLog.ipAddress && (
                    <div className="a04-action-detail-row">
                      <span className="a04-action-detail-label">Địa chỉ IP:</span>
                      <span className="a04-action-detail-value">{selectedLog.ipAddress}</span>
                    </div>
                  )}
                  <div className="a04-action-detail-row">
                    <span className="a04-action-detail-label">Nội dung chi tiết:</span>
                  </div>
                  <div className="a04-full-detail-box">
                    {selectedLog.details || 'Không có mô tả bổ sung.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </PortalShell>
  )
}
