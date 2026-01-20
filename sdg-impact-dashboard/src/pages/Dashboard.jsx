import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import TopNavigation from '../components/TopNavigation'

export default function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <TopNavigation onMenuClick={() => setIsDrawerOpen((prev) => !prev)} />
      <SideMenu open={isDrawerOpen} />
      <main
        className={`transition-all duration-300 ease-in-out ${
          isDrawerOpen ? 'ml-60' : 'ml-[72px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}
