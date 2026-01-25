import { useNavigate } from 'react-router-dom'
import { 
  FileText,
  Menu
} from 'lucide-react'
import daystarLogo from "../assets/daystarLogo.png";

export default function TopNavigation({ onToggleSidebar }) {
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Menu Toggle & Logo & Title */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

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

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Generate Report Button */}
          <button
            onClick={() => navigate('/reports')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium text-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </header>
  )
}
