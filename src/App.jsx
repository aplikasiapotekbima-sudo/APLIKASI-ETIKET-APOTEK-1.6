import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import EtiketPage from './pages/EtiketPage'
import HistoryPage from './pages/HistoryPage'
import PrinterPage from './pages/PrinterPage'
import SettingsPage from './pages/SettingsPage'
import { useSettingsStore } from './store'

function AppContent() {
  const darkMode = useSettingsStore((s) => s.darkMode)

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Routes>
        <Route path="/" element={<EtiketPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/printer" element={<PrinterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
