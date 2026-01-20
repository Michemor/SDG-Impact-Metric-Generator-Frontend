import { Menu } from 'lucide-react'

export default function TopNavigation({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center h-full px-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="ml-4">
          <h1 className="text-lg font-semibold text-gray-800">Daystar University</h1>
          <p className="text-sm text-gray-500">SDG Impact Dashboard</p>
        </div>
      </div>
    </header>
  )
}
