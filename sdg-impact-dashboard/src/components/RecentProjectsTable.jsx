import { useEffect, useState } from 'react'
import { fetchActivities } from '../services/apiClient'

const statusColors = {
  Active: 'bg-green-500',
  Planned: 'bg-blue-500',
  Completed: 'bg-purple-600',
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
}

export default function RecentProjectsTable() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchActivities({ activity_type: 'project', page: 1 })
        // API may return paginated results or a plain array
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []
        const recent = [...items]
          .sort((a, b) => new Date(b.date_created || b.date || 0) - new Date(a.date_created || a.date || 0))
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            project: item.title,
            status: item.status || 'Active',
            sdgs: (item.sdg_impacts || item.sdgs || []).map((s) => s.sdg_goal || s.number || s) ,
            department: item.lead_author_detail?.email || '—',
            impact: item.ai_classified ? 80 : 50,
            date: item.date_created || item.date,
          }))
        setRows(recent)
      } catch (err) {
        setError(err.message || 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-sm text-gray-600">
        Loading recent projects…
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="flex items-center justify-center py-6 text-sm text-gray-600 border border-dashed border-gray-200 rounded-lg">
        No projects found yet.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SDGs</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Impact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.project}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
                    statusColors[row.status] || 'bg-gray-500'
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {(row.sdgs || []).map((sdg) => (
                    <span
                      key={sdg}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(row.date)}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500">{row.impact}%</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      style={{ width: `${row.impact}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
