import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'slf_access_token'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Tự động đính kèm Bearer JWT token và bỏ Content-Type JSON nếu body là FormData (upload ảnh)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Trích xuất thông báo lỗi thân thiện từ response của Backend
export function getApiErrorMessage(error, fallback = 'Đã xảy ra lỗi kết nối máy chủ') {
  return error?.response?.data?.error?.message || error?.message || fallback
}

// Chuẩn hóa đường dẫn ảnh tĩnh từ Backend (hỗ trợ cả dev proxy lẫn production domain)
export function resolveUploadUrl(storageUrl) {
  if (!storageUrl) return ''
  if (storageUrl.startsWith('http://') || storageUrl.startsWith('https://')) {
    return storageUrl
  }
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl && apiUrl.startsWith('http')) {
    const origin = apiUrl.replace(/\/api\/v1\/?$/, '')
    return `${origin}${storageUrl.startsWith('/') ? '' : '/'}${storageUrl}`
  }
  return storageUrl
}

export default apiClient
