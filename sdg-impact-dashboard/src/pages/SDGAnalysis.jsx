import { useState, useEffect } from 'react'
import { 
  Target, 
  FolderOpen, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  Building,
  Users,
  Calendar,
  Activity
} from 'lucide-react'
import { fetchSDGs, fetchActivities } from '../services/apiClient'

// Summary Card Component
const SummaryCard = ({ label, value, color, bgColor, icon: IconComponent }) => (
  <div className={`${bgColor} rounded-xl p-5 border`}>
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        {IconComponent && <IconComponent className={`w-6 h-6 ${color}`} />}
      </div>
      <div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  </div>
)

// SDG Card Component
const SDGCard = ({ sdg, activities, isExpanded, onToggle }) => {
  const projects = activities.filter(a => a.activity_type === 'Project' && a.sdg_impacts?.some(impact => impact.sdg_goal.number === sdg.number))
  const publications = activities.filter(a => a.activity_type === 'Publication' && a.sdg_impacts?.some(impact => impact.sdg_goal.number === sdg.number))
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* SDG Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* SDG Color Badge */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
            style={{ backgroundColor: sdg.color || '#cccccc' }}
          >
            {sdg.number}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 text-lg">{sdg.name}</h3>
            <p className="text-sm text-gray-500">{`SDG ${sdg.number}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Quick stats badges */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {projects.length} Projects
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {publications.length} Publications
            </span>
          </div>
          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-5">
          {/* SDG Description */}
          <div className="mb-5 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-700">{sdg.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Projects Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Projects ({projects.length})</h4>
              </div>
              {projects.length > 0 ? (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {projects.map((project) => (
                    <li
                      key={project.id}
                      className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <p className="font-medium text-gray-800">{project.title || project.project}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.date_created).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {project.lead_author_detail?.username}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          project.status === 'Active' ? 'bg-green-100 text-green-700' :
                          project.status === 'Completed' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {project.status || "N/A"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic py-4 text-center bg-white rounded-lg border border-dashed border-gray-300">
                  No projects linked to this SDG yet.
                </p>
              )}
            </div>

            {/* Publications Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Publications ({publications.length})</h4>
              </div>
              {publications.length > 0 ? (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {publications.map((pub) => (
                    <li
                      key={pub.id}
                      className="p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
                    >
                      <p className="font-medium text-gray-800">{pub.title || pub.project}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(pub.date_created).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {pub.activity_type_display}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic py-4 text-center bg-white rounded-lg border border-dashed border-gray-300">
                  No publications linked to this SDG yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SDGAnalysis() {
  const [sdgs, setSDGs] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedSDGs, setExpandedSDGs] = useState(new Set())

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sdgsData, activitiesData] = await Promise.all([
          fetchSDGs(),
          fetchActivities()
        ])
        setSDGs(sdgsData)
        setActivities(activitiesData.results)
      } catch (error) {
        console.error('Error loading SDG data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleSDG = (sdgId) => {
    setExpandedSDGs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sdgId)) {
        newSet.delete(sdgId)
      } else {
        newSet.add(sdgId)
      }
      return newSet
    })
  }

  const expandAll = () => {
    setExpandedSDGs(new Set(sdgs.map(sdg => sdg.id)))
  }

  const collapseAll = () => {
    setExpandedSDGs(new Set())
  }

  // Calculate summary statistics
  const totalProjects = activities.filter(a => a.activity_type === 'Project').length
  const totalPublications = activities.filter(a => a.activity_type === 'Publication').length
  const activeSDGs = sdgs.filter(sdg => 
    activities.some(a => a.sdg_impacts?.some(impact => impact.sdg_goal.number === sdg.number))
  ).length
  const totalActivities = activities.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-600">SDG Analysis</h1>
        </div>
        <p className="text-gray-600">
          Explore all 17 Sustainable Development Goals and view the projects and publications linked to each goal.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <SummaryCard
            icon={Target}
            label="Active SDGs"
            value={`${activeSDGs}/17`}
            color="text-blue-600"
            bgColor="bg-blue-50 border-blue-200"
          />
          <SummaryCard
            icon={FolderOpen}
            label="Total Projects"
            value={totalProjects}
            color="text-blue-600"
            bgColor="bg-blue-50 border-blue-200"
          />
          <SummaryCard
            icon={FileText}
            label="Publications"
            value={totalPublications}
            color="text-purple-600"
            bgColor="bg-purple-50 border-purple-200"
          />
          <SummaryCard
            icon={Activity}
            label="Total Activities"
            value={totalActivities}
            color="text-green-600"
            bgColor="bg-green-50 border-green-200"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={expandAll}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="text-sm font-medium text-gray-600 hover:text-gray-700"
        >
          Collapse All
        </button>
      </div>

      {/* SDG List */}
      <div className="space-y-4">
        {sdgs.map((sdg) => (
          <SDGCard
            key={sdg.id}
            sdg={sdg}
            activities={activities}
            isExpanded={expandedSDGs.has(sdg.id)}
            onToggle={() => toggleSDG(sdg.id)}
          />
        ))}
      </div>
    </div>
  )
}