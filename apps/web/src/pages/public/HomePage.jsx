import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell,
  Sparkles, Flame, Check, Bookmark, MapPin, Calendar,
  ArrowRight, FileEdit, Handshake, Sprout,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import heroCampusMascot from '../../assets/home/hero-campus-mascot.png'
import iconLostBackpack from '../../assets/home/icon-lost-backpack.png'
import iconFoundBox from '../../assets/home/icon-found-box.png'
import itemWalletDesk from '../../assets/home/item-wallet-desk.png'
import itemAirpodsDesk from '../../assets/home/item-airpods-desk.png'
import itemCardDesk from '../../assets/home/item-card-desk.png'
import itemBackpackGrey from '../../assets/home/item-backpack-grey.png'
import './Home.css'

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const latestItems = [
    {
      id: 1,
      type: 'LOST',
      timeAgo: '2 giờ trước',
      img: itemWalletDesk,
      title: 'Báo mất ví da màu đen',
      location: 'Giảng đường V',
      date: '10/11/2026',
    },
    {
      id: 2,
      type: 'FOUND',
      timeAgo: '3 giờ trước',
      img: itemAirpodsDesk,
      title: 'Nhặt được tai nghe AirPods',
      location: 'Thư viện tầng 2',
      date: '10/11/2026',
    },
    {
      id: 3,
      type: 'LOST',
      timeAgo: '5 giờ trước',
      img: itemCardDesk,
      title: 'Mất thẻ sinh viên',
      location: 'Khu A - Tòa nhà chính',
      date: '10/11/2026',
    },
    {
      id: 4,
      type: 'FOUND',
      timeAgo: '6 giờ trước',
      img: itemBackpackGrey,
      title: 'Nhặt được balo màu xám',
      location: 'Căn tin',
      date: '10/11/2026',
    },
  ]

  const filteredItems = latestItems.filter((item) => {
    if (activeFilter === 'lost') return item.type === 'LOST'
    if (activeFilter === 'found') return item.type === 'FOUND'
    return true
  })

  return (
    <div className="p01-home-wrapper">
      {/* ==================== PUBLIC HEADER ==================== */}
      <header className="p01-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoSrc} alt="School Lost & Found" style={{ height: 36 }} />
          </a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/" className="p01-header-nav-pill">
              <Home size={15} />
              <span>Trang chủ</span>
            </a>
            <a href="/search" className="a01-nav-link">
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
            <div className="p01-hero-search-wrap">
              <Search size={16} color="#8B9E94" />
              <input
                type="text"
                placeholder="Tìm kiếm đồ thất lạc (ví dụ: ví, laptop, thẻ sinh viên...)"
              />
              <a href="/search" className="p01-btn-hero-search" style={{ textDecoration: 'none' }}>
                Tìm kiếm
              </a>
            </div>

            {/* Popular tags */}
            <div className="p01-popular-tags">
              <span className="p01-pop-label">
                <Flame size={13} />
                <span>Phổ biến:</span>
              </span>
              <a href="/search" className="p01-tag-pill">Ví tiền</a>
              <a href="/search" className="p01-tag-pill">Laptop</a>
              <a href="/search" className="p01-tag-pill">Thẻ sinh viên</a>
              <a href="/search" className="p01-tag-pill">Tai nghe</a>
              <a href="/search" className="p01-tag-pill">Balo</a>
            </div>
          </div>

          {/* Right Mascot Illustration */}
          <div className="p01-hero-graphic">
            <img src={heroCampusMascot} alt="" className="p01-hero-mascot-img" />
          </div>
        </section>

        {/* 2 Quick Action Cards */}
        <section className="p01-quick-actions-grid">
          {/* Card 1: Tôi mất đồ */}
          <a href="/report-lost" className="p01-action-card-lost" onClick={(e) => e.preventDefault()}>
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
          </a>

          {/* Card 2: Tôi nhặt được đồ */}
          <a href="/report-found" className="p01-action-card-found" onClick={(e) => e.preventDefault()}>
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
          </a>
        </section>

        {/* 3 Bước sử dụng đơn giản */}
        <section className="p01-steps-section">
          <div className="p01-steps-title">
            <Sprout size={16} />
            <span>3 bước sử dụng đơn giản</span>
          </div>

          <div className="p01-steps-card">
            {/* Step 1 */}
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

            {/* Step 2 */}
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

            {/* Step 3 */}
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
              <span>Tin mới nhất</span>
            </div>

            {/* Filter Tabs */}
            <div className="p01-latest-filter-tabs">
              <button
                type="button"
                className={`p01-filter-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                <span>Tất cả</span>
              </button>
              <button
                type="button"
                className={`p01-filter-tab-pill ${activeFilter === 'lost' ? 'active' : ''}`}
                onClick={() => setActiveFilter('lost')}
              >
                <Flame size={12} color={activeFilter === 'lost' ? '#FFFFFF' : '#E65100'} />
                <span>Báo mất (LOST)</span>
              </button>
              <button
                type="button"
                className={`p01-filter-tab-pill ${activeFilter === 'found' ? 'active' : ''}`}
                onClick={() => setActiveFilter('found')}
              >
                <Check size={12} color={activeFilter === 'found' ? '#FFFFFF' : '#2E7D32'} />
                <span>Nhật được (FOUND)</span>
              </button>
            </div>

            {/* View all link */}
            <a href="/search" className="p01-latest-view-all">
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* 4 Items Grid */}
          <div className="p01-items-grid">
            {filteredItems.map((item) => (
              <a
                key={item.id}
                href="/items/detail"
                className="p01-item-card"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div className="p01-card-top-row">
                  <div className="p01-card-badge-row">
                    <span className={`m01-type-badge ${item.type === 'FOUND' ? 'm01-type-found' : 'm01-type-lost'}`}>
                      {item.type}
                    </span>
                    <span className="p01-card-time">{item.timeAgo}</span>
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
                  <img src={item.img} alt="" />
                </div>

                <h3 className="p01-card-title">{item.title}</h3>

                <div className="p01-card-meta">
                  <div className="p01-card-meta-line">
                    <MapPin size={12} />
                    <span>{item.location}</span>
                  </div>
                  <div className="p01-card-meta-line">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

