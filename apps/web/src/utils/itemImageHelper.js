import { resolveUploadUrl } from '../services/apiClient'
import itemWallet from '../assets/explore/item-wallet.png'
import itemAirpods from '../assets/explore/item-airpods.png'
import itemCard from '../assets/explore/item-card.png'
import itemBackpack from '../assets/explore/item-backpack.png'
import itemKeys from '../assets/explore/item-keys.png'

const SLUG_IMAGE_MAP = {
  'vi-tien-bop': itemWallet,
  'thiet-bi-dien-tu': itemAirpods,
  'the-giay-to': itemCard,
  'balo-tui-xach': itemBackpack,
  'chia-khoa-khac': itemKeys,
}

export function getItemThumbnail(item) {
  if (item?.images && item.images.length > 0 && item.images[0].storageUrl) {
    return resolveUploadUrl(item.images[0].storageUrl)
  }
  const slug = item?.category?.slug || ''
  return SLUG_IMAGE_MAP[slug] || itemBackpack
}

export function formatShortDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('vi-VN')
}

export function formatDateTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

