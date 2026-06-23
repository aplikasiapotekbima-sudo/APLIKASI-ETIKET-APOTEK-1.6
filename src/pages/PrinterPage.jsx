import { useEffect, useState } from 'react'
import { Bluetooth, BluetoothConnected, Scan, Unplug, CheckCircle2, Wifi, WifiOff } from 'lucide-react'
import TopBar from '../components/TopBar'
import { usePrinterStore } from '../store'
import {
  scanBluetooth, connectPrinter, disconnectPrinter,
  getPrinterStatus, registerAndroidCallbacks, isAndroidWebView
} from '../services/printer'

export default function PrinterPage() {
  const {
    isConnected, lastDevice, availableDevices,
    isScanning, setConnected, setLastDevice,
    setAvailableDevices, setScanning
  } = usePrinterStore()
  const [connectingMac, setConnectingMac] = useState(null)
  const isAndroid = isAndroidWebView()

  useEffect(() => {
    // Register callbacks from Android
    registerAndroidCallbacks({
      onDeviceList: (devicesJson) => {
        try {
          const devices = JSON.parse(devicesJson)
          setAvailableDevices(devices)
        } catch {}
        setScanning(false)
      },
      onConnected: (deviceJson) => {
        try {
          const device = JSON.parse(deviceJson)
          setConnected(true)
          setLastDevice(device)
        } catch {
          setConnected(true)
        }
        setConnectingMac(null)
      },
      onDisconnected: () => {
        setConnected(false)
        setConnectingMac(null)
      },
      onPrintStatus: () => {},
    })

    // Sync status on mount
    if (isAndroid) {
      setConnected(getPrinterStatus())
    }
  }, [])

  const handleScan = () => {
    setScanning(true)
    setAvailableDevices([])
    scanBluetooth()
    // In dev mode, simulate devices after 1.5s
    if (!isAndroid) {
      setTimeout(() => {
        setAvailableDevices([
          { name: 'POS-58 Thermal', mac: 'AA:BB:CC:DD:EE:01' },
          { name: 'Xprinter XP-420B', mac: 'AA:BB:CC:DD:EE:02' },
          { name: 'BlueTooth Printer', mac: 'AA:BB:CC:DD:EE:03' },
        ])
        setScanning(false)
      }, 1500)
    }
  }

  const handleConnect = (device) => {
    setConnectingMac(device.mac)
    connectPrinter(device.mac)
    if (!isAndroid) {
      setTimeout(() => {
        setConnected(true)
        setLastDevice(device)
        setConnectingMac(null)
      }, 1000)
    }
  }

  const handleDisconnect = () => {
    disconnectPrinter()
    if (!isAndroid) {
      setConnected(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <TopBar title="Printer Bluetooth" />

      <main className="flex-1 px-4 pt-4 pb-24 max-w-lg mx-auto w-full space-y-4">

        {/* Connection Status Banner */}
        <div className={`card p-4 flex items-center gap-4 ${
          isConnected
            ? 'border-apotek-200 dark:border-apotek-800'
            : 'border-gray-200 dark:border-gray-800'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isConnected
              ? 'bg-apotek-100 dark:bg-apotek-900/40'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            {isConnected
              ? <BluetoothConnected className="text-apotek-600 dark:text-apotek-400" size={24} />
              : <Bluetooth className="text-gray-400" size={24} />
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isConnected ? 'text-apotek-700 dark:text-apotek-300' : 'text-gray-500'}`}>
                {isConnected ? 'Terhubung' : 'Tidak terhubung'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-apotek-500 animate-pulse' : 'bg-gray-300'}`} />
            </div>
            {lastDevice && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {lastDevice.name} · <span className="font-mono text-xs">{lastDevice.mac}</span>
              </p>
            )}
            {!isAndroid && (
              <p className="text-xs text-gray-400 mt-0.5">Mode simulasi (bukan Android)</p>
            )}
          </div>
        </div>

        {/* Connected actions */}
        {isConnected && (
          <button
            onClick={handleDisconnect}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Unplug size={18} />
            Putuskan Koneksi
          </button>
        )}

        {/* Scan Section */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Perangkat Bluetooth</h2>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center gap-1.5 text-sm text-apotek-600 dark:text-apotek-400 font-medium disabled:opacity-50"
            >
              <Scan size={16} className={isScanning ? 'animate-spin' : ''} />
              {isScanning ? 'Scanning...' : 'Scan'}
            </button>
          </div>

          {availableDevices.length === 0 && !isScanning && (
            <div className="text-center py-6">
              <Bluetooth size={32} className="mx-auto text-gray-200 dark:text-gray-700 mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Tekan Scan untuk mencari printer
              </p>
            </div>
          )}

          {isScanning && (
            <div className="text-center py-6">
              <Scan size={28} className="mx-auto text-apotek-400 animate-pulse mb-2" />
              <p className="text-sm text-gray-500">Mencari perangkat...</p>
            </div>
          )}

          {/* Device list */}
          <div className="space-y-2">
            {availableDevices.map((device) => {
              const isThisConnected = isConnected && lastDevice?.mac === device.mac
              const isConnectingThis = connectingMac === device.mac
              return (
                <div
                  key={device.mac}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <Bluetooth size={16} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{device.name}</p>
                    <p className="text-xs font-mono text-gray-400">{device.mac}</p>
                  </div>
                  {isThisConnected ? (
                    <span className="flex items-center gap-1 text-xs text-apotek-600 dark:text-apotek-400 font-medium">
                      <CheckCircle2 size={14} />
                      Aktif
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnect(device)}
                      disabled={isConnectingThis}
                      className="text-xs font-semibold px-3 py-1.5 bg-apotek-600 text-white rounded-lg disabled:opacity-50"
                    >
                      {isConnectingThis ? 'Menghubungkan...' : 'Hubungkan'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Last device saved */}
        {lastDevice && !availableDevices.find((d) => d.mac === lastDevice.mac) && (
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Printer Terakhir</h2>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <Bluetooth size={16} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{lastDevice.name}</p>
                <p className="text-xs font-mono text-gray-400">{lastDevice.mac}</p>
              </div>
              <button
                onClick={() => handleConnect(lastDevice)}
                className="text-xs font-semibold px-3 py-1.5 bg-apotek-600 text-white rounded-lg"
              >
                Hubungkan
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">💡 Tips</p>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1.5">
            <li>• Pastikan printer thermal dalam keadaan menyala dan Bluetooth aktif</li>
            <li>• Pairing dulu di Pengaturan Bluetooth HP sebelum scan di sini</li>
            <li>• Printer akan otomatis tersambung kembali saat membuka app</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
