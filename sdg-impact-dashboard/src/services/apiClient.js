import {
  addMockRecord,
  getMockMetadata,
  getMockRecordDetail,
  getMockSdgDetail,
  getMockSummary,
} from './mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody?.message || 'Failed to load data from the server.'
    throw new Error(message)
  }

  return response.json()
}

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
