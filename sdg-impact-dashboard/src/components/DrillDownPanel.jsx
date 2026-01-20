import { ChevronRight, X } from 'lucide-react'

export default function DrillDownPanel({ 
  sdgDetail, 
  loading, 
  error, 
  onSelectRecord, 
  onClose 
}) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading details...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!sdgDetail) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500">Select an SDG to view details.</p>
      </div>
    )
  }

  const { sdg, projects = [], publications = [], departments = [], researchers = [] } = sdgDetail

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-800">
            {sdg?.code}: {sdg?.title}
          </h3>
          <p className="text-sm text-blue-600 mt-1">{sdg?.description}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-blue-600" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Projects Section */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">
            Projects ({projects.length})
          </h4>
          {projects.length > 0 ? (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => onSelectRecord?.(project.id)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-blue-700">
                    {project.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No projects linked to this SDG.</p>
          )}
        </div>

        {/* Publications Section */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">
            Publications ({publications.length})
          </h4>
          {publications.length > 0 ? (
            <ul className="space-y-2">
              {publications.map((pub) => (
                <li
                  key={pub.id}
                  onClick={() => onSelectRecord?.(pub.id)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-purple-700">
                    {pub.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No publications linked to this SDG.</p>
          )}
        </div>

        {/* Departments Section */}
        {departments.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Departments ({departments.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <span
                  key={dept.id}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                >
                  {dept.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Researchers Section */}
        {researchers.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Researchers ({researchers.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {researchers.map((researcher) => (
                <span
                  key={researcher.id}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {researcher.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
