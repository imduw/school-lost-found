import apiClient, { getApiErrorMessage } from './apiClient'

export const itemService = {
  async checkHealth() {
    try {
      const res = await apiClient.get('/health')
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Backend chưa phản hồi'), { cause: error })
    }
  },

  async getCategories() {
    try {
      const res = await apiClient.get('/categories')
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải danh mục'), { cause: error })
    }
  },

  async getItems({ type = 'ALL', categoryId = 'all', location = '', keyword = '', mine = false, status = '' } = {}) {
    try {
      const params = {}
      if (type && type !== 'ALL' && type !== 'all') params.type = type
      if (categoryId && categoryId !== 'all') params.categoryId = categoryId
      if (location && location.trim()) params.location = location.trim()
      if (keyword && keyword.trim()) params.keyword = keyword.trim()
      if (mine) params.mine = true
      if (status) params.status = status

      const res = await apiClient.get('/items', { params })
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải danh sách tin'), { cause: error })
    }
  },

  async getItemById(id) {
    try {
      const res = await apiClient.get(`/items/${id}`)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải chi tiết tin'), { cause: error })
    }
  },

  async createItem(payload) {
    try {
      const res = await apiClient.post('/items', payload)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể đăng tin mới'), { cause: error })
    }
  },

  async updateItem(id, payload) {
    try {
      const res = await apiClient.put(`/items/${id}`, payload)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể cập nhật tin đăng'), { cause: error })
    }
  },

  async resolveItem(id) {
    try {
      const res = await apiClient.patch(`/items/${id}/resolve`)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể đánh dấu đã tìm thấy'), { cause: error })
    }
  },
}
