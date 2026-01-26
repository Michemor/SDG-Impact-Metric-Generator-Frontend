import {
  addMockRecord,
  getMockMetadata,
  getMockRecordDetail,
  getMockSdgDetail,
  getMockSummary,
  getMockRecords,
} from './mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': options.body instanceof FormData ? undefined : 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody?.message || 'Failed to load data from the server.'
    throw new Error(message)
  }

  // Some endpoints (PDF) might return blob; keep json default otherwise
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/pdf')) {
    return response.blob()
  }
  return response.json()
}

const categorizeActivities = (activities = []) => {
  const projects = []
  const publications = []
  activities.forEach((activity) => {
    if (activity.activity_type === 'project') {
      projects.push(activity)
    } else {
      publications.push(activity)
    }
  })
  return { projects, publications }
}

export const fetchDashboardSummary = async () => {
  try {
    return await request('/dashboard/summary/')
  } catch (error) {
    console.warn('Falling back to mock dashboard summary:', error.message)
    const mock = getMockSummary()
    return {
      total_activities: mock.totals.projects + mock.totals.publications,
      total_impacts: mock.totals.projects + mock.totals.publications,
      activities_by_type: [
        { activity_type: 'project', count: mock.totals.projects, avg_score: 0 },
        { activity_type: 'research', count: mock.totals.publications, avg_score: 0 },
      ],
      top_authors: [],
      top_performing_sdg: null,
    }
  }
}

export const fetchAnalyticsTrends = async (sdgNumber) => {
  const query = sdgNumber ? `?sdg_number=${sdgNumber}` : ''
  try {
    return await request(`/analytics/trends/${query}`)
  } catch (error) {
    console.warn('Falling back to mock trends:', error.message)
    // Create a minimal trend line from mock summary years
    const now = new Date().getFullYear()
    return {
      trends: [
        { year: now - 2, sdg_number: sdgNumber || 1, sdg_name: 'SDG', average_score: 70, count: 5 },
        { year: now - 1, sdg_number: sdgNumber || 1, sdg_name: 'SDG', average_score: 75, count: 8 },
        { year: now, sdg_number: sdgNumber || 1, sdg_name: 'SDG', average_score: 80, count: 10 },
      ],
      date_range: { start: now - 2, end: now },
    }
  }
}

export const fetchSdgs = async () => {
  try {
    return await request('/sdg/')
  } catch (error) {
    console.warn('Falling back to mock SDGs:', error.message)
    const { sdgs } = getMockMetadata()
    return sdgs
  }
}

export const fetchSdgActivities = async (sdgNumber) => {
  try {
    return await request(`/sdg/${sdgNumber}/activities/`)
  } catch (error) {
    console.warn(`Falling back to mock SDG activities for ${sdgNumber}:`, error.message)
    const detail = getMockSdgDetail(sdgNumber)
    if (!detail) {
      throw error
    }
    const allActivities = [...detail.projects, ...detail.publications].map((item) => ({
      ...item,
      activity_type: item.type === 'project' ? 'project' : 'research',
    }))
    return allActivities
  }
}

export const fetchRecordDetail = async (recordId) => {
  try {
    return await request(`/activities/${recordId}/`)
  } catch (error) {
    console.warn(`Falling back to mock record detail for ${recordId}:`, error.message)
    const detail = getMockRecordDetail(recordId)
    if (!detail) {
      throw error
    }
    return detail
  }
}

export const fetchActivities = async (params = {}) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })
  const query = search.toString()
  try {
    return await request(`/activities/${query ? `?${query}` : ''}`)
  } catch (error) {
    console.warn('Falling back to mock activities:', error.message)
    return getMockRecords()
  }
}

export const createRecord = async (payload) => {
  // Backend expects multipart/form-data at /activities/upload/
  const form = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => form.append(`${key}[]`, item))
    } else if (value !== undefined && value !== null) {
      form.append(key, value)
    }
  })

  try {
    return await request('/activities/upload/', {
      method: 'POST',
      body: form,
    })
  } catch (error) {
    console.warn('Storing record using mock store:', error.message)
    const record = addMockRecord(payload)
    return { record }
  }
}

export const createResearcher = async (payload) => {
  // No documented endpoint yet; keep mock fallback.
  console.warn('createResearcher uses mock fallback; backend endpoint not documented')
  const id = `res-${Date.now()}`
  const researcher = { id, name: payload.name, departmentId: payload.departmentId }
  return { researcher }
}

export { categorizeActivities }
