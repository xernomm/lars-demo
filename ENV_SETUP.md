# Environment Setup Guide

Panduan lengkap setup dan konfigurasi environment variables untuk ShipyardOS AI Dashboard.

## 📝 File Configuration

### `.env` - Development Environment
Gunakan file ini untuk development local. **Jangan commit ke git!**

```bash
# Buat dari template
cp .env.example .env
```

### `.env.example` - Template
File template untuk reference. **Safe untuk commit.**

### `.env.production` (Optional)
Untuk production builds:
```env
VITE_API_BASE_URL=https://api.shipyardos.com
VITE_API_TIMEOUT=60000
VITE_ENABLE_MOCK_DATA=false
VITE_APP_NAME=ShipyardOS AI Dashboard
```

## 🔧 Environment Variables

### VITE_API_BASE_URL
**Tujuan**: URL endpoint backend API server

**Format**: `http://host:port` atau `https://domain`

**Contoh**:
```env
# Development (Local)
VITE_API_BASE_URL=http://localhost:3001

# Staging
VITE_API_BASE_URL=https://api-staging.shipyardos.com

# Production
VITE_API_BASE_URL=https://api.shipyardos.com
```

**Default**: `http://localhost:3001`

---

### VITE_API_TIMEOUT
**Tujuan**: Request timeout dalam milliseconds

**Format**: `[number]` (milliseconds)

**Contoh**:
```env
# 30 detik (Development)
VITE_API_TIMEOUT=30000

# 60 detik (Production - slower networks)
VITE_API_TIMEOUT=60000

# 10 detik (Fast-paced services)
VITE_API_TIMEOUT=10000
```

**Default**: `30000` (30 seconds)

**Tips**:
- Gunakan timeout lebih panjang untuk network yang tidak stabil
- Gunakan timeout lebih pendek untuk better UX feedback

---

### VITE_ENABLE_MOCK_DATA
**Tujuan**: Enable/disable mock data untuk development

**Format**: `true` atau `false` (string)

**Contoh**:
```env
# Development - gunakan mock data
VITE_ENABLE_MOCK_DATA=true

# Production - use real API
VITE_ENABLE_MOCK_DATA=false
```

**Default**: `true`

**Behavior**:
- `true`: API calls akan return mock data (300ms delay untuk simulate network)
- `false`: API calls akan hit real backend endpoint

---

### VITE_APP_NAME
**Tujuan**: Nama aplikasi (untuk display/logging)

**Format**: String bebas

**Contoh**:
```env
VITE_APP_NAME=ShipyardOS AI Dashboard
VITE_APP_NAME=ShipyardOS Dev
VITE_APP_NAME=ShipyardOS Staging
```

**Default**: `ShipyardOS AI Dashboard`

---

## 🚀 Setup Scenarios

### Scenario 1: Local Development

```env
# .env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
VITE_ENABLE_MOCK_DATA=true
VITE_APP_NAME=ShipyardOS AI Dashboard
```

**Commands**:
```bash
pnpm dev           # Start dev server on http://localhost:5173
pnpm build         # Build for production
pnpm preview       # Preview build locally
```

---

### Scenario 2: Backend Development (Real API)

```env
# .env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
VITE_ENABLE_MOCK_DATA=false
VITE_APP_NAME=ShipyardOS AI Dashboard
```

**Prasyarat**:
- Backend server running on `http://localhost:3001`
- API endpoints ready

**Troubleshoot**:
```bash
# Test API connection
curl http://localhost:3001/health

# Check frontend is hitting API
# Open DevTools → Network tab
pnpm dev
```

---

### Scenario 3: Staging Environment

```env
# .env.staging
VITE_API_BASE_URL=https://api-staging.shipyardos.com
VITE_API_TIMEOUT=45000
VITE_ENABLE_MOCK_DATA=false
VITE_APP_NAME=ShipyardOS Staging
```

**Build & Deploy**:
```bash
# Build
pnpm build

# Optionally use staging env
pnpm exec vite build --mode staging

# Deploy to staging server
# (depends on your deployment platform)
```

---

### Scenario 4: Production

```env
# .env.production
VITE_API_BASE_URL=https://api.shipyardos.com
VITE_API_TIMEOUT=60000
VITE_ENABLE_MOCK_DATA=false
VITE_APP_NAME=ShipyardOS AI Dashboard
```

**Production Build**:
```bash
# Build optimized production bundle
pnpm build

# Output: dist/ folder
# Deploy dist/ to CDN or web server
```

---

## 🔄 Switching Environments

### Method 1: Edit .env file
```bash
# Edit manually
nano .env
# Change VITE_API_BASE_URL to target environment
```

### Method 2: Multiple env files
```bash
# Create env files
.env              # Default (development)
.env.staging      # Staging
.env.production   # Production

# Build for specific environment
pnpm exec vite build --mode staging
pnpm exec vite build --mode production
```

### Method 3: Command line override
```bash
# Override at build time (Not supported by default, needs config)
# Better to use .env files approach above
```

---

## 🐛 Debugging Environment Setup

### Check Current Environment

```bash
# View current env values
cat .env

# On Windows
type .env
```

### Debug API Connection

```typescript
// Add to src/App.tsx or any component temporarily
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
console.log('Mock Data Enabled:', import.meta.env.VITE_ENABLE_MOCK_DATA)
console.log('App Name:', import.meta.env.VITE_APP_NAME)
```

### Test API Service

```typescript
// In DevTools console
import { apiService } from '@/services/apiService'

// Test API call
apiService.get('/test')
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err))
```

### Network Debugging

```bash
# Monitor API calls
# 1. Open DevTools → Network tab
# 2. Make API request
# 3. Check request headers and response
# 4. Verify VITE_API_BASE_URL is correct
```

---

## ✅ Common Issues & Solutions

### Issue 1: "Cannot reach API"

**Symptoms**:
- Network errors in console
- API calls timing out

**Solutions**:
```bash
# 1. Check API server running
curl http://localhost:3001/health

# 2. Verify VITE_API_BASE_URL in .env
cat .env

# 3. Restart dev server
pnpm dev

# 4. Clear browser cache
# DevTools → Application → Clear Storage
```

---

### Issue 2: "Mock data not working"

**Symptoms**:
- API returns 404 even with mock enabled

**Solutions**:
```env
# Ensure mock data is enabled
VITE_ENABLE_MOCK_DATA=true
```

```bash
# Restart dev server after changing .env
pnpm dev
```

---

### Issue 3: "Timeout errors"

**Symptoms**:
- Request timeout on slow networks

**Solutions**:
```env
# Increase timeout value
VITE_API_TIMEOUT=60000  # 60 seconds

# Or check if backend is slow
# Monitor backend response times
```

---

### Issue 4: ".env not being read"

**Symptoms**:
- Environment variables showing `undefined`

**Solutions**:
```bash
# 1. Verify .env file in root directory
ls -la .env

# 2. Ensure variable is prefixed with VITE_
VITE_API_BASE_URL=...  # ✅ Correct
API_BASE_URL=...       # ❌ Won't work (needs VITE_ prefix)

# 3. Restart dev server (CRITICAL!)
pnpm dev

# 4. Clear node_modules cache if needed
rm -rf node_modules
pnpm install
```

---

## 🔐 Security Considerations

### ❌ DON'T:
- Commit `.env` file dengan sensitive data
- Store passwords di `.env`
- Share API keys dalam `.env` files
- Use production URLs during development

### ✅ DO:
- Add `.env` to `.gitignore`
- Use `.env.example` untuk reference
- Rotate API keys regularly
- Use environment-specific keys

### .gitignore Example
```gitignore
# Environment files
.env
.env.local
.env.*.local

# Keep this as template
!.env.example
```

---

## 📦 Environment-Specific Configurations

### Development
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
VITE_ENABLE_MOCK_DATA=true
VITE_APP_NAME=ShipyardOS Dev
```
**Features**: Mock data, longer timeout, verbose logging

### Staging
```env
VITE_API_BASE_URL=https://api-staging.shipyardos.com
VITE_API_TIMEOUT=45000
VITE_ENABLE_MOCK_DATA=false
VITE_APP_NAME=ShipyardOS Staging
```
**Features**: Real API, moderate timeout

### Production
```env
VITE_API_BASE_URL=https://api.shipyardos.com
VITE_API_TIMEOUT=60000
VITE_ENABLE_MOCK_DATA=false
VITE_APP_NAME=ShipyardOS
```
**Features**: Real API, longer timeout, minimal logging

---

## 🔗 Backend Integration Checklist

- [ ] Backend API server running
- [ ] API endpoints documented
- [ ] `VITE_API_BASE_URL` pointing to correct backend
- [ ] CORS configured on backend
- [ ] Authentication/headers setup if needed
- [ ] Test API with Postman/curl
- [ ] Test frontend API calls in DevTools
- [ ] Error handling implemented

---

## 📚 Useful Commands

```bash
# Check environment values
cat .env

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Validate TypeScript
pnpm exec tsc --noEmit

# List environment variables
printenv | grep VITE_
```

---

## 🆘 Getting Help

1. Check console logs: `pnpm dev` output
2. Open DevTools (F12) → Console tab
3. Check Network tab untuk API calls
4. Verify `.env` file exists dan readable
5. Restart dev server (`pnpm dev`)

---

**Last Updated**: 2024
**Version**: 1.0.0
