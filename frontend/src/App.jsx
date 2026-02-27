import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import InstructorNavigation from './instructor/components/InstructorNavigation'
import InstructorHome from './instructor/pages/InstructorHome'
import NotFound from './pages/NotFound'
import StudentHome from './student/StudentHome'
import AdminDashboard from './admin/pages/AdminDashboard'
function App() {
  return (
    <Router>
      <InstructorNavigation />
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/instructor" element={<InstructorHome />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
