export function buildDailyItemSeries(items = [], daysCount = 7) {
  const days = []
  const now = new Date()
  const dayMap = new Map()

  for (let offset = daysCount - 1; offset >= 0; offset -= 1) {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - offset)

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
    const entry = { key, label, found: 0, lost: 0 }
    days.push(entry)
    dayMap.set(key, entry)
  }

  for (const item of items) {
    const rawDate = item.createdAt || item.occurredAt
    if (!rawDate) continue
    const d = new Date(rawDate)
    if (Number.isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const bucket = dayMap.get(key)
    if (!bucket) continue
    if (item.itemType === 'FOUND') bucket.found += 1
    else if (item.itemType === 'LOST') bucket.lost += 1
  }

  // If 30 days are requested, group into 7 evenly spaced bars/points so SVG labels remain crisp
  if (daysCount > 10) {
    const grouped = []
    const chunkSize = Math.ceil(days.length / 7)
    for (let i = 0; i < days.length; i += chunkSize) {
      const slice = days.slice(i, i + chunkSize)
      grouped.push({
        key: slice[0].key,
        label: slice[slice.length - 1].label,
        found: slice.reduce((acc, s) => acc + s.found, 0),
        lost: slice.reduce((acc, s) => acc + s.lost, 0),
      })
    }
    return grouped
  }

  return days
}

export const PUBLICATION_BADGE_MAP = {
  APPROVED: { label: 'Đã duyệt', cls: 'status-approved' },
  PENDING_REVIEW: { label: 'Chờ duyệt', cls: 'status-pending' },
  HIDDEN: { label: 'Đã ẩn', cls: 'status-hidden' },
  REJECTED: { label: 'Từ chối', cls: 'status-hidden' },
}

export const AUDIT_ACTION_META = {
  HIDE_ITEM: { label: 'Ẩn tin đăng', type: 'lock', badge: 'red' },
  RESTORE_ITEM: { label: 'Khôi phục / Duyệt tin', type: 'verify', badge: 'green' },
  REJECT_ITEM: { label: 'Từ chối tin đăng', type: 'lock', badge: 'red' },
  COMPLETE_HANDOVER: { label: 'Xác nhận bàn giao', type: 'verify', badge: 'green' },
  REJECT_CLAIM: { label: 'Từ chối yêu cầu nhận đồ', type: 'lock', badge: 'red' },
  UPDATE_USER_ROLE: { label: 'Cập nhật vai trò', type: 'update', badge: 'green' },
  UPDATE_USER_STATUS: { label: 'Khóa / Mở khóa tài khoản', type: 'lock', badge: 'red' },
}
