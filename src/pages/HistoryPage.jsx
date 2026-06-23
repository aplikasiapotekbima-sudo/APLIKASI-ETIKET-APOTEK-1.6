import { useEffect, useState } from 'react'
import { Trash2, Cloud, CloudOff, ChevronDown, RefreshCw, Search } from 'lucide-react'
import TopBar from '../components/TopBar'
import EtiketPreview from '../components/EtiketPreview'
import { useEtiketStore } from '../store'

export default function HistoryPage() {
  const { history, loadHistory, deleteFromHistory, isLoadingHistory } = useEtiketStore()
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  useEffect(() => { loadHistory() }, [])

  const filtered = history.filter((h) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      h.namaPasien?.toLowerCase().includes(q) ||
      String(h.nomorResep)?.includes(q) ||
      h.namaDokter?.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id) => {
    await deleteFromHistory(id)
    setDeleteConfirmId(null)
    if (expandedId === id) setExpandedId(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <TopBar title="Histori Etiket" />

      <main className="flex-1 px-4 pt-4 pb-24 max-w-lg mx-auto w-full">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pasien, no. resep..."
              className="input-field pl-9"
            />
          </div>
          <button onClick={loadHistory} disabled={isLoadingHistory} className="btn-secondary px-3">
            <RefreshCw size={16} className={isLoadingHistory ? 'animate-spin' : ''} />
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-3">{filtered.length} resep tersimpan</p>

        {filtered.length === 0 && !isLoadingHistory && (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium text-gray-700 dark:text-gray-300">Belum ada histori</p>
            <p className="text-sm text-gray-400 mt-1">Resep yang dicetak akan muncul di sini</p>
          </div>
        )}

        {isLoadingHistory && (
          <div className="card p-8 text-center">
            <RefreshCw className="animate-spin mx-auto text-apotek-500 mb-2" size={28} />
            <p className="text-sm text-gray-500">Memuat histori...</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((item) => {
            const obatList = item.obatList || []
            const filledObat = obatList.filter(o => o.dosis?.trim())
            return (
              <div key={item.id} className="card overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-apotek-100 dark:bg-apotek-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-apotek-700 dark:text-apotek-300">
                      {item.nomorResep || '#'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.namaPasien}</p>
                    <p className="text-xs text-gray-400">
                      {item.tanggal} · {filledObat.length} etiket
                      {item.namaDokter ? ` · ${item.namaDokter}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.synced ? <Cloud size={14} className="text-apotek-400" /> : <CloudOff size={14} className="text-gray-300" />}
                    <ChevronDown size={16} className={`text-gray-300 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-3">
                    {/* Preview semua etiket */}
                    {filledObat.length > 0 ? (
                      <div className="space-y-3">
                        {filledObat.map((obat, i) => (
                          <EtiketPreview
                            key={i}
                            obat={obat}
                            index={i}
                            nomorResep={item.nomorResep}
                            tanggal={item.tanggal}
                            namaPasien={item.namaPasien}
                            namaDokter={item.namaDokter}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-3">Data obat tidak tersedia</p>
                    )}

                    {deleteConfirmId === item.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary flex-1 py-2 text-sm">Batal</button>
                        <button onClick={() => handleDelete(item.id)} className="btn-danger flex-1 py-2 text-sm">Ya, Hapus</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                        Hapus resep ini
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
