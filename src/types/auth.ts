export interface User {
  id: string
  name: string
  email: string
  role: string
  company: string
  avatar?: string
  licenseKey: string
  licenseType: 'Enterprise AI' | 'Professional' | 'Starter'
  licenseExpiry: string
  licenseStatus: 'active' | 'expired' | 'suspended'
}

export interface License {
  id: string
  key: string
  userEmail: string
  userName: string
  company: string
  plan: 'Enterprise AI' | 'Professional' | 'Starter'
  expiryDate: string
  status: 'active' | 'expired' | 'suspended'
  maxUsers: number
  activeModules: number
  createdAt: string
}
