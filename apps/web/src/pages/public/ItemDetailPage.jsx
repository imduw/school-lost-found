import { useState } from 'react'
import {
  Home, Search, BookOpen, CircleAlert, Bell,
  MapPin, Calendar, Tag, ArrowRight,
  Maximize2, Send, ShieldCheck, Flag, Sparkles, Bookmark,
  Package, User,
} from 'lucide-react'
import logoSrc from '../../assets/svg/logo/school-lost-found-logo.svg'
import airpodsLarge from '../../assets/detail/airpods-large.png'
import airpodsSub1 from '../../assets/detail/airpods-sub-1.png'
import airpodsSub2 from '../../assets/detail/airpods-sub-2.png'
import airpodsSub3 from '../../assets/detail/airpods-sub-3.png'
import claimBoxMascot from '../../assets/detail/claim-box-mascot.png'
import itemSleeve from '../../assets/detail/item-sleeve.png'
import itemCard from '../../assets/explore/item-card.png'
import itemMouse from '../../assets/explore/item-mouse.png'
import itemHeadphones from '../../assets/explore/item-headphones.png'
import './Home.css'
import './ExploreItems.css'
import './ItemDetail.css'

export default function ItemDetailPage() {
  const [activeThumb, setActiveThumb] = useState(1)

  const relatedItems = [
    {
      id: 1,
      type: 'FOUND',
      title: 'Nhặt được túi chống sốc laptop',
      location: 'Thư viện tầng 2',
      date: '09/11/2026',
      img: itemSleeve,
    },
    {
      id: 2,
      type: 'LOST',
      title: 'Mất thẻ sinh viên',
      location: 'Khu A – Tòa nhà chính',
      date: '09/11/2026',
      img: itemCard,
    },
    {
      id: 3,
      type: 'FOUND',
      title: 'Nhặt được chuột không dây',
      location: 'Thư viện tầng 3',
      date: '08/11/2026',
      img: itemMouse,
    },
    {
      id: 4,
      type: 'LOST',
      title: 'Mất tai nghe chụp tai',
      location: 'Phòng Lab 5',
      date: '08/11/2026',
      img: itemHeadphones,
    },
  ]

  return (
    <div className="p03-page-wrapper">
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
      <main className="p03-main">
        {/* Top Navigation Back link */}
        <a href="/search" className="p03-back-link">
          ← Quay lại danh sách
        </a>

        {/* ---------------- Main 2 Columns Layout ---------------- */}
        <div className="p03-content-grid">
          {/* Left Card: Item Info & Gallery */}
          <div className="p03-main-card">
            {/* Gallery Column */}
            <div className="p03-gallery-col">
              <div className="p03-main-photo-wrap">
                <img src={airpodsLarge} alt="AirPods" className="p03-main-photo" />
                <span className="p03-expand-badge" title="Phóng to">
                  <Maximize2 size={13} />
                </span>
              </div>

              {/* Sub Thumbs */}
              <div className="p03-thumbs-row">
                <div
                  className={`p03-sub-thumb ${activeThumb === 1 ? 'active' : ''}`}
                  onClick={() => setActiveThumb(1)}
                >
                  <img src={airpodsSub1} alt="" />
                </div>
                <div
                  className={`p03-sub-thumb ${activeThumb === 2 ? 'active' : ''}`}
                  onClick={() => setActiveThumb(2)}
                >
                  <img src={airpodsSub2} alt="" />
                </div>
                <div
                  className={`p03-sub-thumb ${activeThumb === 3 ? 'active' : ''}`}
                  onClick={() => setActiveThumb(3)}
                >
                  <img src={airpodsSub3} alt="" />
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="p03-info-col">
              {/* Badges */}
              <div className="p03-badges-row">
                <span className="p03-badge-found-solid">Nhật được (FOUND)</span>
                <span className="p03-badge-open">Đang mở (OPEN)</span>
              </div>

              {/* Title */}
              <h1 className="p03-item-title">Nhặt được tai nghe AirPods</h1>

              {/* Metadata */}
              <div className="p03-meta-list">
                <div className="p03-meta-row">
                  <Calendar size={14} />
                  <span>
                    <span className="p03-meta-bold-label">Đăng lúc:</span> 10/11/2026 – 06:30
                  </span>
                </div>
                <div className="p03-meta-row">
                  <MapPin size={14} />
                  <span>
                    <span className="p03-meta-bold-label">Địa điểm nhặt:</span> Thư viện tầng 2
                  </span>
                </div>
                <div className="p03-meta-row">
                  <Tag size={14} />
                  <span>
                    <span className="p03-meta-bold-label">Danh mục:</span> Thiết bị điện tử
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p03-desc-block">
                <span className="p03-desc-title">Mô tả chi tiết</span>
                <p className="p03-desc-text">
                  Mình nhặt được một hộp tai nghe AirPods tại khu vực bàn học, Thư viện tầng 2 vào sáng nay (10/11/2026). Hộp màu trắng, còn hoạt động bình thường.
                </p>
                <p className="p03-desc-text" style={{ marginTop: 6 }}>
                  Ai là chủ sở hữu vui lòng gửi yêu cầu nhận lại đồ và cung cấp thông tin đối chiếu để xác minh nhé!
                </p>
              </div>

              {/* Custody Box */}
              <div className="p03-custody-card">
                <div className="p03-custody-left">
                  <div className="p03-custody-icon">
                    <Package size={18} />
                  </div>
                  <div className="p03-custody-text">
                    <span className="p03-custody-title">Nơi đang giữ đồ</span>
                    <span className="p03-custody-val">Đã bàn giao tại Bàn bảo vệ (Nhà A)</span>
                  </div>
                </div>
                <button type="button" className="p03-btn-view-location">
                  <MapPin size={12} />
                  <span>Xem vị trí</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="p03-side-col">
            {/* CTA Card: Claim Item */}
            <div className="p03-cta-card">
              <img src={claimBoxMascot} alt="" className="p03-cta-mascot-img" />
              <h3 className="p03-cta-title">Bạn là chủ nhân của món đồ?</h3>
              <p className="p03-cta-desc">
                Hãy gửi yêu cầu nhận lại đồ và cung cấp bằng chứng để được xác minh.
              </p>
              <button type="button" className="p03-btn-send-claim">
                <Send size={14} />
                <span>Gửi yêu cầu nhận đồ</span>
              </button>
            </div>

            {/* Poster Info Card */}
            <div className="p03-poster-card">
              <span className="p03-card-heading">Thông tin người đăng</span>
              <div className="p03-poster-body">
                <div className="p03-poster-avatar-circle">
                  <User size={20} />
                </div>
                <div className="p03-poster-text">
                  <span className="p03-poster-name">Sinh viên ẩn danh</span>
                  <span className="p03-poster-joined">
                    <ShieldCheck size={12} color="#7B8B82" />
                    <span>Thành viên từ 06/2026</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Report Violation Card */}
            <a href="#report" className="p03-report-card" onClick={(e) => e.preventDefault()}>
              <Flag size={14} />
              <span>Báo cáo vi phạm</span>
            </a>
          </div>
        </div>

        {/* ---------------- Bottom: Related Items ---------------- */}
        <section className="p03-related-section">
          <div className="p03-related-header">
            <div className="p03-related-title">
              <Sparkles size={16} />
              <span>Các tin liên quan</span>
            </div>
            <a href="/search" className="p01-latest-view-all">
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="p02-cards-grid">
            {relatedItems.map((item) => (
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
