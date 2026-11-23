import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import ApiKeys from './pages/ApiKeys'
import Attestations from './pages/Attestations'
import { AttestationsProvider } from './state/attestations'

const Dashboard = () => <div className="p-6 text-zinc-900 dark:text-white font-semibold">Dashboard Content View</div>

export default function App() {
  return (
    <BrowserRouter>
      <AttestationsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attestations" element={<Attestations />} />
            <Route path="api-keys" element={<ApiKeys />} />
          </Route>
        </Routes>
      </AttestationsProvider>
    </BrowserRouter>
  )
}