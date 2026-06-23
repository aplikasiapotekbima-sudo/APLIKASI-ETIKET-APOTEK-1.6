import { useSettingsStore, usePrinterStore } from '../store'
import { Moon, Sun, Wifi, WifiOff } from 'lucide-react'

export default function TopBar({ title }) {
  const { darkMode, toggleDarkMode, namaApotek } = useSettingsStore()
  const isConnected = usePrinterStore((s) => s.isConnected)

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 safe-top">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-none">{namaApotek}</p>
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Printer status indicator */}
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            isConnected
              ? 'bg-apotek-50 text-apotek-700 dark:bg-apotek-900/30 dark:text-apotek-400'
              : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
          }`}>
            {isConnected
              ? <Wifi size={12} />
              : <WifiOff size={12} />
            }
            <span>{isConnected ? 'Terhubung' : 'Offline'}</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
