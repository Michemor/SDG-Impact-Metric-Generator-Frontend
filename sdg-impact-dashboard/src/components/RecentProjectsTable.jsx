import { useState, useEffect } from 'react'
import { fetchRecentProjects } from '../services/apiClient'

export default function RecentProjectsTable({ activities }) {

  if (!activities || activities.length === 0) {
    return <div className="text-center py-8 text-gray-500">No recent projects to display.</div>
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Activity Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lead Author</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date Created</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.slice(0, 5).map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.activity_type_display}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.lead_author_detail?.username || 'N/A'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(row.date_created).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}