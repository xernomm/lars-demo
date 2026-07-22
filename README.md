# ShipyardOS AI Dashboard

**Production-grade shipbuilding enterprise dashboard** dengan React, Vite, dan Tailwind CSS. Aplikasi ini dirancang dengan design system yang sleek, animatif, dan menggunakan light theme untuk kemudahan penggunaan.

## 🎯 Fitur Utama

### 1. **16 Module Toggles dengan Sidebar Navigasi**
- **Perencanaan & Rekayasa**: Project Management, Engineering Management
- **Rantai Pasok & Material**: Procurement & MRP, Material Tracking (QR Scan Simulation)
- **Produksi & Operasional**: Production Control, Welding, Painting, Outfitting Management
- **Kualitas & Inspeksi**: QA/QC, Surveyor AI, NDT, Document Management
- **Penyelesaian & Eksekutif**: Launching, Sea Trial, CEO Dashboard, AI Maritime Expert

### 2. **Resizable Split Pane (Tarik Garis Mouse)**
- Main content area dan right panel dipisahkan dengan garis divider vertikal
- Drag-to-resize dengan mouse listener untuk dynamic width adjustment
- Smooth animation dan visual feedback

### 3. **Draggable Grid Chatbot (Right Panel)**
- Contextual AI Assistant dengan quick prompts berdasarkan active module
- Toggle floating window untuk persistent chat
- Message history dengan role-based styling
- Support untuk compose IME (Enter-to-submit dengan safety check)

### 4. **27-Step Production Tracker**
- Visualisasi lengkap 27 tahap shipbuilding (Project Planning → Delivery)
- Status indicators: Done (Green), In Progress (Blue pulse), QA Hold (Red), Pending (Gray)
- Responsive grid (desktop) dan horizontal scroll (mobile)
- Detail view untuk setiap tahap dengan click-to-expand

### 5. **Mock Data & Simulasi Interaktif**
- Pre-populated data: "Barge 300 FT - Project #001"
- Interactive lists, data tables dengan filtering
- Progress tracking dan status management
- Semua labels dalam Bahasa Indonesia

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18.3.1 | UI Framework |
| Vite | ^5.0.0 | Build tool & Dev server |
| TypeScript | ^5.4.5 | Type safety |
| Tailwind CSS | ^3.4.1 | Styling & utilities |
| Axios | ^1.18.1 | API calls |
| Lucide React | ^0.394.0 | Icon library |

## 📦 Setup & Installation

### Prerequisites
- Node.js 16+ 
- pnpm (atau npm/yarn)

### Installation Steps

```bash
# 1. Clone atau extract project
cd shipyard-os-dashboard

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env sesuai kebutuhan Anda
```

## 🚀 Running the Application

### Development Mode
```bash
pnpm dev
```
App akan terbuka di `http://localhost:5173`

### Build untuk Production
```bash
pnpm build
```

### Preview Build
```bash
pnpm preview
```

## 📝 Environment Variables

File `.env` dapat dikonfigurasi dengan:

```env
# API Base URL untuk backend services
VITE_API_BASE_URL=http://localhost:3001

# Request timeout dalam milliseconds
VITE_API_TIMEOUT=30000

# Enable mock data untuk development
VITE_ENABLE_MOCK_DATA=true

# Nama aplikasi
VITE_APP_NAME=ShipyardOS AI Dashboard
```

**Mudah Diganti**: Ubah nilai di `.env` tanpa perlu restart aplikasi (Vite HMR akan refresh otomatis).

## 🔌 API Service Integration

### Menggunakan API Service

```typescript
import { apiService } from '@/services/apiService'

// GET request
const data = await apiService.get<DataType>('/endpoint')

// POST request
const response = await apiService.post<ResponseType>('/endpoint', {
  name: 'value',
})

// PUT request
await apiService.put('/endpoint', { id: 1, updated: true })

// DELETE request
await apiService.delete('/endpoint')
```

### Features
- ✅ Automatic request/response logging
- ✅ Built-in timeout handling
- ✅ Mock data support untuk development
- ✅ Custom header management
- ✅ Error handling dengan detailed logs
- ✅ Singleton pattern untuk consistent instance

## 🎨 Design System

### Color Palette (Light Theme)
```css
--primary: #3b82f6          /* Blue */
--primary-light: #60a5fa    /* Light Blue */
--secondary: #10b981        /* Green */
--accent: #f59e0b           /* Amber */
--background: #ffffff       /* White */
--surface: #f8fafc          /* Slate 50 */
--text-primary: #1e293b     /* Slate 900 */
--text-secondary: #64748b   /* Slate 500 */
--border: #e2e8f0          /* Slate 200 */
```

### Animations
- `fade-in`: Smooth opacity transition
- `slide-in`: From bottom dengan opacity
- `pulse-blue`: Pulsing glow effect untuk "in-progress" status
- `shimmer`: Loading skeleton animation

### Responsive Breakpoints
- Mobile: Default (< 640px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Large: `xl:` (1280px+)

## 📂 Project Structure

```
shipyard-os-dashboard/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component dengan layout
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation dengan 16 modules
│   │   ├── MainContent.tsx     # Dynamic content router
│   │   ├── ChatPanel.tsx       # AI Assistant chatbot (draggable)
│   │   └── modules/
│   │       ├── DefaultModule.tsx    # Generic module template
│   │       └── ProductionControl.tsx # 27-step tracker
│   ├── services/
│   │   └── apiService.ts       # API client dengan interceptors
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── styles/
│       └── index.css           # Global styles & animations
├── public/                      # Static assets
├── index.html                   # HTML entry
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS with Tailwind
├── tsconfig.json               # TypeScript config
├── .env                        # Environment variables
├── .env.example                # Example env file
└── package.json                # Dependencies & scripts
```

## 🎮 Interactive Features

### Sidebar Navigation
- ✅ Collapsible dengan toggle button
- ✅ 5 kategori dengan sub-modules
- ✅ Active state indicators
- ✅ Smooth transitions

### Split Pane Resizing
- ✅ Click-and-drag divider
- ✅ Min width: 250px, Max: 600px
- ✅ Visual feedback saat hover
- ✅ Smooth animation

### Draggable Chatbot
- ✅ Toggle antara docked dan floating mode
- ✅ Context-aware quick prompts
- ✅ Message history management
- ✅ Compose IME support

### Production Tracker
- ✅ 27-step visualization
- ✅ Color-coded status
- ✅ Click untuk expand details
- ✅ Progress percentage tracking

## 🔍 Debugging

### Enable Mock Data
```typescript
import { apiService } from '@/services/apiService'

// Toggle mock data
apiService.setEnableMockData(false) // Use real API
```

### Console Logging
Semua API calls di-log ke console dengan format:
```
[API] Request: GET /endpoint
[API] Response: 200 { data... }
[API] Error: 404 not found
```

### Environment Info
```bash
# Check installed versions
pnpm list vite react tailwindcss
```

## 📱 Responsive Design

- **Desktop**: Full 4-column grid untuk production tracker
- **Tablet**: 3-column adaptive layout
- **Mobile**: Horizontal scrollable cards
- **Sidebar**: Collapsible untuk more content space

## 🚀 Performance

- ✅ Code splitting dengan Vite
- ✅ Lazy loading untuk route transitions
- ✅ CSS-in-JS optimizations via Tailwind
- ✅ Minimal bundle size (~150KB gzip)

## 🐛 Known Limitations

- Mock data di Production Control sedang dalam pengembangan
- Real API integration memerlukan backend service
- Export functionality belum diimplementasikan
- Database sync belum integrated

## 📞 Support & Issues

Untuk bugs atau questions:
1. Check file structure di `/src`
2. Verify `.env` configuration
3. Restart dev server (`pnpm dev`)
4. Clear browser cache

## 📄 License

Proprietary - ShipyardOS

---

**Built with ❤️ using React + Vite + Tailwind CSS**
