import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  GitCompare, 
  FileText, 
  PlusCircle 
} from 'lucide-react'

const menuItems = [
  { text: 'Overview', icon: LayoutDashboard, path: '/' },
  { text: 'Projects and Initiatives', icon: Briefcase, path: '/projects' },
  { text: 'Benchmark', icon: GitCompare, path: '/benchmark' },
  { text: 'Reports', icon: FileText, path: '/reports' },
  { text: 'Add Entry', icon: PlusCircle, path: '/add-entry' },
]

export default function SideMenu({ open }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 ${
        open ? 'w-60' : 'w-[72px]'
      }`}
    >
      <nav className="py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  title={!open ? item.text : undefined}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-blue-600 group-hover:text-blue-600'
                    }`}
                  />
                  {open && (
                    <span className="text-sm font-medium truncate">{item.text}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
