import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  GitCompare, 
  FileText 
} from 'lucide-react'
import daystarLogo from '../assets/daystarlogo.png'

const navItems = [
  { text: 'Overview', icon: LayoutDashboard, path: '/' },
  { text: 'Projects', icon: Briefcase, path: '/projects' },
  { text: 'Benchmark', icon: GitCompare, path: '/benchmark' },
  { text: 'Reports', icon: FileText, path: '/reports' },
]

export default function TopNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="h-16 bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-4 max-w-7xl mx-auto">
        {/* Left Section - Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src={daystarLogo}
            alt="Daystar University Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-800">Daystar University</h1>
            <p className="text-sm text-gray-500">SDG Impact Dashboard</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-sm font-semibold text-gray-800">SDG Dashboard</h1>
          </div>
        </div>

        {/* Center Section - Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.text}</span>
              </button>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title={item.text}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </nav>

        {/* Right Section - Generate Report Button */}
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium text-sm"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Generate Report</span>
        </button>
      </div>
    </header>
  )
}
