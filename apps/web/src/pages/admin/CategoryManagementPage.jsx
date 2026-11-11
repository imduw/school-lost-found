import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Search,
  LayoutGrid,
  Layers,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
  X,
  Check,
  Info,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell'
import { useAuth } from '../../contexts/useAuth'
import { adminService } from '../../services/adminService'
import bannerMascot from '../../assets/dashboard/banner-campus-mascot.png'
import '../admin/AdminDashboard.css'
import './CategoryManagement.css'

const PAGE_SIZE = 8

function inferCategoryVisual(slug = '') {
  if (slug.includes('vi')) return { iconColor: 'cat-icon-brown', iconType: 'wallet' }
  if (slug.includes('dien-tu') || slug.includes('dien-thoai')) return { iconColor: 'cat-icon-cyan', iconType: 'electronics' }
  if (slug.includes('balo') || slug.includes('tui')) return { iconColor: 'cat-icon-purple', iconType: 'backpack' }
  if (slug.includes('sach') || slug.includes('tai-lieu')) return { iconColor: 'cat-icon-teal', iconType: 'book' }
  if (slug.includes('the') || slug.includes('giay-to')) return { iconColor: 'cat-icon-red', iconType: 'card' }
  if (slug.includes('ca-nhan')) return { iconColor: 'cat-icon-pink', iconType: 'personal' }
  return { iconColor: 'cat-icon-grey', iconType: 'other' }
}

function CategoryIcon({ type }) {
  switch (type) {
    case 'wallet':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      )
    case 'backpack':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
        </svg>
      )
    case 'book':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      )
    case 'card':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      )
    case 'electronics':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )
    case 'personal':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        </svg>
      )
    default:
      return <LayoutGrid size={16} />
  }
}

export default function CategoryManagementPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const canAccess = isAuthenticated && currentUser?.role === 'ADMIN'

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [mode, setMode] = useState('edit') // 'edit' | 'create'

  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formActive, setFormActive] = useState(true)

  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('oldest')
  const [page, setPage] = useState(1)

  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  const loadCategoryIntoForm = (cat) => {
    if (!cat) return
    setSelectedCatId(cat.id)
    setMode('edit')
    setFormName(cat.name || '')
    setFormSlug(cat.slug || '')
    setFormDesc(cat.description || '')
    setFormActive(Boolean(cat.isActive))
  }

  useEffect(() => {
    if (!canAccess) return
    let cancelled = false

    adminService
      .getCategories()
      .then((list) => {
        if (!cancelled) {
          setCategories(list)
          if (list[0]) {
            setSelectedCatId(list[0].id)
            setFormName(list[0].name || '')
            setFormSlug(list[0].slug || '')
            setFormDesc(list[0].description || '')
            setFormActive(Boolean(list[0].isActive))
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
      const list = await adminService.getCategories()
      setCategories(list)
      setFeedback({ type: 'success', text: 'Đã làm mới danh sách danh mục.' })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    }
  }

  const handleStartCreate = () => {
    setMode('create')
    setSelectedCatId(null)
    setFormName('')
    setFormSlug('')
    setFormDesc('')
    setFormActive(true)
    setFeedback({ type: '', text: '' })
  }

  const handleCancelForm = () => {
    setFeedback({ type: '', text: '' })
    if (mode === 'create') {
      const fallback = categories[0]
      if (fallback) loadCategoryIntoForm(fallback)
    } else {
      const cur = categories.find((c) => c.id === selectedCatId)
      if (cur) loadCategoryIntoForm(cur)
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!formName.trim()) {
      setFeedback({ type: 'error', text: 'Vui lòng nhập tên danh mục.' })
      return
    }

    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      if (mode === 'create') {
        const created = await adminService.createCategory({
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDesc.trim(),
          isActive: formActive,
        })
        const refreshed = await adminService.getCategories()
        setCategories(refreshed)
        const target = refreshed.find((c) => c.id === created.id) || { ...created, itemCount: 0 }
        loadCategoryIntoForm(target)
        setFeedback({ type: 'success', text: `Đã thêm danh mục "${created.name}".` })
      } else if (selectedCatId) {
        const updated = await adminService.updateCategory(selectedCatId, {
          name: formName.trim(),
          slug: formSlug.trim() || undefined,
          description: formDesc.trim(),
          isActive: formActive,
        })
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
        )
        setFeedback({ type: 'success', text: `Đã lưu thay đổi cho danh mục "${updated.name}".` })
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickToggleStatus = async (cat) => {
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      const updated = await adminService.updateCategory(cat.id, {
        isActive: !cat.isActive,
      })
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
      )
      if (selectedCatId === updated.id) {
        setFormActive(Boolean(updated.isActive))
      }
      setFeedback({
        type: 'success',
        text: `Đã chuyển danh mục "${updated.name}" sang trạng thái ${updated.isActive ? 'Hiển thị' : 'Ẩn'}.`,
      })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCategories = categories
    .filter((cat) => {
      if (statusFilter === 'ACTIVE' && !cat.isActive) return false
      if (statusFilter === 'HIDDEN' && cat.isActive) return false
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase()
        const hay = `${cat.name} ${cat.slug} ${cat.description || ''}`.toLowerCase()
        if (!hay.includes(kw)) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortOrder === 'most_items') return (b.itemCount || 0) - (a.itemCount || 0)
      if (sortOrder === 'newest') return b.id - a.id
      return a.id - b.id
    })

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedCategories = filteredCategories.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const visibleCount = categories.filter((c) => c.isActive).length
  const hiddenCount = categories.length - visibleCount

  return (
    <PortalShell
      portal="admin"
      activeMenu="categories"
      wrapperClass="a01-dashboard-wrapper"
      bodyClass="a03-body"
    >
      <main className="a03-main">
        <div className="a01-banner-card">
          <div className="a01-banner-text">
            <h1 className="a01-banner-title">
              <LayoutGrid size={22} className="banner-category-icon" />
              Quản lý danh mục
            </h1>
            <p className="a01-banner-subtitle">
              Quản lý các danh mục đồ vật (ví, điện thoại, balo, sách, ...) trên Supabase.
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

        <div className="a03-stats-row">
          <div className="a01-stat-card">
            <div className="a01-stat-icon-wrapper icon-wrap-green">
              <Layers size={20} />
            </div>
            <div className="a01-stat-info">
              <span className="a01-stat-value">{loading ? '...' : categories.length}</span>
              <span className="a01-stat-label">Tổng danh mục</span>
            </div>
          </div>
          <div className="a01-stat-card">
            <div className="a01-stat-icon-wrapper icon-wrap-blue">
              <Eye size={20} />
            </div>
            <div className="a01-stat-info">
              <span className="a01-stat-value">{loading ? '...' : visibleCount}</span>
              <span className="a01-stat-label">Đang hiển thị</span>
            </div>
          </div>
          <div className="a01-stat-card">
            <div className="a01-stat-icon-wrapper icon-wrap-orange">
              <EyeOff size={20} />
            </div>
            <div className="a01-stat-info">
              <span className="a01-stat-value">{loading ? '...' : hiddenCount}</span>
              <span className="a01-stat-label">Đang ẩn</span>
            </div>
          </div>
          <button type="button" className="a03-add-btn" onClick={handleStartCreate}>
            <Plus size={18} />
            Thêm danh mục
          </button>
        </div>

        <div className="a03-content-grid">
          <div className="a03-left-panel">
            <search>
              <div className="a03-filter-bar">
                <div className="a03-search-box">
                  <Search size={15} color="#8B9E94" />
                  <input
                    type="search"
                    aria-label="Tìm kiếm danh mục"
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
                  />
                </div>
                <select
                  aria-label="Lọc trạng thái danh mục"
                  className="a03-dropdown-btn"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang hiển thị</option>
                  <option value="HIDDEN">Đang ẩn</option>
                </select>
                <select
                  aria-label="Sắp xếp danh mục"
                  className="a03-dropdown-btn"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="oldest">Sắp xếp: ID tăng dần</option>
                  <option value="newest">Sắp xếp: Mới nhất</option>
                  <option value="most_items">Nhiều tin nhất</option>
                </select>
              </div>
            </search>

            <table className="a03-table">
              <thead>
                <tr>
                  <th style={{ width: '36px' }}>#</th>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th style={{ textAlign: 'center' }}>Số tin</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                      Đang tải danh mục...
                    </td>
                  </tr>
                ) : pagedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#67786F' }}>
                      Không có danh mục nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  pagedCategories.map((cat) => {
                    const visual = inferCategoryVisual(cat.slug)
                    const isSelected = mode === 'edit' && selectedCatId === cat.id
                    return (
                      <tr
                        key={cat.id}
                        className={isSelected ? 'a03-row-selected' : ''}
                        style={{ cursor: 'pointer' }}
                        onClick={() => loadCategoryIntoForm(cat)}
                      >
                        <td>{cat.id}</td>
                        <td>
                          <div className="a03-category-cell">
                            <div className={`a03-cat-icon-wrapper ${visual.iconColor}`}>
                              <CategoryIcon type={visual.iconType} />
                            </div>
                            <span className="a03-cat-name">{cat.name}</span>
                          </div>
                        </td>
                        <td><span className="a03-desc-txt">{cat.description || 'Chưa có mô tả'}</span></td>
                        <td className="a03-count-txt">{cat.itemCount ?? 0}</td>
                        <td>
                          <span className={`a03-status-pill ${cat.isActive ? 'status-visible' : 'status-hidden-cat'}`}>
                            {cat.isActive ? 'Hiển thị' : 'Ẩn'}
                          </span>
                        </td>
                        <td>
                          <div className="a03-actions-cell">
                            <button
                              type="button"
                              className="a03-action-btn"
                              title="Chỉnh sửa"
                              onClick={(e) => {
                                e.stopPropagation()
                                loadCategoryIntoForm(cat)
                              }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              className="a03-action-btn"
                              title={cat.isActive ? 'Ẩn nhanh danh mục' : 'Hiển thị lại danh mục'}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickToggleStatus(cat)
                              }}
                            >
                              {cat.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              type="button"
                              className="a03-action-btn"
                              title="Xem tin thuộc danh mục này"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/search?keyword=${encodeURIComponent(cat.name)}`)
                              }}
                            >
                              <Search size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            <div className="a03-pagination-bar">
              <span>
                Hiển thị {filteredCategories.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} –{' '}
                {Math.min(safePage * PAGE_SIZE, filteredCategories.length)} trong {filteredCategories.length} danh mục
              </span>
              <div className="a03-pagination-controls">
                <button
                  type="button"
                  className="a03-page-btn"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`a03-page-btn ${safePage === num ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="a03-page-btn"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div className="a03-right-panel">
            <form className="a03-detail-card" onSubmit={handleSubmitForm}>
              <div className="a03-card-sec-title">
                {mode === 'create' ? <Plus size={16} /> : <Pencil size={16} />}
                <span>{mode === 'create' ? 'Thêm danh mục mới' : `Chỉnh sửa danh mục #${selectedCatId || ''}`}</span>
              </div>

              <div className="a03-form-group">
                <label htmlFor="cat-name-input" className="a03-form-label">
                  Tên danh mục <span className="required">*</span>
                </label>
                <input
                  id="cat-name-input"
                  type="text"
                  required
                  className="a03-form-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="a03-form-group">
                <label htmlFor="cat-slug-input" className="a03-form-label">
                  Đường dẫn tĩnh (Slug — để trống sẽ tự tạo)
                </label>
                <input
                  id="cat-slug-input"
                  type="text"
                  className="a03-form-input"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                />
              </div>

              <div className="a03-form-group">
                <label htmlFor="cat-desc-input" className="a03-form-label">Mô tả</label>
                <div className="a03-form-textarea-wrap">
                  <textarea
                    id="cat-desc-input"
                    className="a03-form-textarea"
                    maxLength={200}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                  <span className="a03-char-count">{formDesc.length} / 200</span>
                </div>
              </div>

              <div className="a03-toggle-row">
                <span className="a03-form-label">Trạng thái</span>
                <div className="a03-toggle-label-row">
                  <button
                    className={`a03-toggle-switch ${formActive ? 'active' : ''}`}
                    type="button"
                    role="switch"
                    aria-checked={formActive}
                    aria-label="Bật tắt hiển thị danh mục"
                    onClick={() => setFormActive((prev) => !prev)}
                  >
                    <span className="a03-toggle-knob" />
                  </button>
                  <span className="a03-toggle-text">
                    {formActive ? 'Hiển thị trên hệ thống' : 'Đang ẩn khỏi form đăng tin'}
                  </span>
                </div>
              </div>

              <div className="a03-info-notice">
                <Info size={14} />
                <span>Danh mục ẩn sẽ không hiển thị khi người dùng đăng tin mới, nhưng vẫn giữ nguyên các tin đăng cũ.</span>
              </div>

              <div className="a03-form-actions">
                <button type="button" className="a03-btn-refresh" onClick={handleRefresh}>
                  <RefreshCw size={13} />
                  Làm mới
                </button>
                <button type="button" className="a03-btn-cancel" onClick={handleCancelForm}>
                  <X size={13} />
                  Hủy thay đổi
                </button>
                <button type="submit" disabled={submitting} className="a03-btn-save">
                  <Check size={13} />
                  {submitting ? 'Đang lưu...' : mode === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </PortalShell>
  )
}
