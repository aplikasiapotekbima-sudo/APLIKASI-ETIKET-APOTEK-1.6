import { NavLink } from 'react-router-dom'
import { FileText, History, Settings, Printer } from 'lucide-react'
import { usePrinterStore } from '../store'

export default function BottomNav() {
  const isConnected = usePrinterStore((s) => s.isConnected)

  const navItems = [
    { to: '/', icon: FileText, label: 'Etiket', exact: true },
    { to: '/history', icon: History, label: 'Histori' },
    { to: '/printer', icon: Printer, label: 'Printer' },
    { to: '/settings', icon: Settings, label: 'Pengaturan' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-bottom">
      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors
              ${isActive
                ? 'text-apotek-600 dark:text-apotek-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
              }`
            }
          >
            <div className="relative">
              <Icon size={20} strokeWidth={1.8} />
              {label === 'Printer' && (
                <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white dark:border-gray-900 ${
                  isConnected ? 'bg-apotek-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
