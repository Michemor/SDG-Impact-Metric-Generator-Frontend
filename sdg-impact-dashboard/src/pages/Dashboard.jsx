import { Outlet } from 'react-router-dom'
import TopNavigation from '../components/TopNavigation'
import FloatingActionButton from '../components/FloatingActionButton'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <TopNavigation />
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
      
      {/* Floating Action Button for adding new entries */}
      <FloatingActionButton 
        navigateTo="/add-entry"
        label="Add New Entry"
      />
    </div>
  )
}
