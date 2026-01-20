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

// ============================================
// SDG DATA - All 17 Sustainable Development Goals
// ============================================
const ALL_SDGS = [
  { id: 1, code: 'SDG 1', title: 'No Poverty', color: '#E5243B', description: 'End poverty in all its forms everywhere' },
  { id: 2, code: 'SDG 2', title: 'Zero Hunger', color: '#DDA63A', description: 'End hunger, achieve food security and improved nutrition' },
  { id: 3, code: 'SDG 3', title: 'Good Health and Well-being', color: '#4C9F38', description: 'Ensure healthy lives and promote well-being for all' },
  { id: 4, code: 'SDG 4', title: 'Quality Education', color: '#C5192D', description: 'Ensure inclusive and equitable quality education' },
  { id: 5, code: 'SDG 5', title: 'Gender Equality', color: '#FF3A21', description: 'Achieve gender equality and empower all women and girls' },
  { id: 6, code: 'SDG 6', title: 'Clean Water and Sanitation', color: '#26BDE2', description: 'Ensure availability and sustainable management of water' },
  { id: 7, code: 'SDG 7', title: 'Affordable and Clean Energy', color: '#FCC30B', description: 'Ensure access to affordable, reliable, sustainable energy' },
  { id: 8, code: 'SDG 8', title: 'Decent Work and Economic Growth', color: '#A21942', description: 'Promote sustained, inclusive economic growth' },
  { id: 9, code: 'SDG 9', title: 'Industry, Innovation and Infrastructure', color: '#FD6925', description: 'Build resilient infrastructure, promote innovation' },
  { id: 10, code: 'SDG 10', title: 'Reduced Inequalities', color: '#DD1367', description: 'Reduce inequality within and among countries' },
  { id: 11, code: 'SDG 11', title: 'Sustainable Cities and Communities', color: '#FD9D24', description: 'Make cities inclusive, safe, resilient and sustainable' },
  { id: 12, code: 'SDG 12', title: 'Responsible Consumption and Production', color: '#BF8B2E', description: 'Ensure sustainable consumption and production patterns' },
  { id: 13, code: 'SDG 13', title: 'Climate Action', color: '#3F7E44', description: 'Take urgent action to combat climate change' },
  { id: 14, code: 'SDG 14', title: 'Life Below Water', color: '#0A97D9', description: 'Conserve and sustainably use the oceans and marine resources' },
  { id: 15, code: 'SDG 15', title: 'Life on Land', color: '#56C02B', description: 'Protect, restore and promote sustainable use of ecosystems' },
  { id: 16, code: 'SDG 16', title: 'Peace, Justice and Strong Institutions', color: '#00689D', description: 'Promote peaceful and inclusive societies' },
  { id: 17, code: 'SDG 17', title: 'Partnerships for the Goals', color: '#19486A', description: 'Strengthen the means of implementation' },
]

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
                                {project.year}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {project.department}
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
                                {pub.year}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {pub.type}
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
        // =============================================
        // TODO: Replace with actual API call
        // =============================================
        // const response = await fetch('/api/reports/summary')
        // if (!response.ok) throw new Error('Failed to fetch summary')
        // const data = await response.json()
        // setTotals(data.totals)
        // =============================================

        // MOCK DATA - Remove when connecting to real API
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
        setTotals({
          projects: 16,
          publications: 10,
          departments: 8,
          researchers: 24
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
      // =============================================
      // TODO: Replace with actual API calls
      // =============================================
      // Fetch projects and publications for this SDG in parallel
      // const [projectsRes, publicationsRes] = await Promise.all([
      //   fetch(`/api/sdgs/${sdgId}/projects`),
      //   fetch(`/api/sdgs/${sdgId}/publications`)
      // ])
      // 
      // if (!projectsRes.ok) throw new Error('Failed to fetch projects')
      // if (!publicationsRes.ok) throw new Error('Failed to fetch publications')
      // 
      // const projects = await projectsRes.json()
      // const publications = await publicationsRes.json()
      // 
      // setSdgData(prev => ({
      //   ...prev,
      //   [sdgId]: { projects, publications, loading: false }
      // }))
      // =============================================

      // MOCK DATA - Remove when connecting to real API
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
      
      // Mock projects data based on SDG
      const mockProjects = getMockProjectsForSDG(sdgId)
      const mockPublications = getMockPublicationsForSDG(sdgId)

      setSdgData(prev => ({
        ...prev,
        [sdgId]: { 
          projects: mockProjects, 
          publications: mockPublications, 
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
      // =============================================
      // TODO: Replace with actual API call
      // =============================================
      // const response = await fetch(`/api/records/${recordId}`)
      // if (!response.ok) throw new Error('Failed to fetch record details')
      // const data = await response.json()
      // setFocusedRecord(data)
      // =============================================

      // MOCK DATA - Remove when connecting to real API
      await new Promise(resolve => setTimeout(resolve, 500))
      setFocusedRecord({
        id: recordId,
        type: recordId.startsWith('PUB') ? 'publication' : 'project',
        title: 'Sample Record Title',
        description: 'This is a detailed description of the record that would come from the API.',
        year: 2025,
        department: 'Research Department',
        sdgs: [1, 4, 10],
        researchers: ['Dr. Jane Smith', 'Prof. John Doe'],
        status: 'Active'
      })
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
    <div className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen">
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

// ============================================
// MOCK DATA FUNCTIONS
// TODO: Remove these when connecting to real API
// ============================================

function getMockProjectsForSDG(sdgId) {
  // Mock projects mapped to different SDGs
  const projectsBySDG = {
    1: [
      { id: 'P-009', title: 'Affordable Housing Initiative', year: 2025, department: 'Urban Development' },
    ],
    2: [
      { id: 'P-012', title: 'Food Security Gardens', year: 2025, department: 'Agriculture' },
    ],
    3: [
      { id: 'P-002', title: 'Maternal Health Outreach', year: 2025, department: 'Public Health' },
    ],
    4: [
      { id: 'P-001', title: 'Community Literacy Program', year: 2025, department: 'Education' },
      { id: 'P-007', title: 'Youth Skills Bootcamp', year: 2025, department: 'Education' },
    ],
    5: [
      { id: 'P-002', title: 'Maternal Health Outreach', year: 2025, department: 'Public Health' },
    ],
    6: [
      { id: 'P-006', title: 'Rural Water Access', year: 2025, department: 'Sustainability' },
    ],
    7: [
      { id: 'P-003', title: 'Green Tech Incubator', year: 2026, department: 'Engineering' },
      { id: 'P-008', title: 'Waste-to-Energy Pilot', year: 2026, department: 'Engineering' },
    ],
    8: [
      { id: 'P-005', title: 'Partnership Network Expansion', year: 2025, department: 'External Relations' },
      { id: 'P-007', title: 'Youth Skills Bootcamp', year: 2025, department: 'Education' },
    ],
    9: [
      { id: 'P-003', title: 'Green Tech Incubator', year: 2026, department: 'Engineering' },
      { id: 'P-011', title: 'Digital Inclusion Labs', year: 2025, department: 'IT & Innovation' },
    ],
    10: [
      { id: 'P-001', title: 'Community Literacy Program', year: 2025, department: 'Education' },
      { id: 'P-011', title: 'Digital Inclusion Labs', year: 2025, department: 'IT & Innovation' },
    ],
    11: [
      { id: 'P-006', title: 'Rural Water Access', year: 2025, department: 'Sustainability' },
      { id: 'P-009', title: 'Affordable Housing Initiative', year: 2025, department: 'Urban Development' },
    ],
    12: [
      { id: 'P-003', title: 'Green Tech Incubator', year: 2026, department: 'Engineering' },
      { id: 'P-008', title: 'Waste-to-Energy Pilot', year: 2026, department: 'Engineering' },
      { id: 'P-012', title: 'Food Security Gardens', year: 2025, department: 'Agriculture' },
    ],
    13: [
      { id: 'P-008', title: 'Waste-to-Energy Pilot', year: 2026, department: 'Engineering' },
      { id: 'P-010', title: 'Climate Resilience Program', year: 2025, department: 'Sustainability' },
    ],
    14: [],
    15: [
      { id: 'P-010', title: 'Climate Resilience Program', year: 2025, department: 'Sustainability' },
    ],
    16: [
      { id: 'P-004', title: 'Justice Awareness Campaign', year: 2025, department: 'Civic Engagement' },
    ],
    17: [
      { id: 'P-005', title: 'Partnership Network Expansion', year: 2025, department: 'External Relations' },
    ],
  }
  
  return projectsBySDG[sdgId] || []
}

function getMockPublicationsForSDG(sdgId) {
  // Mock publications mapped to different SDGs
  const publicationsBySDG = {
    1: [
      { id: 'PUB-008', title: 'Urban Housing Affordability', year: 2026, type: 'Book Chapter' },
    ],
    2: [],
    3: [
      { id: 'PUB-002', title: 'Maternal Health Outcomes 2025', year: 2025, type: 'Report' },
      { id: 'PUB-006', title: 'Water Access and Health', year: 2025, type: 'Journal Article' },
    ],
    4: [
      { id: 'PUB-001', title: 'Assessing Literacy Interventions', year: 2025, type: 'Journal Article' },
      { id: 'PUB-007', title: 'Skills Programs Impact', year: 2025, type: 'Report' },
    ],
    5: [
      { id: 'PUB-002', title: 'Maternal Health Outcomes 2025', year: 2025, type: 'Report' },
    ],
    6: [
      { id: 'PUB-006', title: 'Water Access and Health', year: 2025, type: 'Journal Article' },
    ],
    7: [
      { id: 'PUB-003', title: 'Green Incubation Models', year: 2026, type: 'Conference Paper' },
    ],
    8: [
      { id: 'PUB-007', title: 'Skills Programs Impact', year: 2025, type: 'Report' },
    ],
    9: [
      { id: 'PUB-003', title: 'Green Incubation Models', year: 2026, type: 'Conference Paper' },
    ],
    10: [],
    11: [
      { id: 'PUB-008', title: 'Urban Housing Affordability', year: 2026, type: 'Book Chapter' },
    ],
    12: [
      { id: 'PUB-003', title: 'Green Incubation Models', year: 2026, type: 'Conference Paper' },
    ],
    13: [],
    14: [],
    15: [],
    16: [
      { id: 'PUB-004', title: 'Justice Systems and SDG 16', year: 2025, type: 'Journal Article' },
    ],
    17: [
      { id: 'PUB-005', title: 'Public-Private Partnerships for SDGs', year: 2026, type: 'Whitepaper' },
    ],
  }
  
  return publicationsBySDG[sdgId] || []
}
