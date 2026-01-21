import { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { Trophy, TrendingUp, Target, Award, Briefcase, BookOpen } from 'lucide-react'
import institutionalData from '../data/unis.json'

const institutionColors = {
  'Daystar University': '#2563eb',
  'ValleyBridge University': '#16a34a',
  'GreenField University': '#f59e0b',
  'MelWater University': '#9333ea',
  'SilverOak University': '#ec4899',
}

export default function Benchmark() {
  const universities = institutionalData.institutionalData
  const sdgLabels = institutionalData.sdgLabels
  const daystar = universities.find(u => u.university === 'Daystar University')

  // Prepare data for peer comparison bar chart
  const peerComparisonData = useMemo(() => {
    return universities
      .sort((a, b) => b.impactScore - a.impactScore)
      .map((uni) => ({
        name: uni.university.replace(' University', ''),
        impactScore: uni.impactScore,
        fill: institutionColors[uni.university],
      }))
  }, [universities])

  // Calculate Daystar's strengths and weaknesses
  const sdgAnalysis = useMemo(() => {
    if (!daystar) return { strengths: [], weaknesses: [] }
    const scores = Object.entries(daystar.sdgScores)
      .map(([sdg, score]) => ({ sdg, score, label: sdgLabels.find(s => s.id === sdg)?.title }))
      .sort((a, b) => b.score - a.score)
    return {
      strengths: scores.slice(0, 3),
      weaknesses: scores.slice(-3).reverse(),
    }
  }, [daystar, sdgLabels])

  // Daystar's rank among peers
  const daystarRank = universities.findIndex(u => u.university === 'Daystar University') + 1
  const avgScore = Math.round(universities.reduce((sum, u) => sum + u.impactScore, 0) / universities.length)

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">SDG Benchmark Analysis</h1>
        <p className="text-gray-600">
          Compare Daystar University's SDG impact performance against peer institutions across all 17 Sustainable Development Goals.
        </p>
      </div>

      {/* Section 1: SDG Impact Scorecard Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">SDG Impact Scorecard Summary</h2>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Overall Score</span>
            </div>
            <p className="text-3xl font-bold text-blue-800">{daystar?.impactScore}</p>
            <p className="text-sm text-blue-600 mt-1">out of 100</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Peer Ranking</span>
            </div>
            <p className="text-3xl font-bold text-purple-800">#{daystarRank}</p>
            <p className="text-sm text-purple-600 mt-1">of {universities.length} institutions</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Projects</span>
            </div>
            <p className="text-3xl font-bold text-green-800">{daystar?.totalProjects}</p>
            <p className="text-sm text-green-600 mt-1">active projects</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Publications</span>
            </div>
            <p className="text-3xl font-bold text-orange-800">{daystar?.totalPublications}</p>
            <p className="text-sm text-orange-600 mt-1">published works</p>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Performing SDGs
            </h3>
            <div className="space-y-2">
              {sdgAnalysis.strengths.map((item, index) => (
                <div key={item.sdg} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{item.sdg}: {item.label}</span>
                  </div>
                  <span className="font-bold text-green-700">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Areas for Improvement
            </h3>
            <div className="space-y-2">
              {sdgAnalysis.weaknesses.map((item, index) => (
                <div key={item.sdg} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{item.sdg}: {item.label}</span>
                  </div>
                  <span className="font-bold text-orange-700">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Peer-to-Peer Institutional Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Peer Institution Comparison</h2>
        <p className="text-gray-600 text-sm mb-6">
          Overall SDG impact scores compared across {universities.length} peer institutions.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Impact Score Ranking</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={peerComparisonData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#4b5563', fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: '#4b5563', fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} / 100`, 'Impact Score']}
                />
                <Bar 
                  dataKey="impactScore" 
                  radius={[0, 4, 4, 0]}
                  fill="#2563eb"
                >
                  {peerComparisonData.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Institution Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Institution Details</h3>
            {universities
              .sort((a, b) => b.impactScore - a.impactScore)
              .map((uni, index) => {
                const isDaystar = uni.university === 'Daystar University'
                return (
                  <div
                    key={uni.university}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isDaystar 
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                        : 'bg-white border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isDaystar ? 'text-blue-800' : 'text-gray-800'}`}>
                        {isDaystar && '★ '}{uni.university}
                      </h4>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>{uni.totalProjects} projects</span>
                        <span>{uni.totalPublications} publications</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: institutionColors[uni.university] }}
                      >
                        {uni.impactScore}
                      </div>
                      <div className="text-xs text-gray-500">
                        {uni.impactScore > avgScore ? `+${uni.impactScore - avgScore}` : uni.impactScore - avgScore} vs avg
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
