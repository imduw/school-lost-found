import { mockItems } from '../data/mock/items.mock'
import { mockCategories } from '../data/mock/categories.mock'
import { mockLocations } from '../data/mock/locations.mock'

export const itemService = {
  async getCategories() {
    return [...mockCategories]
  },

  async getLocations() {
    return [...mockLocations]
  },

  async getItems({ type = 'ALL', categoryId = 'all', locationId = 'all', keyword = '', sort = 'newest' } = {}) {
    // Giả lập độ trễ mạng nhẹ 150ms
    await new Promise(resolve => setTimeout(resolve, 150))

    let result = [...mockItems]

    if (type !== 'ALL') {
      result = result.filter(item => item.itemType === type)
    }

    if (categoryId && categoryId !== 'all') {
      result = result.filter(item => item.categoryId === categoryId)
    }

    if (locationId && locationId !== 'all') {
      result = result.filter(item => {
        const loc = mockLocations.find(l => l.id === locationId)
        return loc ? item.location.toLowerCase().includes(loc.name.toLowerCase().split('(')[0].trim()) : true
      })
    }

    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim()
      result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      )
    }

    if (sort === 'newest') {
      result.sort((a, b) => b.id - a.id)
    }

    return result
  },

  async getItemById(id) {
    await new Promise(resolve => setTimeout(resolve, 100))
    const item = mockItems.find(i => i.id === Number(id))
    return item || null
  }
}

