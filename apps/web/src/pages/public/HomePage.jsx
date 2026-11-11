import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Search, Sparkles, Flame, Check, Bookmark, MapPin, Calendar,
  ArrowRight, FileEdit, Handshake, Sprout,
} from 'lucide-react'
import PublicHeader from '../../components/PublicHeader'
import { itemService } from '../../services/itemService'
import { getItemThumbnail, formatShortDate } from '../../utils/itemImageHelper'
import heroCampusMascot from '../../assets/home/hero-campus-mascot.png'
import iconLostBackpack from '../../assets/home/icon-lost-backpack.png'
import iconFoundBox from '../../assets/home/icon-found-box.png'
import './Home.css'

export default function HomePage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const typeParam = activeFilter === 'all' ? 'ALL' : activeFilter.toUpperCase()
    itemService
      .getItems({ type: typeParam })
      .then((data) => {
        if (!cancelled) {
          setItems(data.slice(0, 4))
        }
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeFilter])

  const handleSelectFilter = (filter) => {
    setLoading(true)
    setActiveFilter(filter)
  }

  const handleHeroSearch = (e) => {
    e.preventDefault()
    const q = searchText.trim()
    navigate(q ? `/search?keyword=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <div className="p01-home-wrapper">
      <PublicHeader />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="p01-main">
        {/* Hero Card */}
        <section className="p01-hero-card">
          <div className="p01-hero-content">
            <span className="p01-hero-badge">School Lost & Found</span>
            <h1 className="p01-hero-title">
              Cùng đưa đồ thất lạc<br />
              về đúng chủ <span className="title-paw">🐾</span>
            </h1>
            <p className="p01-hero-desc">
              Nền tảng hỗ trợ sinh viên đăng tin, tìm kiếm và nhận lại đồ thất lạc trong khuôn viên trường.
            </p>

            {/* Search Box */}
            <form className="p01-hero-search-wrap" onSubmit={handleHeroSearch}>
              <Search size={16} color="#8B9E94" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" className="p01-btn-hero-search" style={{ border: 'none', cursor: 'pointer' }}>
                Tìm kiếm
              </button>
            </form>

            {/* Popular tags */}
            <div className="p01-popular-tags">
              <span className="p01-pop-label">
                <Flame size={13} />
                <span>Phổ biến:</span>
              </span>
              {['Ví', 'Laptop', 'Thẻ sinh viên', 'Tai nghe', 'Balo'].map((tag) => (
                <Link
                  key={tag}
                  to={`/search?keyword=${encodeURIComponent(tag)}`}
                  className="p01-tag-pill"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Mascot Illustration */}
          <div className="p01-hero-graphic">
            <img src={heroCampusMascot} alt="" className="p01-hero-mascot-img" />
          </div>
        </section>

        {/* 2 Quick Action Cards */}
        <section className="p01-quick-actions-grid">
          <Link to="/items/new?type=LOST" className="p01-action-card-lost">
            <div className="p01-action-left">
              <img src={iconLostBackpack} alt="" className="p01-action-icon-img" />
              <div className="p01-action-text">
                <span className="p01-action-heading">Tôi mất đồ</span>
                <span className="p01-action-sub">Đăng tin báo mất để cộng đồng hỗ trợ tìm lại</span>
              </div>
            </div>
            <div className="p01-action-circle-btn">
              <ArrowRight size={16} />
            </div>
          </Link>

          <Link to="/items/new?type=FOUND" className="p01-action-card-found">
            <div className="p01-action-left">
              <img src={iconFoundBox} alt="" className="p01-action-icon-img" />
              <div className="p01-action-text">
                <span className="p01-action-heading">Tôi nhặt được đồ</span>
                <span className="p01-action-sub">Đăng tin thông báo để trả lại đúng chủ nhân</span>
              </div>
            </div>
            <div className="p01-action-circle-btn">
              <ArrowRight size={16} />
            </div>
          </Link>
        </section>

        {/* 3 Bước sử dụng đơn giản */}
        <section className="p01-steps-section">
          <div className="p01-steps-title">
            <Sprout size={16} />
            <span>3 bước sử dụng đơn giản</span>
          </div>

          <div className="p01-steps-card">
            <div className="p01-step-block">
              <div className="p01-step-num-circle">1</div>
              <div className="p01-step-icon-wrap">
                <FileEdit size={22} />
              </div>
              <div className="p01-step-text-col">
                <span className="p01-step-heading">Đăng tin</span>
                <span className="p01-step-desc">Báo mất hoặc nhặt được đồ</span>
              </div>
            </div>

            <ArrowRight size={18} className="p01-step-divider-arrow" />

            <div className="p01-step-block">
              <div className="p01-step-num-circle-outline">2</div>
              <div className="p01-step-icon-wrap">
                <Search size={22} />
              </div>
              <div className="p01-step-text-col">
                <span className="p01-step-heading">Tìm & đối chiếu</span>
                <span className="p01-step-desc">Tìm kiếm, gửi yêu cầu nhận đồ kèm bằng chứng</span>
              </div>
            </div>

            <ArrowRight size={18} className="p01-step-divider-arrow" />

            <div className="p01-step-block">
              <div className="p01-step-num-circle-outline">3</div>
              <div className="p01-step-icon-wrap">
                <Handshake size={22} />
              </div>
              <div className="p01-step-text-col">
                <span className="p01-step-heading">
                  Xác nhận & bàn giao <span style={{ color: '#D48806', fontSize: 11 }}>✨</span>
                </span>
                <span className="p01-step-desc">Cán bộ xác minh và hỗ trợ trao trả an toàn</span>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Items Section */}
        <section className="p01-latest-section">
          <div className="p01-latest-header">
            <div className="p01-latest-title">
              <Sparkles size={18} />
              <span>Tin mới nhất (Dữ liệu thật từ Supabase)</span>
            </div>

            <div className="p01-latest-filter-tabs">
              <button
                type="button"
                className={`p01-filter-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleSelectFilter('all')}
              >
                <span>Tất cả</span>
              </button>
              <button
                type="button"
                className={`p01-filter-tab-pill ${activeFilter === 'lost' ? 'active' : ''}`}
                onClick={() => handleSelectFilter('lost')}
              >
                <Flame size={12} color={activeFilter === 'lost' ? '#FFFFFF' : '#E65100'} />
                <span>Báo mất (LOST)</span>
              </button>
              <button
                type="button"
                className={`p01-filter-tab-pill ${activeFilter === 'found' ? 'active' : ''}`}
                onClick={() => handleSelectFilter('found')}
              >
                <Check size={12} color={activeFilter === 'found' ? '#FFFFFF' : '#2E7D32'} />
                <span>Nhặt được (FOUND)</span>
              </button>
            </div>

            <Link to="/search" className="p01-latest-view-all">
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>
              Đang tải dữ liệu từ Backend & Supabase...
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>
              Chưa có tin đăng nào phù hợp.
            </div>
          ) : (
            <div className="p01-items-grid">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="p01-item-card"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className="p01-card-top-row">
                    <div className="p01-card-badge-row">
                      <span className={`m01-type-badge ${item.itemType === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                        {item.itemType}
                      </span>
                      <span className="p01-card-time">{item.businessStatus}</span>
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

                  <div className="p01-card-image-box">
                    <img src={getItemThumbnail(item)} alt={item.title} />
                  </div>

                  <h3 className="p01-card-title">{item.title}</h3>

                  <div className="p01-card-meta">
                    <div className="p01-card-meta-line">
                      <MapPin size={12} />
                      <span>{item.approximateLocation}</span>
                    </div>
                    <div className="p01-card-meta-line">
                      <Calendar size={12} />
                      <span>{formatShortDate(item.occurredAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
