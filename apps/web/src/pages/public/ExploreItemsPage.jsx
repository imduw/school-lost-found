import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  Search, Flame, Check, Bookmark, MapPin, Calendar,
  RotateCcw, Tag, Filter,
} from 'lucide-react'
import PublicHeader from '../../components/PublicHeader'
import { useAuth } from '../../contexts/useAuth'
import { itemService } from '../../services/itemService'
import { getItemThumbnail, formatShortDate } from '../../utils/itemImageHelper'
import bannerExploreMascot from '../../assets/explore/banner-explore-mascot.png'
import './Home.css'
import './ExploreItems.css'

export default function ExploreItemsPage() {
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()

  const [keyword, setKeyword] = useState(() => searchParams.get('keyword') || '')
  const [selectedType, setSelectedType] = useState('all')
  const [categoryId, setCategoryId] = useState('all')
  const [locationText, setLocationText] = useState('')
  const [mineOnly, setMineOnly] = useState(false)

  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    itemService
      .getCategories()
      .then((cats) => setCategories(cats))
      .catch(() => setCategories([]))
  }, [])

  const fetchItems = useCallback(async (overrideParams) => {
    setLoading(true)
    setError('')
    try {
      const q = overrideParams || {
        keyword,
        type: selectedType === 'all' ? 'ALL' : selectedType.toUpperCase(),
        categoryId,
        location: locationText,
        mine: mineOnly,
      }
      const data = await itemService.getItems(q)
      setItems(data)
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [keyword, selectedType, categoryId, locationText, mineOnly])

  useEffect(() => {
    let cancelled = false
    itemService
      .getItems({
        keyword,
        type: selectedType === 'all' ? 'ALL' : selectedType.toUpperCase(),
        categoryId,
        location: locationText,
        mine: mineOnly,
      })
      .then((data) => {
        if (!cancelled) {
          setItems(data)
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setItems([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [keyword, selectedType, categoryId, locationText, mineOnly])

  const handleReset = () => {
    setKeyword('')
    setSelectedType('all')
    setCategoryId('all')
    setLocationText('')
    setMineOnly(false)
    fetchItems({ keyword: '', type: 'ALL', categoryId: 'all', location: '', mine: false })
  }

  const lostCount = items.filter((i) => i.itemType === 'LOST').length
  const foundCount = items.filter((i) => i.itemType === 'FOUND').length

  return (
    <div className="p02-page-wrapper">
      <PublicHeader />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="p02-main">
        <section className="p02-banner-card">
          <div className="p02-banner-text">
            <h1 className="p02-banner-title">Tìm đồ thất lạc</h1>
            <p className="p02-banner-subtitle">
              Tra cứu trực tiếp từ cơ sở dữ liệu Supabase — tin bị ẩn tự động giấu khỏi người ngoài quyền.
            </p>
          </div>

          <div className="p02-banner-graphic">
            <img src={bannerExploreMascot} alt="" className="p02-banner-img" />
          </div>
        </section>

        {/* ---------------- 2 Column Layout ---------------- */}
        <div className="p02-content-grid">
          {/* Left Column: Filter Sidebar */}
          <aside className="p02-filter-card">
            <div className="p02-filter-header">
              <div className="p02-filter-title">
                <Filter size={15} />
                <span>Bộ lọc tìm kiếm</span>
              </div>
              <button type="button" className="p02-btn-reset-filter" onClick={handleReset}>
                <RotateCcw size={11} />
                <span>Xóa lọc</span>
              </button>
            </div>

            {/* Keyword Field */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Từ khóa</label>
              <div className="p02-keyword-input-wrap">
                <Search size={14} color="#8B9E94" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            {/* Type Field */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Loại tin</label>
              <div className="p02-type-options-list">
                <div
                  className={`p02-type-option-row ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  <div className="p02-option-left">
                    <span className={`p02-custom-check ${selectedType === 'all' ? 'checked' : ''}`}>
                      {selectedType === 'all' && <Check size={11} />}
                    </span>
                    <span>Tất cả</span>
                  </div>
                </div>

                <div
                  className={`p02-type-option-row ${selectedType === 'lost' ? 'active' : ''}`}
                  onClick={() => setSelectedType('lost')}
                >
                  <div className="p02-option-left">
                    <span className={`p02-custom-check ${selectedType === 'lost' ? 'checked' : ''}`}>
                      {selectedType === 'lost' && <Check size={11} />}
                    </span>
                    <span>Báo mất (LOST)</span>
                  </div>
                  <span className="m01-type-badge m01-type-lost">LOST</span>
                </div>

                <div
                  className={`p02-type-option-row ${selectedType === 'found' ? 'active' : ''}`}
                  onClick={() => setSelectedType('found')}
                >
                  <div className="p02-option-left">
                    <span className={`p02-custom-check ${selectedType === 'found' ? 'checked' : ''}`}>
                      {selectedType === 'found' && <Check size={11} />}
                    </span>
                    <span>Nhặt được (FOUND)</span>
                  </div>
                  <span className="m01-type-badge m01-type-found">FOUND</span>
                </div>
              </div>
            </div>

            {/* Category Select */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Danh mục</label>
              <div className="p02-filter-select-wrap" style={{ padding: 0 }}>
                <Tag size={13} style={{ marginLeft: 10 }} />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '9px 8px',
                    fontSize: 13,
                    outline: 'none',
                  }}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Input */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Khu vực</label>
              <div className="p02-keyword-input-wrap">
                <MapPin size={14} color="#8B9E94" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                />
              </div>
            </div>

            {isAuthenticated && (
              <div className="p02-filter-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={mineOnly}
                    onChange={(e) => setMineOnly(e.target.checked)}
                  />
                  <span>Chỉ xem tin của tôi</span>
                </label>
              </div>
            )}

            <button type="button" className="p02-btn-apply-filter" onClick={() => fetchItems()}>
              <Search size={14} />
              <span>Áp dụng bộ lọc</span>
            </button>
          </aside>

          {/* Right Column: Results Grid */}
          <section className="p02-results-col">
            <div className="p02-results-top-header">
              <h2 className="p02-results-title-count">
                Kết quả tìm kiếm <span>({items.length} tin)</span>
              </h2>
            </div>

            {/* Tabs Row */}
            <div className="p02-filter-tabs-row">
              <button
                type="button"
                className={`p02-tab-pill ${selectedType === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedType('all')}
              >
                <span>Tất cả ({items.length})</span>
              </button>
              <button
                type="button"
                className={`p02-tab-pill ${selectedType === 'lost' ? 'active' : ''}`}
                onClick={() => setSelectedType('lost')}
              >
                <Flame size={12} color={selectedType === 'lost' ? '#FFFFFF' : '#E65100'} />
                <span>Báo mất ({lostCount})</span>
              </button>
              <button
                type="button"
                className={`p02-tab-pill ${selectedType === 'found' ? 'active' : ''}`}
                onClick={() => setSelectedType('found')}
              >
                <Check size={12} color={selectedType === 'found' ? '#FFFFFF' : '#2E7D32'} />
                <span>Nhặt được ({foundCount})</span>
              </button>
            </div>

            {error && (
              <div style={{ padding: 14, borderRadius: 10, background: '#FEF2F2', color: '#B91C1C', marginBottom: 14 }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                Đang tìm kiếm dữ liệu thật từ Supabase...
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px dashed #CBD5E1',
                  color: '#64748B',
                }}
              >
                Không tìm thấy tin đăng nào phù hợp bộ lọc hiện tại.
              </div>
            ) : (
              <div className="p02-cards-grid">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/items/${item.id}`}
                    className="p02-item-card"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="p01-card-top-row">
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <span className={`m01-type-badge ${item.itemType === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                          {item.itemType}
                        </span>
                        {item.publicationStatus === 'HIDDEN' && (
                          <span style={{ fontSize: 10, fontWeight: 700, background: '#374151', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>
                            HIDDEN
                          </span>
                        )}
                      </div>
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
                      <img src={getItemThumbnail(item)} alt={item.title} />
                    </div>

                    <h3 className="p02-card-item-title">{item.title}</h3>

                    <div className="p02-card-meta-box">
                      <div className="p02-card-meta-line">
                        <MapPin size={11} />
                        <span>{item.approximateLocation}</span>
                      </div>
                      <div className="p02-card-meta-line">
                        <Calendar size={11} />
                        <span>{formatShortDate(item.occurredAt)} • {item.businessStatus}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
