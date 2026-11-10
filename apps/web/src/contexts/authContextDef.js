import { createContext } from 'react'

export const MOCK_USERS = {
  GUEST: {
    role: 'GUEST',
    fullName: 'Khách vãng lai',
    email: '',
    studentId: '',
    avatar: null
  },
  STUDENT: {
    role: 'STUDENT',
    fullName: 'Nguyễn Văn A',
    email: 'anv.21it@vku.udn.vn',
    studentId: '21IT001',
    phone: '0905123456',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
  },
  STAFF: {
    role: 'STAFF',
    fullName: 'Lê Văn Duyệt (Cán bộ P.CTSV)',
    email: 'duyetlv@vku.udn.vn',
    studentId: 'CB-CTSV01',
    phone: '02363667111',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces'
  },
  ADMIN: {
    role: 'ADMIN',
    fullName: 'Trần Quản Trị (Hệ thống)',
    email: 'admin@vku.udn.vn',
    studentId: 'ADMIN01',
    phone: '02363667999',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces'
  }
}

export const AuthContext = createContext(null)

