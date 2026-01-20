import { TrendingUp, FileText, Users, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import RecentProjectsTable from './RecentProjectsTable'

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

export default function MainContent() {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          Welcome to the SDG Impact Dashboard
        </h1>
        <p className="text-gray-600">
          This is the main content area where you can view and manage your projects related to Sustainable Development Goals (SDGs).
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

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-blue-700" />
                <h2 className="text-xl font-semibold text-blue-700">
                  Project Growth Trajectory
                </h2>
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

        {/* Recent Projects */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
          <RecentProjectsTable />
        </div>
      </div>
    </div>
  )
}
