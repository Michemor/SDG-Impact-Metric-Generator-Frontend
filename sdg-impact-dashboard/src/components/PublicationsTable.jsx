import { publicationsData } from '../data/mockData'

const statusColors = {
  Published: 'bg-green-500',
  'In Review': 'bg-amber-500',
  Draft: 'bg-gray-500',
}

export default function PublicationsTable({ filterText = '' }) {
  const query = filterText.trim().toLowerCase()
  
  const rows = publicationsData.filter((row) => {
    if (!query) return true
    const haystack = [
      row.project,
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SDGs</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Impact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.project}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.type}</td>
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
                  {row.sdgs.map((sdg) => (
                    <span
                      key={sdg}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.department}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500">{row.impact}%</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${row.impact}%` }}
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
    </div>
  )
}
