import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TestDetail from './pages/TestDetail'
import NewTest from './pages/NewTest'
import Devices from './pages/Devices'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="test/:testId" element={<TestDetail />} />
        <Route path="new-test" element={<NewTest />} />
        <Route path="devices" element={<Devices />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
