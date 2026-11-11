import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Search,
  Crown,
  Users,
  ShieldCheck,
  GraduationCap,
  RotateCw,
  Pencil,
  Lock,
  Unlock,
  Mail,
  User,
  Calendar,
  Clock,
  UserCheck,
  Info as InfoIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { ConfirmDialog } from '../../components/ActionDialogs'
import { useAuth } from '../../contexts/useAuth'
import { adminService } from '../../services/adminService'
import { formatShortDate, formatDateTime } from '../../utils/itemImageHelper'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'
import avatarDetailDefault from '../../assets/users/avatar-detail-chien.png'
import './AdminDashboard.css'
import './UserManagement.css'

const ROLE_PILL_CLASS = {
  USER: 'role-student',
  MODERATOR: 'role-moderator',
  ADMIN: 'role-admin',
}

export default function UserManagementPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const canAccess = isAuthenticated && currentUser?.role === 'ADMIN'

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [draftRole, setDraftRole] = useState('USER')

  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [statusDialogUser, setStatusDialogUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    adminService
      .getUsers()
      .then((list) => {
        if (!cancelled) {
          setUsers(list)
          const first = list[0] || null
          if (first) {
            setSelectedUserId(first.id)
            setDraftRole(first.role)
          }
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

  const handleRefresh = async () => {
    setFeedback({ type: '', text: '' })
    try {
      const list = await adminService.getUsers()
      setUsers(list)
      setFeedback({ type: 'success', text: 'Đã làm mới danh sách tài khoản.' })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    }
  }

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      const hay = `${u.fullName} ${u.email} ${u.studentId || ''} ${u.phone || ''}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const pagedUsers = filteredUsers.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage)

  const selectedUser =
    users.find((u) => u.id === selectedUserId) || pagedUsers[0] || filteredUsers[0] || null

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id)
    setDraftRole(user.role)
    setFeedback({ type: '', text: '' })
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await adminService.updateUserRole(selectedUser.id, draftRole)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)))
      setFeedback({
        type: 'success',
        text: `Đã cập nhật vai trò của ${updated.fullName} thành ${updated.role}.`,
      })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmToggleStatus = async () => {
    if (!statusDialogUser) return
    const nextStatus = statusDialogUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await adminService.updateUserStatus(statusDialogUser.id, nextStatus)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)))
      setStatusDialogUser(null)
      setFeedback({
        type: 'success',
        text: `Đã ${nextStatus === 'SUSPENDED' ? 'tạm khóa' : 'mở khóa'} tài khoản ${updated.fullName}.`,
      })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const totalUsersCount = users.length
  const studentCount = users.filter((u) => u.role === 'USER').length
  const modCount = users.filter((u) => u.role === 'MODERATOR').length
  const adminCount = users.filter((u) => u.role === 'ADMIN').length
  const pct = (count) => (totalUsersCount > 0 ? `(${((count / totalUsersCount) * 100).toFixed(1)}%)` : '(0%)')

  const statCards = [
    {
      id: 'total-users',
      value: loading ? '...' : totalUsersCount,
      label: 'Tổng người dùng',
      sub: null,
      iconClass: 'icon-wrap-green',
      Icon: Users,
    },
    {
      id: 'students',
      value: loading ? '...' : studentCount,
      label: 'Sinh viên (USER)',
      sub: pct(studentCount),
      iconClass: 'icon-wrap-blue',
      Icon: GraduationCap,
    },
    {
      id: 'moderators',
      value: loading ? '...' : modCount,
      label: 'Cán bộ hỗ trợ',
      sub: pct(modCount),
      iconClass: 'icon-wrap-orange',
      Icon: ShieldCheck,
    },
    {
      id: 'admins',
      value: loading ? '...' : adminCount,
      label: 'Quản trị viên',
      sub: pct(adminCount),
      iconClass: 'icon-wrap-purple',
      Icon: Crown,
    },
  ]

  return (
    <PortalShell
      portal="admin"
      activeMenu="users"
      wrapperClass="a02-page-wrapper"
      bodyClass="a02-body"
    >
      <main className="a02-main">
        <section className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <Users size={22} className="banner-users-icon" />
              <span>Quản lý người dùng</span>
            </h1>
            <p className="a01-banner-subtitle">
              Quản lý tài khoản, phân quyền (USER / MODERATOR / ADMIN) và khóa/mở khóa quyền truy cập hệ thống.
            </p>
          </div>
          <img src={bannerMascot} alt="Mascot Miu & Thư viện" className="a01-banner-img" />
        </section>

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

        <section className="a02-stats-row">
          {statCards.map((card) => {
            const Icon = card.Icon
            return (
              <div key={card.id} className="a01-stat-card">
                <div className={`a01-stat-icon-wrapper ${card.iconClass}`}>
                  <Icon size={22} />
                </div>
                <div className="a01-stat-info">
                  <span className="a01-stat-value">{card.value}</span>
                  <span className="a01-stat-label">
                    {card.label}
                    {card.sub && <span className="a02-stat-sub">{card.sub}</span>}
                  </span>
                </div>
              </div>
            )
          })}
        </section>

        <div className="a02-content-grid">
          <div className="a02-left-panel">
            <search>
              <div className="a02-filter-bar">
                <div className="a02-search-box">
                  <Search size={15} />
                  <input
                    type="search"
                    aria-label="Tìm kiếm tài khoản"
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
                  />
                </div>

                <select
                  aria-label="Lọc theo vai trò"
                  className="a02-dropdown-btn"
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
                >
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="USER">USER (Sinh viên)</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                <select
                  aria-label="Lọc theo trạng thái"
                  className="a02-dropdown-btn"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                  <option value="SUSPENDED">Đã khóa (SUSPENDED)</option>
                </select>

                <button
                  type="button"
                  className="a02-refresh-btn"
                  title="Làm mới"
                  aria-label="Làm mới danh sách người dùng"
                  onClick={handleRefresh}
                >
                  <RotateCw size={15} />
                </button>
              </div>
            </search>

            <table className="a02-table">
              <thead>
                <tr>
                  <th style={{ width: '24px' }}>#</th>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th style={{ width: '105px' }}>Vai trò</th>
                  <th style={{ width: '105px' }}>Trạng thái</th>
                  <th style={{ width: '85px' }}>Ngày tạo</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>
                      Đang tải danh sách tài khoản...
                    </td>
                  </tr>
                ) : pagedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: '#67786F' }}>
                      Không tìm thấy tài khoản nào khớp bộ lọc.
                    </td>
                  </tr>
                ) : (
                  pagedUsers.map((user) => {
                    const isLocked = user.status === 'SUSPENDED'
                    return (
                      <tr
                        key={user.id}
                        style={{
                          backgroundColor: selectedUser?.id === user.id ? '#FAF8F5' : 'transparent',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleSelectUser(user)}
                      >
                        <td style={{ color: '#7B8B82' }}>{user.id}</td>
                        <td>
                          <div className="a02-user-cell">
                            <img src={avatarDetailDefault} alt="" className="a02-user-avatar" />
                            <div className="a02-user-names">
                              <span className="a02-name-txt">{user.fullName}</span>
                              {user.studentId && <span className="a02-id-txt">{user.studentId}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="a02-email-txt">{user.email}</td>
                        <td>
                          <span className={`a02-role-pill ${ROLE_PILL_CLASS[user.role] || 'role-student'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`a02-status-txt ${isLocked ? 'status-locked-txt' : 'status-active-txt'}`}>
                            <span className={isLocked ? 'a02-status-dot-red' : 'a02-status-dot-green'} />
                            <span>{isLocked ? 'Đã khóa' : 'Hoạt động'}</span>
                          </span>
                        </td>
                        <td className="a02-date-txt">{formatShortDate(user.createdAt)}</td>
                        <td>
                          <div className="a02-actions-cell">
                            <button
                              type="button"
                              className="a02-action-btn"
                              title="Chọn để chỉnh sửa"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectUser(user)
                              }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              className={`a02-action-btn ${isLocked ? 'a02-action-unlock' : ''}`}
                              title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                              onClick={(e) => {
                                e.stopPropagation()
                                setStatusDialogUser(user)
                              }}
                            >
                              {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            <div className="a02-pagination-bar">
              <span>
                Hiển thị {filteredUsers.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1} –{' '}
                {Math.min(safePage * rowsPerPage, filteredUsers.length)} trong {filteredUsers.length} tài khoản
              </span>

              <div className="a02-pagination-controls">
                <button
                  type="button"
                  className="a02-page-btn"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`a02-page-btn ${safePage === num ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="a02-page-btn"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="a02-page-rows-select">
                <span>Số dòng:</span>
                <select
                  aria-label="Số dòng mỗi trang"
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

          <div className="a02-right-panel">
            {!selectedUser ? (
              <div className="a02-detail-card" style={{ textAlign: 'center', padding: 32, color: '#67786F' }}>
                Chọn một tài khoản trong bảng để xem chi tiết và thao tác phân quyền.
              </div>
            ) : (
              <>
                <div className="a02-detail-card">
                  <div className="a02-card-sec-title">
                    <ClipboardList size={16} />
                    <span>Thông tin người dùng</span>
                  </div>

                  <div className="a02-detail-profile-center">
                    <img src={avatarDetailDefault} alt="" className="a02-detail-avatar-lg" />
                    <span className="a02-detail-name">{selectedUser.fullName}</span>
                    <span className="a02-detail-status-pill">
                      <span className={selectedUser.status === 'ACTIVE' ? 'a02-status-dot-green' : 'a02-status-dot-red'} />
                      <span>{selectedUser.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}</span>
                    </span>
                  </div>

                  <div className="a02-detail-fields">
                    <div className="a02-field-row">
                      <span className="a02-field-label">
                        <User size={13} />
                        <span>Mã sinh viên:</span>
                      </span>
                      <span className="a02-field-value">{selectedUser.studentId || 'Không có'}</span>
                    </div>

                    <div className="a02-field-row">
                      <span className="a02-field-label">
                        <Mail size={13} />
                        <span>Email:</span>
                      </span>
                      <span className="a02-field-value">{selectedUser.email}</span>
                    </div>

                    <div className="a02-field-row">
                      <label htmlFor="admin-user-role-select" className="a02-field-label">
                        <User size={13} />
                        <span>Vai trò:</span>
                      </label>
                      <select
                        id="admin-user-role-select"
                        className="a02-role-select-pill"
                        value={draftRole}
                        onChange={(e) => setDraftRole(e.target.value)}
                      >
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>

                    <div className="a02-field-row">
                      <span className="a02-field-label">
                        <Calendar size={13} />
                        <span>Ngày tạo:</span>
                      </span>
                      <span className="a02-field-value">{formatDateTime(selectedUser.createdAt)}</span>
                    </div>

                    <div className="a02-field-row">
                      <span className="a02-field-label">
                        <Clock size={13} />
                        <span>Cập nhật lần cuối:</span>
                      </span>
                      <span className="a02-field-value">{formatDateTime(selectedUser.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="a02-detail-card">
                  <div className="a02-card-sec-title">
                    <ShieldCheck size={16} />
                    <span>Thao tác quản trị</span>
                  </div>

                  <div className="a02-admin-actions-grid">
                    <button
                      type="button"
                      disabled={submitting}
                      className="a02-admin-btn admin-btn-role"
                      onClick={handleUpdateRole}
                    >
                      <UserCheck size={18} />
                      <span>Lưu vai trò ({draftRole})</span>
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      className="a02-admin-btn admin-btn-lock"
                      onClick={() => setStatusDialogUser(selectedUser)}
                    >
                      {selectedUser.status === 'ACTIVE' ? <Lock size={18} /> : <Unlock size={18} />}
                      <span>{selectedUser.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}</span>
                    </button>

                    <button
                      type="button"
                      className="a02-admin-btn"
                      style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1' }}
                      onClick={() => navigate(`/admin/audit?keyword=${encodeURIComponent(selectedUser.fullName)}`)}
                    >
                      <ShieldCheck size={18} />
                      <span>Xem nhật ký</span>
                    </button>
                  </div>
                </div>

                <div className="a02-notice-card">
                  <div className="a02-notice-title">
                    <InfoIcon size={15} />
                    <span>Lưu ý bảo mật</span>
                  </div>
                  <div className="a02-notice-list">
                    <p>• Hệ thống không cho phép ADMIN tự hạ quyền hoặc tự khóa chính mình.</p>
                    <p>• Mọi thay đổi vai trò/trạng thái đều tự động lưu vào Audit Log.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(statusDialogUser)}
        title={statusDialogUser?.status === 'ACTIVE' ? 'Xác nhận tạm khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
        message={
          statusDialogUser?.status === 'ACTIVE'
            ? `Bạn chắc chắn muốn tạm khóa tài khoản "${statusDialogUser?.fullName}" (${statusDialogUser?.email})? Người dùng này sẽ không thể đăng nhập.`
            : `Mở khóa lại quyền truy cập cho "${statusDialogUser?.fullName}" (${statusDialogUser?.email})?`
        }
        confirmLabel={statusDialogUser?.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
        danger={statusDialogUser?.status === 'ACTIVE'}
        submitting={submitting}
        onClose={() => setStatusDialogUser(null)}
        onConfirm={handleConfirmToggleStatus}
      />
    </PortalShell>
  )
}
