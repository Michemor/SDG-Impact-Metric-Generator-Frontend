import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import ReportsPage from './pages/ReportsPage'
import AddEntryPage from './pages/AddEntryPage'

// Defines the main application component for the SDG Impact Dashboard

function App() {
	return (
		<BrowserRouter>
			<div className="app-shell">
				<header className="top-bar">
					<div>
						<strong>Daystar Research Intelligence Hub</strong>
					</div>
					<nav>
						<NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
							Reports
						</NavLink>
						<NavLink to="/add-entry" className={({ isActive }) => (isActive ? 'active' : '')}>
							Add Project / Publication
						</NavLink>
					</nav>
				</header>
				<main className="main-content">
					<div className="content-container">
						<Routes>
							<Route path="/" element={<ReportsPage />} />
							<Route path="/reports" element={<ReportsPage />} />
							<Route path="/add-entry" element={<AddEntryPage />} />
						</Routes>
					</div>
				</main>
			</div>
		</BrowserRouter>
	)
}

export default App
