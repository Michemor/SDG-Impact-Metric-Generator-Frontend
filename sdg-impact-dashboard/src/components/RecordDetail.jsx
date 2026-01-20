import { X, Calendar, Building, Users, Target } from 'lucide-react'

export default function RecordDetail({ record, loading, error, onClose }) {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading record...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  if (!record) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-xs rounded mb-2">
              {record.type === 'project' ? 'Project' : 'Publication'}
            </span>
            <h2 className="text-xl font-semibold text-white">{record.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-gray-700">{record.description || 'No description available.'}</p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="font-medium text-gray-800">{record.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium text-gray-800">{record.department?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* SDGs */}
          {record.sdgs?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Linked SDGs
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {record.sdgs.map((sdg) => (
                  <span
                    key={sdg.id}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                  >
                    {sdg.code}: {sdg.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Researchers */}
          {record.researchers?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Researchers / Authors
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {record.researchers.map((researcher) => (
                  <span
                    key={researcher.id}
                    className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                  >
                    {researcher.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
