// Defines the main application component for the SDG Impact Dashboard
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import MainContent from "./components/MainContent"
import { Route, Routes } from 'react-router-dom'
import ReportsPage from './pages/ReportsPage'
import AddEntryPage from './pages/AddEntryPage'
import Benchmark from "./pages/BenchMark";

function App() {
 return (
   <Routes>
     <Route path="/" element={<Dashboard />} >
     <Route index element={<MainContent />} />
     <Route path="projects" element={<Projects />} />
	 <Route path="benchmark" element={<Benchmark />} />
	 <Route path="reports" element={<ReportsPage />} />
	 <Route path="add-entry" element={<AddEntryPage />} />
      </Route>
   </Routes>
 )
}

export default App
