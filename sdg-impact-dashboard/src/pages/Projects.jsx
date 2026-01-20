import { useState } from 'react'
import { Search } from 'lucide-react'
import ProjectsTable from '../components/ProjectsTable'
import PublicationsTable from '../components/PublicationsTable'

export default function Projects() {
  const [tabValue, setTabValue] = useState(0)
  const [projectQuery, setProjectQuery] = useState('')
  const [publicationQuery, setPublicationQuery] = useState('')

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Projects and Publications
        </h1>
        <hr className="my-4 border-gray-200" />

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-4">
            View and manage all projects and publications related to your SDG initiatives. 
            Use the tabs below to switch between project and publication views.
          </p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setTabValue(0)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                tabValue === 0
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects
              {tabValue === 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setTabValue(1)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                tabValue === 1
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Publications
              {tabValue === 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          <hr className="my-4 border-gray-200" />

          {/* Projects Tab */}
          {tabValue === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Projects</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by name, type, status, department, SDGs or date"
                  value={projectQuery}
                  onChange={(e) => setProjectQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <ProjectsTable filterText={projectQuery} />
            </div>
          )}

          {/* Publications Tab */}
          {tabValue === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Publications</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search publications by title, type, status, department, SDGs or date"
                  value={publicationQuery}
                  onChange={(e) => setPublicationQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <PublicationsTable filterText={publicationQuery} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
