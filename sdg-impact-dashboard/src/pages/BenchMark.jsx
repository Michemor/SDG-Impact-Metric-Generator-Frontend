import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import institutionalData from '../data/unis.json'

const colors = [
  '#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#9333ea',
  '#06b6d4', '#78716c', '#64748b', '#ec4899', '#6366f1'
]

export default function Benchmark() {
  const universities = institutionalData.institutionalData

  const chartData = universities.map((uni, index) => ({
    name: uni.university,
    impactScore: uni.impactScore,
    fill: colors[index % colors.length],
  }))

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Benchmark</h1>
        <p className="text-gray-600 mb-6">
          A display of benchmark data and analytics of Daystar University against other 
          universities in various SDG initiatives.
        </p>

        {/* Chart Container */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Impact Score Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#4b5563', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                tick={{ fill: '#4b5563', fontSize: 12 }}
                label={{ 
                  value: 'Impact Score', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#4b5563' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar 
                dataKey="impactScore" 
                name="Impact Score"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* University Cards */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">University Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((uni, index) => (
              <div
                key={uni.university}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <h3 className="font-medium text-gray-800 truncate">{uni.university}</h3>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Impact Score</p>
                    <p className="text-2xl font-bold text-gray-800">{uni.impactScore}</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(uni.impactScore / 100) * 100}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
