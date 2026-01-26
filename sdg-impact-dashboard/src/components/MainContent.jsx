import { useEffect, useMemo, useState } from 'react'
import { TrendingUp, Award, Briefcase, BookOpen, Users } from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import RecentProjectsTable from './RecentProjectsTable'
import { fetchAnalyticsTrends, fetchDashboardSummary } from '../services/apiClient'

const formatNumber = (value) => {
  if (value === null || value === undefined) return '—'
  return value.toLocaleString()
}

export default function MainContent() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [summaryData, trendsData] = await Promise.all([
          fetchDashboardSummary(),
          fetchAnalyticsTrends(),
        ])
        setSummary(summaryData)
        setTrends(trendsData?.trends || [])
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const projectCount = useMemo(() => {
    if (!summary?.activities_by_type) return 0
    return summary.activities_by_type.find((item) => item.activity_type === 'project')?.count || 0
  }, [summary])

  const publicationCount = useMemo(() => {
    if (!summary?.activities_by_type) return 0
    return summary.activities_by_type.find((item) => item.activity_type === 'research')?.count || 0
  }, [summary])

  const stats = useMemo(
    () => [
      {
        title: 'Total Projects',
        value: formatNumber(projectCount),
        subtitle: 'project-type activities',
        icon: Briefcase,
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-700',
        valueColor: 'text-blue-800',
        subtitleColor: 'text-blue-600',
      },
      {
        title: 'Publications',
        value: formatNumber(publicationCount),
        subtitle: 'research-type activities',
        icon: BookOpen,
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        iconColor: 'text-orange-600',
        titleColor: 'text-orange-700',
        valueColor: 'text-orange-800',
        subtitleColor: 'text-orange-600',
      },
      {
        title: 'Impact Score',
        value: summary?.top_performing_sdg?.avg_score
          ? summary.top_performing_sdg.avg_score.toFixed(1)
          : '—',
        subtitle: summary?.top_performing_sdg?.sdg_goal__name || 'Top SDG',
        icon: Award,
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        iconColor: 'text-purple-600',
        titleColor: 'text-purple-700',
        valueColor: 'text-purple-800',
        subtitleColor: 'text-purple-600',
      },
      {
        title: 'Total Activities',
        value: formatNumber(summary?.total_activities),
        subtitle: 'all activity types',
        icon: Users,
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-700',
        valueColor: 'text-green-800',
        subtitleColor: 'text-green-600',
      },
    ],
    [projectCount, publicationCount, summary]
  )

  const projectGrowthData = useMemo(() => {
    if (!trends.length) return []
    return trends.map((item) => ({
      year: String(item.year),
      projects: item.count,
    }))
  }, [trends])

  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome to the SDG Impact Dashboard</h1>
        <h2 className="text-sm text-gray-400">{formattedDate}</h2>
        <p className="text-gray-800">Live view of SDG-aligned activities.</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 border ${stat.border}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  <span className={`text-sm font-medium ${stat.titleColor}`}>{stat.title}</span>
                </div>
                <p className={`text-3xl font-bold ${stat.valueColor}`}>{loading ? '…' : stat.value}</p>
                <p className={`text-sm ${stat.subtitleColor} mt-1`}>{stat.subtitle}</p>
              </div>
            )
          })}
        </div>

        <hr className="my-6 border-gray-200" />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-blue-700" />
                <h3 className="text-xl font-semibold text-blue-700">Project Growth</h3>
              </div>
              <p className="text-sm text-blue-600 mb-4">Trend of activities over time</p>
              <div className="bg-white/70 rounded-lg p-4">
                {projectGrowthData.length === 0 ? (
                  <p className="text-sm text-gray-600">No trend data available yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={projectGrowthData}>
                      <defs>
                        <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fill: '#1e40af', fontSize: 12 }} axisLine={{ stroke: '#93c5fd' }} />
                      <YAxis tick={{ fill: '#1e40af', fontSize: 12 }} axisLine={{ stroke: '#93c5fd' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="projects" stroke="#2563eb" strokeWidth={3} fill="url(#colorProjects)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-semibold text-blue-600">{loading ? '…' : formatNumber(projectCount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Research Items</span>
                <span className="font-semibold text-green-600">{loading ? '…' : formatNumber(publicationCount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Activities</span>
                <span className="font-semibold text-purple-600">{loading ? '…' : formatNumber(summary?.total_activities)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Top SDG</span>
                <span className="font-semibold text-amber-600">
                  {loading ? '…' : (summary?.top_performing_sdg?.sdg_goal__name || '—')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
            <a href="/projects" className="text-blue-600 hover:underline mb-4 inline-block">View All Projects</a>
          </div>
          <RecentProjectsTable />
        </div>
      </div>
    </div>
  )
}
