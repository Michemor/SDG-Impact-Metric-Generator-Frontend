import { useEffect, useState } from 'react'
import { 
  FolderOpen, 
  FileText, 
  Building, 
  Users, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Calendar,
  Target
} from 'lucide-react'
import ExportButtons from '../components/ExportButtons'
import RecordDetail from '../components/RecordDetail'
import { fetchDashboardSummary, fetchSDGActivities, fetchActivityDetail } from '../services/apiClient'
import { sdgsData } from '../data/mockData'


// Use centralized SDG data from mockData
const ALL_SDGS = sdgsData

// ============================================
// METRIC CARD COMPONENT
// ============================================
const MetricCard = ({ label, value, icon: Icon, color, bgGradient }) => (
  <div
    className={`p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${bgGradient}`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-lg flex items-center justify-center ${color.replace('text-', 'bg-').replace('600', '100')}`}
      >
        {Icon && <Icon className={`w-7 h-7 ${color}`} />}
      </div>
      <div>
        <p className={`text-3xl font-bold ${color}`}>
          {value?.toLocaleString() ?? '—'}
        </p>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
      </div>
    </div>
  </div>
)

// ============================================
// SDG CARD COMPONENT - Expandable card for each SDG
// ============================================
const SDGCard = ({ sdg, isExpanded, onToggle, projects, publications, loading, onSelectRecord }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* SDG Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* SDG Color Badge */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: sdg.color }}
          >
            {sdg.id}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">{sdg.title}</h3>
            <p className="text-sm text-gray-500">{sdg.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Quick stats badges */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {projects?.length || 0} Projects
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {publications?.length || 0} Publications
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
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading SDG data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">Projects ({projects?.length || 0})</h4>
                </div>
                {projects?.length > 0 ? (
                  <ul className="space-y-2">
                    {projects.map((project) => (
                      <li
                        key={project.id}
                        onClick={() => onSelectRecord?.(project.id)}
                        className="p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                              {project.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(project.date_created).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {project.lead_author_detail?.username}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
                  <h4 className="font-semibold text-gray-800">Publications ({publications?.length || 0})</h4>
                </div>
                {publications?.length > 0 ? (
                  <ul className="space-y-2">
                    {publications.map((pub) => (
                      <li
                        key={pub.id}
                        onClick={() => onSelectRecord?.(pub.id)}
                        className="p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                              {pub.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(pub.date_created).toLocaleDateString()}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {pub.activity_type_display}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
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
          )}

          {/* SDG Description */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600">{sdg.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN REPORTS PAGE COMPONENT
// ============================================
export default function ReportsPage() {
  // State for summary/totals data
  const [totals, setTotals] = useState(null)
  const [loadingTotals, setLoadingTotals] = useState(true)
  const [totalsError, setTotalsError] = useState(null)

  // State for expanded SDG
  const [expandedSdgId, setExpandedSdgId] = useState(null)
  
  // State for SDG-specific data (projects & publications)
  const [sdgData, setSdgData] = useState({}) // { [sdgId]: { projects: [], publications: [], loading: false } }

  // State for record detail modal
  const [focusedRecord, setFocusedRecord] = useState(null)
  const [recordLoading, setRecordLoading] = useState(false)
  const [recordError, setRecordError] = useState(null)

  // ============================================
  // API CALL: Fetch Summary/Totals on mount
  // ============================================
  useEffect(() => {
    const loadTotals = async () => {
      setLoadingTotals(true)
      setTotalsError(null)
      
      try {
        const data = await fetchDashboardSummary()
        setTotals({
          projects: data.activities_by_type?.find(item => item.activity_type === 'Project')?.count || 0,
          publications: data.activities_by_type?.find(item => item.activity_type === 'Publication')?.count || 0,
          departments: data.top_authors?.length || 0,
          researchers: data.total_impacts
        })
      } catch (error) {
        setTotalsError(error.message || 'Failed to load summary data')
      } finally {
        setLoadingTotals(false)
      }
    }

    loadTotals()
  }, [])

  // ============================================
  // API CALL: Fetch SDG-specific projects & publications
  // ============================================
  const loadSdgData = async (sdgId) => {
    // Check if we already have data for this SDG
    if (sdgData[sdgId] && !sdgData[sdgId].loading) {
      return
    }

    // Set loading state for this SDG
    setSdgData(prev => ({
      ...prev,
      [sdgId]: { projects: [], publications: [], loading: true }
    }))

    try {
      const activities = await fetchSDGActivities(sdgId)
      const projects = activities.filter(a => a.activity_type === 'Project')
      const publications = activities.filter(a => a.activity_type === 'Publication')
      
      setSdgData(prev => ({
        ...prev,
        [sdgId]: { 
          projects: projects, 
          publications: publications, 
          loading: false 
        }
      }))
    } catch (error) {
      console.error(`Failed to load data for SDG ${sdgId}:`, error)
      setSdgData(prev => ({
        ...prev,
        [sdgId]: { projects: [], publications: [], loading: false, error: error.message }
      }))
    }
  }

  // ============================================
  // Handler: Toggle SDG expansion
  // ============================================
  const handleToggleSdg = (sdgId) => {
    if (expandedSdgId === sdgId) {
      setExpandedSdgId(null) // Collapse if already expanded
    } else {
      setExpandedSdgId(sdgId) // Expand this SDG
      loadSdgData(sdgId) // Load data if not already loaded
    }
  }

  // ============================================
  // API CALL: Fetch individual record details
  // ============================================
  const handleSelectRecord = async (recordId) => {
    setRecordLoading(true)
    setRecordError(null)

    try {
      const data = await fetchActivityDetail(recordId)
      setFocusedRecord(data)
    } catch (error) {
      setRecordError(error.message || 'Failed to load record details')
    } finally {
      setRecordLoading(false)
    }
  }

  // ============================================
  // Prepare summary data for export
  // ============================================
  const summaryForExport = {
    totals,
    sdgs: ALL_SDGS.map(sdg => ({
      ...sdg,
      projectCount: sdgData[sdg.id]?.projects?.length || 0,
      publicationCount: sdgData[sdg.id]?.publications?.length || 0
    }))
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* ============================================ */}
        {/* HEADER SECTION */}
        {/* ============================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">SDG Impact Reports</h1>
            <p className="text-gray-600 text-sm mt-1">
              Explore institutional SDG impact across all 17 Sustainable Development Goals
            </p>
          </div>
          <ExportButtons
            summary={summaryForExport}
            disabled={loadingTotals}
          />
        </div>

        <hr className="my-6 border-gray-200" />

        {/* ============================================ */}
        {/* LOADING STATE */}
        {/* ============================================ */}
        {loadingTotals && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading report data...</span>
          </div>
        )}

        {/* ============================================ */}
        {/* ERROR STATE */}
        {/* ============================================ */}
        {totalsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{totalsError}</p>
          </div>
        )}

        {/* ============================================ */}
        {/* MAIN CONTENT */}
        {/* ============================================ */}
        {!loadingTotals && !totalsError && (
          <>
            {/* ============================================ */}
            {/* METRICS DASHBOARD */}
            {/* ============================================ */}
            {totals && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Impact Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    label="Total Projects"
                    value={totals.projects}
                    icon={FolderOpen}
                    color="text-blue-600"
                    bgGradient="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                  />
                  <MetricCard
                    label="Publications"
                    value={totals.publications}
                    icon={FileText}
                    color="text-purple-600"
                    bgGradient="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                  />
                  <MetricCard
                    label="Departments"
                    value={totals.departments}
                    icon={Building}
                    color="text-amber-600"
                    bgGradient="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                  />
                  <MetricCard
                    label="Researchers"
                    value={totals.researchers}
                    icon={Users}
                    color="text-green-600"
                    bgGradient="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  />
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* ALL 17 SDGs LIST */}
            {/* ============================================ */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sustainable Development Goals
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Click on any SDG to view related projects and publications
              </p>

              <div className="space-y-3">
                {ALL_SDGS.map((sdg) => (
                  <SDGCard
                    key={sdg.id}
                    sdg={sdg}
                    isExpanded={expandedSdgId === sdg.id}
                    onToggle={() => handleToggleSdg(sdg.id)}
                    projects={sdgData[sdg.id]?.projects}
                    publications={sdgData[sdg.id]?.publications}
                    loading={sdgData[sdg.id]?.loading}
                    onSelectRecord={handleSelectRecord}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ============================================ */}
      {/* RECORD DETAIL MODAL */}
      {/* ============================================ */}
      {(focusedRecord || recordLoading || recordError) && (
        <RecordDetail
          record={focusedRecord}
          loading={recordLoading}
          error={recordError}
          onClose={() => {
            setFocusedRecord(null)
            setRecordError(null)
          }}
        />
      )}
    </div>
  )
}