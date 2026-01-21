import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export default function FloatingActionButton({ 
  onClick, 
  label = 'Add Entry',
  navigateTo = '/add-entry',
  className = '',
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (navigateTo) {
      navigate(navigateTo)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {label}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
      </div>

      {/* FAB Button */}
      <button
        onClick={handleClick}
        className={`
          w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg 
          hover:bg-blue-700 hover:shadow-xl hover:scale-110
          focus:outline-none focus:ring-4 focus:ring-blue-200
          active:scale-95
          transition-all duration-200 ease-out
          flex items-center justify-center
          ${className}
        `}
        aria-label={label}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Ripple effect ring */}
      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20 pointer-events-none" />
    </div>
  )
}
