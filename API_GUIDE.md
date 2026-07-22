# API Service Guide

Panduan lengkap menggunakan `apiService.ts` untuk integrasi backend.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
- [Error Handling](#error-handling)
- [Examples](#examples)

## 🚀 Quick Start

### Basic GET Request
```typescript
import { apiService } from '@/services/apiService'

async function fetchProjects() {
  try {
    const projects = await apiService.get<Project[]>('/projects')
    console.log('Projects:', projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}
```

### Basic POST Request
```typescript
async function createProject(data) {
  const response = await apiService.post('/projects', {
    name: data.name,
    code: data.code,
  })
  return response
}
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001

# Request timeout (milliseconds)
VITE_API_TIMEOUT=30000

# Enable mock data for development
VITE_ENABLE_MOCK_DATA=true
```

### Dynamic Configuration

```typescript
import { apiService } from '@/services/apiService'

// Change base URL at runtime
apiService.setBaseURL('https://api.production.com')

// Add authentication header
apiService.setHeader('Authorization', `Bearer ${token}`)

// Remove header
apiService.removeHeader('Authorization')

// Toggle mock data
apiService.setEnableMockData(false)
```

## 📌 Basic Usage

### GET - Fetch Data

```typescript
// Simple GET
const data = await apiService.get('/users')

// GET with query parameters (via URL)
const users = await apiService.get('/users?page=1&limit=10')

// GET with custom options
const cached = await apiService.get('/data', {
  enableMockData: false, // Override mock data setting
})
```

### POST - Create Data

```typescript
const newProject = {
  name: 'Barge 300 FT',
  code: '#001',
  status: 'planning',
}

const response = await apiService.post('/projects', newProject)
```

### PUT - Update Data

```typescript
const updated = {
  name: 'Barge 300 FT',
  status: 'in-progress',
  progress: 75,
}

const response = await apiService.put('/projects/1', updated)
```

### DELETE - Remove Data

```typescript
const response = await apiService.delete('/projects/1')
```

## 🔧 Advanced Features

### Request Interceptors

Otomatis log semua requests:
```typescript
// Log format:
// [API] Request: GET /endpoint
// [API] Request: POST /endpoint
```

### Response Interceptors

Otomatis log responses:
```typescript
// Log format:
// [API] Response: 200 { data... }
// [API] Response Error: 404 not found
```

### Mock Data Support

```typescript
// Enable mock data globally
apiService.setEnableMockData(true)

// Override per-request
const data = await apiService.get('/users', {
  enableMockData: false, // Use real API
})
```

Mock data akan delay 300ms untuk simulate network latency.

### Custom Headers

```typescript
// Add authentication
apiService.setHeader('Authorization', `Bearer ${authToken}`)

// Add custom headers
apiService.setHeader('X-API-Key', 'your-api-key')
apiService.setHeader('X-Client-Version', '1.0.0')

// Remove header
apiService.removeHeader('Authorization')
```

## ❌ Error Handling

### Try-Catch Pattern

```typescript
try {
  const data = await apiService.get('/projects')
  // Success handling
} catch (error) {
  console.error('Error:', error.message)
  // Error handling
}
```

### HTTP Status Errors

```typescript
try {
  await apiService.delete('/projects/999')
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Project not found')
  } else if (error.response?.status === 401) {
    console.log('Unauthorized - redirect to login')
  }
}
```

### Timeout Handling

```typescript
try {
  await apiService.get('/slow-endpoint')
} catch (error) {
  if (error.code === 'ECONNABORTED') {
    console.log('Request timeout')
  }
}
```

## 📚 Examples

### Example 1: Fetch Project Data

```typescript
// File: src/hooks/useProject.ts
import { apiService } from '@/services/apiService'
import { useState, useEffect } from 'react'

export function useProject(projectId: string) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await apiService.get(`/projects/${projectId}`)
        setProject(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [projectId])

  return { project, loading, error }
}
```

### Example 2: Create Production Record

```typescript
async function recordProductionStep(stepId: number, data: any) {
  try {
    const response = await apiService.post(
      `/production/${stepId}`,
      {
        status: data.status,
        timestamp: new Date().toISOString(),
        notes: data.notes,
      }
    )
    return response
  } catch (error) {
    console.error('Failed to record production step:', error)
    throw error
  }
}
```

### Example 3: Update Module Status

```typescript
async function updateModuleStatus(moduleId: string, status: string) {
  try {
    const response = await apiService.put(
      `/modules/${moduleId}`,
      {
        status,
        updatedAt: new Date().toISOString(),
      }
    )
    return response
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Module not found')
    }
    throw error
  }
}
```

### Example 4: Batch Operations

```typescript
async function syncAllProjects(projects: Project[]) {
  const results = await Promise.allSettled(
    projects.map(project =>
      apiService.put(`/projects/${project.id}`, project)
    )
  )

  const successful = results.filter(r => r.status === 'fulfilled')
  const failed = results.filter(r => r.status === 'rejected')

  console.log(`Synced: ${successful.length}, Failed: ${failed.length}`)
  return { successful, failed }
}
```

### Example 5: Authentication Flow

```typescript
async function loginUser(email: string, password: string) {
  try {
    const response = await apiService.post('/auth/login', {
      email,
      password,
    })

    // Store token
    localStorage.setItem('authToken', response.token)

    // Set header untuk future requests
    apiService.setHeader('Authorization', `Bearer ${response.token}`)

    return response
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

async function logoutUser() {
  try {
    await apiService.post('/auth/logout', {})
    localStorage.removeItem('authToken')
    apiService.removeHeader('Authorization')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
```

## 🔐 Security Best Practices

### 1. Token Management
```typescript
// Simpan token di secure storage
const token = localStorage.getItem('authToken') // atau sessionStorage
apiService.setHeader('Authorization', `Bearer ${token}`)
```

### 2. Validate Input
```typescript
function validateProjectData(data: any) {
  if (!data.name || !data.code) {
    throw new Error('Missing required fields')
  }
  return true
}

async function createProject(data: any) {
  validateProjectData(data)
  return apiService.post('/projects', data)
}
```

### 3. Handle Sensitive Data
```typescript
// Don't log sensitive data
async function sensitiveOperation(apiKey: string) {
  // apiKey won't be logged
  return apiService.post('/sensitive', { apiKey })
}
```

## 🔄 Integration with React Components

### Using in Components

```typescript
// src/components/ProjectList.tsx
import { useState, useEffect } from 'react'
import { apiService } from '@/services/apiService'

export function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await apiService.get('/projects')
        setProjects(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

## 📊 API Response Types

Define TypeScript interfaces untuk type safety:

```typescript
// src/types/index.ts
export interface Project {
  id: string
  name: string
  code: string
  status: 'planning' | 'in-progress' | 'completed'
  progress: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
}
```

Usage:
```typescript
const projects = await apiService.get<Project[]>('/projects')
const response = await apiService.post<ApiResponse<Project>>('/projects', data)
```

## 🎯 Common Patterns

### Pattern 1: Polling
```typescript
async function pollProjectStatus(projectId: string) {
  const interval = setInterval(async () => {
    const project = await apiService.get(`/projects/${projectId}`)
    if (project.status === 'completed') {
      clearInterval(interval)
      console.log('Project completed!')
    }
  }, 5000) // Poll every 5 seconds
}
```

### Pattern 2: Retry Logic
```typescript
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

// Usage
const data = await retryRequest(() =>
  apiService.get('/unreliable-endpoint')
)
```

### Pattern 3: Debounced Search
```typescript
import { debounce } from 'lodash'

const searchProjects = debounce(
  async (query: string) => {
    const results = await apiService.get(`/projects/search?q=${query}`)
    return results
  },
  300
)
```

---

**Last Updated**: 2024
**Version**: 1.0.0
