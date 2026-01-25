import { useState, useEffect } from 'react'
import { fetchPublications } from '../services/apiClient'

const statusColors = {
  Published: 'bg-green-500',
  'In Review': 'bg-amber-500',
  Draft: 'bg-gray-500',
}

// Helper function to highlight matching text
const highlightText = (text, query) => {
  if (!query || !text) return text
  const lowerText = String(text).toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)
  
  if (index === -1) return text
  
  const before = String(text).slice(0, index)
  const match = String(text).slice(index, index + query.length)
  const after = String(text).slice(index + query.length)
  
  return (
    <>
      {before}
      <mark className="bg-yellow-300 text-gray-900 px-0.5 rounded">{match}</mark>
      {after}
    </>
  )
}

export default function PublicationsTable({ filterText = '' }) {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await fetchPublications()
        setPublications(data.results)
      } catch (error) {
        console.error('Error loading publications:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPublications()
  }, [])

  const query = filterText.trim().toLowerCase()
  
  const rows = publications.filter((row) => {
    if (!query) return true
    const haystack = [
      row.project || row.title,
      row.type,
      row.status,
      row.department,
      row.date,
      (row.sdgs || []).join(',')
    ]
      .map((v) => String(v).toLowerCase())
      .join(' ')
    return haystack.includes(query)
  })

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading publications...</div>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SDGs</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{highlightText(row.project || row.title, filterText)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{highlightText(row.activity_type_display, filterText)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
                        statusColors[row.status] || 'bg-gray-500'
                      }`}
                    >
                      {row.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(row.sdg_impacts || []).map((impact) => (
                        <span
                          key={impact.sdg_goal.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800"
                        >
                          {impact.sdg_goal.number}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{highlightText(new Date(row.date_created).toLocaleDateString(), filterText)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{highlightText(row.lead_author_detail?.username, filterText)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">{row.impact || 'N/A'}%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300"
                          style={{ width: `${row.impact || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No publications found matching your search.
            </div>
          )}
        </>
      )}
    </div>
  )
}