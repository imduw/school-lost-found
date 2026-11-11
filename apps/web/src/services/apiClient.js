import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'slf_access_token'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Tự động đính kèm Bearer JWT token nếu đã đăng nhập
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Trích xuất thông báo lỗi thân thiện từ response của Backend
export function getApiErrorMessage(error, fallback = 'Đã xảy ra lỗi kết nối máy chủ') {
  return error?.response?.data?.error?.message || error?.message || fallback
}

export default apiClient
