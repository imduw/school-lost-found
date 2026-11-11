import apiClient, { getApiErrorMessage } from './apiClient'

export const claimService = {
  async createClaim(itemId, { proofType = 'DESCRIPTION', proofContent = '', files = [] }) {
    try {
      if (files && files.length > 0) {
        const formData = new FormData()
        formData.append('proofType', proofType)
        if (proofContent && proofContent.trim()) {
          formData.append('proofContent', proofContent.trim())
        }
        files.forEach((file) => {
          formData.append('proofImages', file)
        })
        const res = await apiClient.post(`/items/${itemId}/claims`, formData)
        return res.data.data
      }

      const res = await apiClient.post(`/items/${itemId}/claims`, {
        proofType,
        proofContent: proofContent.trim(),
      })
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể gửi yêu cầu nhận đồ'), { cause: error })
    }
  },

  async getMyClaims() {
    try {
      const res = await apiClient.get('/claims/my')
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải danh sách yêu cầu của bạn'), { cause: error })
    }
  },

  async getAllClaims({ status = '', itemId = '', keyword = '' } = {}) {
    try {
      const params = {}
      if (status && status !== 'ALL' && status !== 'all') params.status = status
      if (itemId) params.itemId = itemId
      if (keyword && keyword.trim()) params.keyword = keyword.trim()

      const res = await apiClient.get('/claims', { params })
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải danh sách yêu cầu nhận đồ'), { cause: error })
    }
  },

  async getClaimById(claimId) {
    try {
      const res = await apiClient.get(`/claims/${claimId}`)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể tải chi tiết yêu cầu nhận đồ'), { cause: error })
    }
  },

  async getClaimProofs(claimId) {
    try {
      const res = await apiClient.get(`/claims/${claimId}/proofs`)
      return res.data.data || []
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể đọc bằng chứng đối chiếu'), { cause: error })
    }
  },

  async completeHandover(claimId, { note = '', handoverAt = '' } = {}) {
    try {
      const payload = {}
      if (note && note.trim()) payload.note = note.trim()
      if (handoverAt) payload.handoverAt = handoverAt

      const res = await apiClient.post(`/claims/${claimId}/handover`, payload)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể xác nhận bàn giao đồ'), { cause: error })
    }
  },

  async rejectClaim(claimId, { note = '' } = {}) {
    try {
      const res = await apiClient.post(`/claims/${claimId}/reject`, {
        note: note.trim(),
      })
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể từ chối yêu cầu nhận đồ'), { cause: error })
    }
  },

  async withdrawClaim(claimId) {
    try {
      const res = await apiClient.post(`/claims/${claimId}/withdraw`)
      return res.data.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Không thể rút lại yêu cầu nhận đồ'), { cause: error })
    }
  },
}
