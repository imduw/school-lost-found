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

  async getItems({
    type = 'ALL',
    categoryId = 'all',
    location = '',
    keyword = '',
    mine = false,
    status = '',
    publicationStatus = '',
  } = {}) {
    try {
      const params = {}
      if (type && type !== 'ALL' && type !== 'all') params.type = type
      if (categoryId && categoryId !== 'all') params.categoryId = categoryId
      if (location && location.trim()) params.location = location.trim()
      if (keyword && keyword.trim()) params.keyword = keyword.trim()
      if (mine) params.mine = true
      if (status) params.status = status
      if (publicationStatus) params.publicationStatus = publicationStatus

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

  async createItem({ files = [], ...fields }) {
    try {
      if (files && files.length > 0) {
        const formData = new FormData()
        Object.entries(fields).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            formData.append(key, String(val))
          }
        })
        files.forEach((file) => {
          formData.append('images', file)
        })
        const res = await apiClient.post('/items', formData)
        return res.data.data
      }

      const res = await apiClient.post('/items', fields)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể đăng tin mới'), { cause: error })
    }
  },

  async uploadItemImages(itemId, files, visibility = 'PUBLIC') {
    try {
      const formData = new FormData()
      formData.append('visibility', visibility)
      files.forEach((file) => {
        formData.append('images', file)
      })
      const res = await apiClient.post(`/items/${itemId}/images`, formData)
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải ảnh lên'), { cause: error })
    }
  },

  async deleteItemImage(itemId, imageId) {
    try {
      const res = await apiClient.delete(`/items/${itemId}/images/${imageId}`)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể xóa ảnh'), { cause: error })
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

  async updateItemVisibility(id, { publicationStatus, reason = '' }) {
    try {
      const res = await apiClient.patch(`/items/${id}/visibility`, {
        publicationStatus,
        reason,
      })
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể cập nhật trạng thái hiển thị tin đăng'), { cause: error })
    }
  },
}
