import {
  sdgsData,
  getDashboardStats,
  getMockMetadata,
  getMockSummary,
  getMockSdgDetail,
  getMockRecordDetail,
  addMockRecord,
  getRecentProjects,
} from '../data/mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

let accessToken = localStorage.getItem('access_token')
let refreshToken = localStorage.getItem('refresh_token')

export const setTokens = (access, refresh) => {
  accessToken = access
  refreshToken = refresh
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export const clearTokens = () => {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error('Invalid credentials')
  }

  const data = await response.json()
  setTokens(data.access, data.refresh)
  return data
}

export const logout = () => {
  clearTokens()
  window.location.href = '/login'
}

export const refreshAccessToken = async () => {
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!response.ok) {
    clearTokens()
    throw new Error('Session expired. Please login again.')
  }

  const data = await response.json()
  accessToken = data.access
  localStorage.setItem('access_token', data.access)
  return data.access
}

const request = async (path, options = {}, retry = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401 && retry && refreshToken) {
    try {
      await refreshAccessToken()
      return request(path, options, false)
    } catch (error) {
      clearTokens()
      console.error('Token refresh failed:', error)
      throw new Error('Session expired. Please login again.')
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody?.message || 'Failed to load data from the server.'
    throw new Error(message)
  }

  return response.json()
}

export const isAuthenticated = () => !!accessToken


// ============ Activities (with mock data fallback) =============

export const fetchActivities = async (type = null) => {
  try {
    const params = type ? `?activity_type=${type}` : ''
    const response = await request(`/activities/${params}`)
    // Check if response has data
    const results = response?.results || response
    if (results && results.length > 0) {
      return response
    }
    throw new Error('No data returned')
  } catch (error) {
    console.warn('Falling back to mock activities:', error.message)
    return { results: [] }
  }
}

export const fetchProjects = async () => {
  return await fetchActivities('project')
}

export const fetchPublications = async () => {
  return await fetchActivities('publication')
}

export const fetchActivityDetail = async (id) => {
  try {
    return await request(`/activities/${id}/`)
  } catch (error) {
    console.warn('Falling back to mock activity detail:', error.message)
    return getMockRecordDetail(id)
  }
}

export const createActivity = async (payload) => {
  try {
    return await request('/activities/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.warn('Storing activity using mock store:', error.message)
    return addMockRecord(payload)
  }
}

// ========== SDG Goals (with mock data fallback) ==========

export const fetchSDGs = async () => {
  try {
    const response = await request('/sdg/')
    const results = response?.results || response
    if (results && results.length > 0) {
      return results
    }
    throw new Error('No data returned')
  } catch (error) {
    console.warn('Falling back to mock SDGs:', error.message)
    return sdgsData
  }
}

export const fetchSDGActivities = async (sdgNumber) => {
  try {
    const response = await request(`/sdg/${sdgNumber}/activities/`)
    if (response && response.length > 0) {
      return response
    }
    throw new Error('No data returned')
  } catch (error) {
    console.warn('Falling back to mock SDG activities:', error.message)
    return []
  }
}

export const fetchSDGSummary = async (sdgNumber) => {
  try {
    return await request(`/sdg/${sdgNumber}/summary/`)
  } catch (error) {
    console.warn('Falling back to mock SDG summary:', error.message)
    return getMockSdgDetail(sdgNumber)
  }
}

// ========== Reports (with mock data fallback) ==========

export const fetchDashboardSummary = async () => {
  try {
    const response = await request('/reports/summary/')
    if (response) {
      return response
    }
    throw new Error('No data returned')
  } catch (error) {
    console.warn('Falling back to mock dashboard summary:', error.message)
    return getMockSummary()
  }
}

// ========== Dashboard Stats ==========

export const fetchDashboardStats = async () => {
  try {
    const response = await request('/reports/summary/')
    if (response?.totals) {
      return response.totals
    }
    throw new Error('No data returned')
  } catch (error) {
    console.warn('Falling back to mock dashboard stats:', error.message)
    return getDashboardStats()
  }
}

// ========== Recent Data ==========

export const fetchRecentProjects = async (limit = 5) => {
  try {
    const response = await request(`/activities/?activity_type=project&ordering=-date_created&limit=${limit}`)
    const results = response?.results || response
    if (results && results.length > 0) {
      return results.slice(0, limit)
    }
    throw new Error('No data returned')
  } catch (error) {
    console.warn('Falling back to mock recent projects:', error.message)
    return getRecentProjects(limit)
  }
}

// ========== Mock Data Fallbacks ==========


export const fetchMetadata = async () => {
  try {
    return await request('/metadata')
  } catch (error) {
    console.warn('Falling back to mock metadata:', error.message)
    return getMockMetadata()
  }
}

export const fetchReportSummary = async () => {
  try {
    return await request('/reports/summary')
  } catch (error) {
    console.warn('Falling back to mock reports summary:', error.message)
    return getMockSummary()
  }
}

export const fetchSdgDetail = async (sdgId) => {
  try {
    return await request(`/reports/sdg/${sdgId}`)
  } catch (error) {
    console.warn(`Falling back to mock SDG detail for ${sdgId}:`, error.message)
    const detail = getMockSdgDetail(sdgId)
    if (!detail) {
      throw error
    }
    return detail
  }
}

export const fetchRecordDetail = async (recordId) => {
  try {
    return await request(`/records/${recordId}`)
  } catch (error) {
    console.warn(`Falling back to mock record detail for ${recordId}:`, error.message)
    const detail = getMockRecordDetail(recordId)
    if (!detail) {
      throw error
    }
    return detail
  }
}

export const createRecord = async (payload) => {
  try {
    return await request('/records', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.warn('Storing record using mock store:', error.message)
    const record = addMockRecord(payload)
    return { record }
  }
}

export const createResearcher = async (payload) => {
  try {
    return await request('/metadata/researchers', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.warn('Creating researcher using mock store:', error.message)
    const id = `res-${Date.now()}`
    const researcher = { id, name: payload.name, departmentId: payload.departmentId }
    return { researcher }
  }
}

// ========== AI Classification ==========

export const classifyActivity = async (title, description, activity_type) => {
  try {
    // First create the activity which triggers AI classification
    const response = await request('/activities/', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        activity_type,
      }),
    })
    return response
  } catch (error) {
    console.warn('Classification API failed, using mock classification:', error.message)
    // Return mock classification response
    return getMockClassification(title, description)
  }
}

export const submitActivityWithClassification = async (payload) => {
  try {
    return await request('/activities/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.warn('Activity submission failed:', error.message)
    throw error
  }
}

// Mock classification function for fallback
const getMockClassification = (title, description) => {
  const text = `${title} ${description}`.toLowerCase()
  const classifications = []

  // Simple keyword-based mock classification
  const sdgKeywords = {
    1: ['poverty', 'income', 'economic', 'poor', 'wealth'],
    2: ['hunger', 'food', 'nutrition', 'agriculture', 'farming'],
    3: ['health', 'medical', 'disease', 'wellness', 'healthcare'],
    4: ['education', 'learning', 'school', 'training', 'teaching', 'literacy'],
    5: ['gender', 'women', 'equality', 'female', 'girls'],
    6: ['water', 'sanitation', 'clean water', 'hygiene'],
    7: ['energy', 'renewable', 'solar', 'power', 'electricity'],
    8: ['work', 'employment', 'economic growth', 'jobs', 'labor'],
    9: ['innovation', 'infrastructure', 'industry', 'technology'],
    10: ['inequality', 'inclusion', 'discrimination', 'equity'],
    11: ['cities', 'urban', 'sustainable', 'community', 'housing'],
    12: ['consumption', 'production', 'waste', 'sustainable'],
    13: ['climate', 'environment', 'carbon', 'emission', 'warming'],
    14: ['ocean', 'marine', 'sea', 'fish', 'water life'],
    15: ['land', 'forest', 'biodiversity', 'ecosystem', 'wildlife'],
    16: ['peace', 'justice', 'institution', 'governance', 'law'],
    17: ['partnership', 'collaboration', 'global', 'cooperation'],
  }

  const sdgInfo = {
    1: { name: 'No Poverty', description: 'End poverty in all its forms everywhere' },
    2: { name: 'Zero Hunger', description: 'End hunger, achieve food security and improved nutrition' },
    3: { name: 'Good Health and Well-being', description: 'Ensure healthy lives and promote well-being for all' },
    4: { name: 'Quality Education', description: 'Ensure inclusive and equitable quality education' },
    5: { name: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls' },
    6: { name: 'Clean Water and Sanitation', description: 'Ensure availability of water and sanitation for all' },
    7: { name: 'Affordable and Clean Energy', description: 'Ensure access to affordable, reliable, sustainable energy' },
    8: { name: 'Decent Work and Economic Growth', description: 'Promote sustained economic growth and decent work' },
    9: { name: 'Industry, Innovation and Infrastructure', description: 'Build resilient infrastructure and foster innovation' },
    10: { name: 'Reduced Inequalities', description: 'Reduce inequality within and among countries' },
    11: { name: 'Sustainable Cities and Communities', description: 'Make cities inclusive, safe, resilient and sustainable' },
    12: { name: 'Responsible Consumption and Production', description: 'Ensure sustainable consumption and production patterns' },
    13: { name: 'Climate Action', description: 'Take urgent action to combat climate change' },
    14: { name: 'Life Below Water', description: 'Conserve and sustainably use the oceans and marine resources' },
    15: { name: 'Life on Land', description: 'Protect and restore terrestrial ecosystems' },
    16: { name: 'Peace, Justice and Strong Institutions', description: 'Promote peaceful and inclusive societies' },
    17: { name: 'Partnerships for the Goals', description: 'Strengthen global partnership for sustainable development' },
  }

  Object.entries(sdgKeywords).forEach(([sdgNum, keywords]) => {
    const matches = keywords.filter(keyword => text.includes(keyword))
    if (matches.length > 0) {
      const score = Math.min(95, 50 + matches.length * 15)
      classifications.push({
        sdg_goal: parseInt(sdgNum),
        sdg_goal_detail: {
          number: parseInt(sdgNum),
          name: sdgInfo[sdgNum].name,
          description: sdgInfo[sdgNum].description,
        },
        score,
        justification: `Activity relates to SDG ${sdgNum} based on keywords: ${matches.join(', ')}. The content demonstrates clear alignment with ${sdgInfo[sdgNum].name.toLowerCase()} objectives.`
      })
    }
  })

  // Sort by score and return top 3
  classifications.sort((a, b) => b.score - a.score)

  // If no matches, return a default classification
  if (classifications.length === 0) {
    classifications.push({
      sdg_goal: 4,
      sdg_goal_detail: {
        number: 4,
        name: 'Quality Education',
        description: 'Ensure inclusive and equitable quality education',
      },
      score: 60,
      justification: 'This activity appears to be related to educational or research outcomes, contributing to quality education goals.'
    })
  }

  return {
    id: `mock-${Date.now()}`,
    title,
    description,
    ai_classified: true,
    sdg_impacts: classifications.slice(0, 3)
  }
}