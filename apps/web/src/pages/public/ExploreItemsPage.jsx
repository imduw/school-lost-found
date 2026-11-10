import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell,
  Flame, Check, Bookmark, MapPin, Calendar,
  RotateCcw, Tag, ArrowUpDown, ChevronDown,
  Filter,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import bannerExploreMascot from '../../assets/explore/banner-explore-mascot.png'
import itemAirpods from '../../assets/explore/item-airpods.png'
import itemCard from '../../assets/explore/item-card.png'
import itemBackpack from '../../assets/explore/item-backpack.png'
import itemWallet from '../../assets/explore/item-wallet.png'
import itemKeys from '../../assets/explore/item-keys.png'
import itemLaptop from '../../assets/explore/item-laptop.png'
import itemMouse from '../../assets/explore/item-mouse.png'
import itemHeadphones from '../../assets/explore/item-headphones.png'
import './Home.css'
import './ExploreItems.css'

export default function ExploreItemsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const exploreItems = [
    {
      id: 1,
      type: 'FOUND',
      title: 'Nhặt được tai nghe AirPods',
      location: 'Thư viện tầng 2',
      date: '10/11/2026',
      timeAgo: '6 giờ trước',
      img: itemAirpods,
    },
    {
      id: 2,
      type: 'LOST',
      title: 'Mất thẻ sinh viên',
      location: 'Khu A – Tòa nhà chính',
      date: '10/11/2026',
      timeAgo: '8 giờ trước',
      img: itemCard,
    },
    {
      id: 3,
      type: 'FOUND',
      title: 'Nhặt được balo màu xám',
      location: 'Căn tin',
      date: '10/11/2026',
      timeAgo: '12 giờ trước',
      img: itemBackpack,
    },
    {
      id: 4,
      type: 'LOST',
      title: 'Báo mất ví da màu đen',
      location: 'Giảng đường V',
      date: '10/11/2026',
      timeAgo: '2 giờ trước',
      img: itemWallet,
    },
    {
      id: 5,
      type: 'FOUND',
      title: 'Nhặt được chùm chìa khóa',
      location: 'Bãi giữ xe',
      date: '09/11/2026',
      timeAgo: '1 ngày trước',
      img: itemKeys,
    },
    {
      id: 6,
      type: 'LOST',
      title: 'Mất laptop Dell màu bạc',
      location: 'Phòng học A203',
      date: '09/11/2026',
      timeAgo: '1 ngày trước',
      img: itemLaptop,
    },
    {
      id: 7,
      type: 'FOUND',
      title: 'Nhặt được chuột không dây',
      location: 'Thư viện tầng 3',
      date: '08/11/2026',
      timeAgo: '2 ngày trước',
      img: itemMouse,
    },
    {
      id: 8,
      type: 'LOST',
      title: 'Mất tai nghe chụp tai',
      location: 'Khu B – Phòng Lab 5',
      date: '08/11/2026',
      timeAgo: '2 ngày trước',
      img: itemHeadphones,
    },
  ]

  const filteredItems = exploreItems.filter((item) => {
    if (activeTab === 'lost') return item.type === 'LOST'
    if (activeTab === 'found') return item.type === 'FOUND'
    return true
  })

  return (
    <div className="p02-page-wrapper">
      {/* ==================== PUBLIC HEADER ==================== */}
      <header className="p01-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoSrc} alt="School Lost & Found" style={{ height: 36 }} />
          </a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/" className="a01-nav-link">
              <Home size={15} />
              <span>Trang chủ</span>
            </a>
            <a href="/search" className="p01-header-nav-pill">
              <Search size={15} />
              <span>Tìm đồ</span>
            </a>
            <a href="/guide" className="a01-nav-link" onClick={(e) => e.preventDefault()}>
              <BookOpen size={15} />
              <span>Hướng dẫn</span>
            </a>
            <a href="/about" className="a01-nav-link" onClick={(e) => e.preventDefault()}>
              <CircleAlert size={15} />
              <span>Về hệ thống</span>
            </a>
          </nav>
        </div>

        <div className="p01-header-right">
          <button type="button" className="a01-bell-btn" aria-label="Thông báo">
            <Bell size={18} />
          </button>
          <a href="/login" className="p01-btn-login">Đăng nhập</a>
          <a href="/register" className="p01-btn-register">Đăng ký</a>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="p02-main">
        {/* Banner Card */}
        <section className="p02-banner-card">
          <div className="p02-banner-text">
            <h1 className="p02-banner-title">Tìm đồ thất lạc</h1>
            <p className="p02-banner-subtitle">
              Tra cứu các tin báo mất và nhặt được đã được duyệt.
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
              <button type="button" className="p02-btn-reset-filter">
                <RotateCcw size={11} />
                <span>Xóa lọc</span>
              </button>
            </div>

            {/* Keyword Field */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Từ khóa</label>
              <div className="p02-keyword-input-wrap">
                <Search size={14} color="#8B9E94" />
                <input type="text" placeholder="Nhập từ khóa (ví dụ: ví, laptop, thẻ...)" />
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

            {/* Category Dropdown */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Danh mục</label>
              <div className="p02-filter-select-wrap">
                <div className="p02-select-left">
                  <Tag size={13} />
                  <span>Tất cả danh mục</span>
                </div>
                <ChevronDown size={13} color="#7B8B82" />
              </div>
            </div>

            {/* Location Dropdown */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Khu vực</label>
              <div className="p02-filter-select-wrap">
                <div className="p02-select-left">
                  <MapPin size={13} />
                  <span>Tất cả khu vực</span>
                </div>
                <ChevronDown size={13} color="#7B8B82" />
              </div>
            </div>

            {/* Time Dropdown */}
            <div className="p02-filter-group">
              <label className="p02-group-label">Thời gian</label>
              <div className="p02-filter-select-wrap">
                <div className="p02-select-left">
                  <Calendar size={13} />
                  <span>Tất cả thời gian</span>
                </div>
                <ChevronDown size={13} color="#7B8B82" />
              </div>
            </div>

            {/* Apply Button */}
            <button type="button" className="p02-btn-apply-filter">
              <Search size={14} />
              <span>Áp dụng bộ lọc</span>
            </button>
          </aside>

          {/* Right Column: Results Grid */}
          <section className="p02-results-col">
            {/* Results Header */}
            <div className="p02-results-top-header">
              <h2 className="p02-results-title-count">
                Kết quả tìm kiếm <span>(12 tin)</span>
              </h2>

              <div className="p02-sort-wrap">
                <span>Sắp xếp:</span>
                <button type="button" className="p02-sort-dropdown-btn">
                  <ArrowUpDown size={12} />
                  <span>Mới nhất</span>
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {/* Tabs Row */}
            <div className="p02-filter-tabs-row">
              <button
                type="button"
                className={`p02-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span>Tất cả (12)</span>
              </button>
              <button
                type="button"
                className={`p02-tab-pill ${activeTab === 'lost' ? 'active' : ''}`}
                onClick={() => setActiveTab('lost')}
              >
                <Flame size={12} color={activeTab === 'lost' ? '#FFFFFF' : '#E65100'} />
                <span>Báo mất (5)</span>
              </button>
              <button
                type="button"
                className={`p02-tab-pill ${activeTab === 'found' ? 'active' : ''}`}
                onClick={() => setActiveTab('found')}
              >
                <Check size={12} color={activeTab === 'found' ? '#FFFFFF' : '#2E7D32'} />
                <span>Nhặt được (7)</span>
              </button>
            </div>

            {/* Cards Grid (4 cols x 2 rows) */}
            <div className="p02-cards-grid">
              {filteredItems.map((item) => (
                <a
                  key={item.id}
                  href="/items/detail"
                  className="p02-item-card"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="p01-card-top-row">
                    <span className={`m01-type-badge ${item.type === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                      {item.type}
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
                    <img src={item.img} alt="" />
                  </div>

                  <h3 className="p02-card-item-title">{item.title}</h3>

                  <div className="p02-card-meta-box">
                    <div className="p02-card-meta-line">
                      <MapPin size={11} />
                      <span>{item.location}</span>
                    </div>
                    <div className="p02-card-meta-line">
                      <Calendar size={11} />
                      <span>{item.date} • {item.timeAgo}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="p02-pagination-wrap">
              <div className="a04-pagination-controls">
                <button className="a04-page-btn">&lt;</button>
                <button className="a04-page-btn active">1</button>
                <button className="a04-page-btn">2</button>
                <button className="a04-page-btn">3</button>
                <button className="a04-page-btn">&gt;</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

