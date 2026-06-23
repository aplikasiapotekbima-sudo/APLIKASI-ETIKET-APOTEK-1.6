import { useState } from 'react'
import { Printer, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react'
import { printAllEtiketAsImage, isAndroidWebView } from '../services/printer'
import { useSettingsStore, useEtiketStore, usePrinterStore } from '../store'

export default function PrintButton({ formData, disabled }) {
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')

  const settings = useSettingsStore()
  const { saveToHistory } = useEtiketStore()
  const isConnected = usePrinterStore((s) => s.isConnected)
  const isAndroid = isAndroidWebView()

  const filledObat = (formData.obatList || []).filter((o) => o.dosis?.trim())
  const canPrint = formData.namaPasien?.trim() && filledObat.length > 0

  const handlePrint = async () => {
    setStatus('printing')

    const payload = {
      ...formData,
      namaApotek: settings.namaApotek,
      alamat: settings.alamat,
      telepon: settings.telepon,
      apotekerName: settings.apotekerName,
    }

    const result = await printAllEtiketAsImage(payload)

    if (result.success) {
      setStatus('success')
      setMessage(result.message)
      await saveToHistory(payload)
    } else {
      setStatus('error')
      setMessage(result.message)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setStatus(null)
    setMessage('')
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={disabled || !canPrint}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
      >
        <Printer size={20} />
        Print {filledObat.length > 0 ? `${filledObat.length} Etiket` : 'Etiket'}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={status === null ? handleClose : undefined} />

          <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6">
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X size={18} />
            </button>

            {status === null && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Konfirmasi Print</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Akan mencetak <strong>{filledObat.length} etiket</strong> secara berurutan.
                </p>

                {/* Printer status - hanya tampil jika terhubung */}
                {isConnected && (
                  <div className="flex items-center gap-3 p-3 rounded-xl mb-4 bg-apotek-50 dark:bg-apotek-900/20 border border-apotek-200 dark:border-apotek-800">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-apotek-500" />
                    <p className="text-sm font-medium text-apotek-700 dark:text-apotek-300">Printer terhubung</p>
                  </div>
                )}

                {/* Ringkasan resep */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Resep</span>
                    <span className="font-semibold">{formData.nomorResep}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pasien</span>
                    <span className="font-semibold truncate max-w-[160px]">{formData.namaPasien}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jumlah etiket</span>
                    <span className="font-semibold text-apotek-600">{filledObat.length} lembar</span>
                  </div>
                </div>

                {/* Daftar etiket */}
                <div className="space-y-1 mb-5">
                  {filledObat.map((o, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <span className="w-4 h-4 bg-apotek-100 dark:bg-apotek-900/40 text-apotek-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      <span className="font-medium">{o.dosis}</span>
                      {o.waktu && <span className="text-gray-400">·</span>}
                      {o.waktu && <span>{o.waktu}</span>}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={handleClose} className="btn-secondary flex-1">Batal</button>
                  <button onClick={handlePrint} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Printer size={18} />
                    Cetak Semua
                  </button>
                </div>
              </>
            )}

            {status === 'printing' && (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto mb-3 text-apotek-600" size={40} />
                <p className="font-medium text-gray-900 dark:text-gray-100">Mencetak {filledObat.length} etiket...</p>
                <p className="text-sm text-gray-400 mt-1">Mohon tunggu</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-apotek-50 dark:bg-apotek-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-apotek-600" size={36} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Berhasil Dicetak!</h3>
                <p className="text-sm text-gray-500 mb-5">{message}</p>
                <button onClick={handleClose} className="btn-primary w-full">Selesai</button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-500" size={36} />
                </div>
                <h3 className="text-lg font-semibold mb-1">Gagal Print</h3>
                <p className="text-sm text-gray-500 mb-5">{message}</p>
                <div className="flex gap-3">
                  <button onClick={handleClose} className="btn-secondary flex-1">Tutup</button>
                  <button onClick={handlePrint} className="btn-primary flex-1">Coba Lagi</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
