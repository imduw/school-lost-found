import apiClient, { getApiErrorMessage } from './apiClient'

export const adminService = {
  async getStats() {
    try {
      const res = await apiClient.get('/admin/stats')
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải thống kê hệ thống'), { cause: error })
    }
  },

  async getUsers({ keyword = '', role = '', status = '' } = {}) {
    try {
      const params = {}
      if (keyword && keyword.trim()) params.keyword = keyword.trim()
      if (role && role !== 'ALL') params.role = role
      if (status && status !== 'ALL') params.status = status

      const res = await apiClient.get('/admin/users', { params })
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải danh sách người dùng'), { cause: error })
    }
  },

  async updateUserRole(userId, role) {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/role`, { role })
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể cập nhật vai trò người dùng'), { cause: error })
    }
  },

  async updateUserStatus(userId, status) {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/status`, { status })
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể cập nhật trạng thái tài khoản'), { cause: error })
    }
  },

  async getCategories() {
    try {
      const res = await apiClient.get('/admin/categories')
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải danh mục hệ thống'), { cause: error })
    }
  },

  async createCategory({ name, slug = '', description = '', isActive = true }) {
    try {
      const res = await apiClient.post('/admin/categories', {
        name,
        slug: slug || undefined,
        description,
        isActive,
      })
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tạo danh mục mới'), { cause: error })
    }
  },

  async updateCategory(categoryId, payload) {
    try {
      const res = await apiClient.put(`/admin/categories/${categoryId}`, payload)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể cập nhật danh mục'), { cause: error })
    }
  },

  async getAuditLogs({ keyword = '', action = '' } = {}) {
    try {
      const params = {}
      if (keyword && keyword.trim()) params.keyword = keyword.trim()
      if (action && action !== 'ALL') params.action = action

      const res = await apiClient.get('/admin/audit-logs', { params })
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải nhật ký hoạt động'), { cause: error })
    }
  },
}
