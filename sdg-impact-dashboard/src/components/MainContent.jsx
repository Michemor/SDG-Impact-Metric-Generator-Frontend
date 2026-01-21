import { TrendingUp, FileText, Users, Activity, Radar } from 'lucide-react'
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar
} from 'recharts'
import RecentProjectsTable from './RecentProjectsTable'
import { publicationsData } from '../data/mockData'

const projectGrowthData = [
  { year: '2015', projects: 30 },
  { year: '2016', projects: 45 },
  { year: '2017', projects: 28 },
  { year: '2018', projects: 60 },
  { year: '2019', projects: 75 },
  { year: '2020', projects: 50 },
  { year: '2021', projects: 90 },
  { year: '2022', projects: 100 },
  { year: '2023', projects: 120 },
  { year: '2024', projects: 140 },
  { year: '2025', projects: 160 },
]

// SDG names for radar chart
const sdgNames = [
  'No Poverty', 'Zero Hunger', 'Good Health', 'Quality Education', 
  'Gender Equality', 'Clean Water', 'Clean Energy', 'Decent Work',
  'Industry', 'Reduced Inequalities', 'Sustainable Cities', 
  'Responsible Consumption', 'Climate Action', 'Life Below Water',
  'Life on Land', 'Peace & Justice', 'Partnerships'
]

// Calculate SDG distribution from publications
const getSDGRadarData = () => {
  const counts = Array(17).fill(0)
  
  publicationsData.forEach(pub => {
    pub.sdgs.forEach(sdgId => {
      if (sdgId >= 1 && sdgId <= 17) {
        counts[sdgId - 1]++
      }
    })
  })
  
  return sdgNames.map((name, index) => ({
    sdg: `SDG ${index + 1}`,
    fullName: name,
    publications: counts[index],
    fullMark: Math.max(...counts, 1)
  }))
}

const sdgRadarData = getSDGRadarData()

const stats = [
  {
    title: 'Total Projects',
    value: '16',
    subtitle: '12 currently active',
    subtitleColor: 'text-green-600',
    icon: TrendingUp,
  },
  {
    title: 'Research Publications',
    value: '10',
    subtitle: 'SDG-aligned publications',
    subtitleColor: 'text-blue-600',
    icon: FileText,
  },
  {
    title: 'Impact Score',
    value: '7.8/10',
    subtitle: 'Average impact rating',
    subtitleColor: 'text-amber-600',
    icon: Activity,
  },
  {
    title: 'Community Reach',
    value: '1,575',
    subtitle: 'Total participants engaged',
    subtitleColor: 'text-gray-500',
    icon: Users,
  },
]

const today = new Date()
const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function MainContent() {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Welcome to the SDG Impact Dashboard
        </h1>
        <h2 className="text-sm text-gray-400">
          {formattedDate}
        </h2>
        <p className="text-gray-800">
          View and manage your projects related to Sustainable Development Goals (SDGs).
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={`text-sm ${stat.subtitleColor}`}>{stat.subtitle}</p>
              </div>
            )
          })}
        </div>

        <hr className="my-6 border-gray-200" />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects Overview</h2>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-blue-700" />
                <h3 className="text-xl font-semibold text-blue-700">
                  Project Growth Trajectory
                </h3>
              </div>
              <p className="text-sm text-blue-600 mb-4">
                Tracking SDG project expansion from 2015 to 2025
              </p>
              <div className="bg-white/70 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={projectGrowthData}>
                    <defs>
                      <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: '#1e40af', fontSize: 12 }}
                      axisLine={{ stroke: '#93c5fd' }}
                    />
                    <YAxis 
                      tick={{ fill: '#1e40af', fontSize: 12 }}
                      axisLine={{ stroke: '#93c5fd' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="projects"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fill="url(#colorProjects)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-semibold text-blue-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SDGs Covered</span>
                <span className="font-semibold text-purple-600">14/17</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Departments</span>
                <span className="font-semibold text-amber-600">8</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Publications Overview</h2>

        {/* SDG Publications Radar Chart with Top 5 Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
              <div className="flex items-center gap-2 mb-1">
                <Radar className="w-6 h-6 text-blue-700" />
                <h2 className="text-xl font-semibold text-blue-700">
                  SDG Distribution in Publications
                </h2>
              </div>
              <p className="text-sm text-blue-600 mb-4">
                Radar visualization showing how publications are distributed across the 17 SDGs
              </p>
              <div className="bg-white/70 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sdgRadarData}>
                    <PolarGrid stroke="#93c5fd" />
                    <PolarAngleAxis 
                      dataKey="sdg" 
                      tick={{ fill: '#1e40af', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 'auto']}
                      tick={{ fill: '#2563eb', fontSize: 10 }}
                    />
                    <RechartsRadar
                      name="Publications"
                      dataKey="publications"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-blue-200">
                              <p className="font-semibold text-blue-700">{data.sdg}</p>
                              <p className="text-sm text-gray-600">{data.fullName}</p>
                              <p className="text-sm font-medium text-blue-600">
                                {data.publications} publication{data.publications !== 1 ? 's' : ''}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top 5 SDGs Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 SDGs by Publications</h3>
            <div className="space-y-3">
              {[...sdgRadarData]
                .sort((a, b) => b.publications - a.publications)
                .slice(0, 5)
                .map((sdg, index) => (
                  <div 
                    key={sdg.sdg}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' :
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{sdg.sdg}</p>
                      <p className="text-xs text-gray-500 truncate">{sdg.fullName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-blue-600">{sdg.publications}</span>
                      <p className="text-xs text-gray-500">pubs</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Publications</span>
                <span className="font-semibold text-blue-600">
                  {sdgRadarData.reduce((sum, sdg) => sum + sdg.publications, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
          <a href='/projects' className="text-blue-600 hover:underline mb-4 inline-block">View All Projects</a>
          </div>
          <RecentProjectsTable />
        </div>
      </div>
    </div>
  )
}
