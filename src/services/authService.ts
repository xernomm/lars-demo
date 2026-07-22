import { User, License } from '../types/auth'

const STORAGE_KEY_USER = 'shipyardos_current_user'
const STORAGE_KEY_LICENSES = 'shipyardos_licenses'
const STORAGE_KEY_ADMIN = 'shipyardos_admin_session'

const defaultUser: User = {
  id: 'USR-001',
  name: 'Ir. Budi Santoso',
  email: 'budi.santoso@shipyardos.ai',
  role: 'Superintendent Galangan',
  company: 'PT Nusantara Shipyard Enterprise',
  licenseKey: 'SHIPOS-ENT-2026-X9872',
  licenseType: 'Enterprise AI',
  licenseExpiry: '2027-12-31',
  licenseStatus: 'active',
}

const defaultLicenses: License[] = [
  {
    id: 'LIC-001',
    key: 'SHIPOS-ENT-2026-X9872',
    userEmail: 'budi.santoso@shipyardos.ai',
    userName: 'Ir. Budi Santoso',
    company: 'PT Nusantara Shipyard Enterprise',
    plan: 'Enterprise AI',
    expiryDate: '2027-12-31',
    status: 'active',
    maxUsers: 50,
    activeModules: 16,
    createdAt: '2026-01-01',
  },
  {
    id: 'LIC-002',
    key: 'SHIPOS-PRO-2026-Y4410',
    userEmail: 'andi.ramadhan@shipyardos.ai',
    userName: 'Ir. Andi Ramadhan',
    company: 'PT Marine Utama Karya',
    plan: 'Professional',
    expiryDate: '2026-10-15',
    status: 'active',
    maxUsers: 15,
    activeModules: 10,
    createdAt: '2026-02-10',
  },
  {
    id: 'LIC-003',
    key: 'SHIPOS-STR-2026-Z1109',
    userEmail: 'dewi.kurnia@shipyardos.ai',
    userName: 'Ir. Dewi Kurnia',
    company: 'CV Bahari Teknik',
    plan: 'Starter',
    expiryDate: '2026-06-01',
    status: 'expired',
    maxUsers: 5,
    activeModules: 5,
    createdAt: '2025-06-01',
  },
]

export function getCurrentUser(): User {
  const data = localStorage.getItem(STORAGE_KEY_USER)
  if (!data) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser))
    return defaultUser
  }
  return JSON.parse(data)
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
}

export function getLicenses(): License[] {
  const data = localStorage.getItem(STORAGE_KEY_LICENSES)
  if (!data) {
    localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(defaultLicenses))
    return defaultLicenses
  }
  return JSON.parse(data)
}

export function saveLicenses(licenses: License[]): void {
  localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(licenses))
}

export function updateLicenseExpiry(key: string, newExpiryDate: string, status?: 'active' | 'expired' | 'suspended'): License[] {
  const licenses = getLicenses()
  const updated = licenses.map(l => {
    if (l.key === key) {
      return {
        ...l,
        expiryDate: newExpiryDate,
        status: status || l.status,
      }
    }
    return l
  })
  saveLicenses(updated)

  // If current user holds this license, sync current user state too
  const currentUser = getCurrentUser()
  if (currentUser.licenseKey === key) {
    const targetLic = updated.find(l => l.key === key)
    if (targetLic) {
      setCurrentUser({
        ...currentUser,
        licenseExpiry: targetLic.expiryDate,
        licenseStatus: targetLic.status,
      })
    }
  }

  return updated
}

export function toggleLicenseStatus(key: string, newStatus: 'active' | 'expired' | 'suspended'): License[] {
  const licenses = getLicenses()
  const updated = licenses.map(l => {
    if (l.key === key) {
      return { ...l, status: newStatus }
    }
    return l
  })
  saveLicenses(updated)

  const currentUser = getCurrentUser()
  if (currentUser.licenseKey === key) {
    setCurrentUser({
      ...currentUser,
      licenseStatus: newStatus,
    })
  }

  return updated
}

export function generateNewLicense(
  userName: string,
  userEmail: string,
  company: string,
  plan: 'Enterprise AI' | 'Professional' | 'Starter',
  daysValid: number = 365
): License {
  const licenses = getLicenses()
  const randomCode = Math.floor(1000 + Math.random() * 9000)
  const prefix = plan === 'Enterprise AI' ? 'ENT' : plan === 'Professional' ? 'PRO' : 'STR'
  const key = `SHIPOS-${prefix}-2026-X${randomCode}`

  const now = new Date()
  const expiry = new Date()
  expiry.setDate(now.getDate() + daysValid)
  const expiryDateStr = expiry.toISOString().split('T')[0]

  const newLic: License = {
    id: `LIC-00${licenses.length + 1}`,
    key,
    userEmail,
    userName,
    company,
    plan,
    expiryDate: expiryDateStr,
    status: 'active',
    maxUsers: plan === 'Enterprise AI' ? 50 : plan === 'Professional' ? 15 : 5,
    activeModules: plan === 'Enterprise AI' ? 16 : plan === 'Professional' ? 10 : 5,
    createdAt: now.toISOString().split('T')[0],
  }

  const updated = [newLic, ...licenses]
  saveLicenses(updated)
  return newLic
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEY_ADMIN) === 'true'
}

export function setAdminLoggedIn(status: boolean): void {
  localStorage.setItem(STORAGE_KEY_ADMIN, status ? 'true' : 'false')
}
