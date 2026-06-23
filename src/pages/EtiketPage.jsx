import { useEffect, useState } from 'react'
import { Plus, Trash2, Eye, EyeOff, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import TopBar from '../components/TopBar'
import EtiketPreview from '../components/EtiketPreview'
import PrintButton from '../components/PrintButton'
import { useEtiketStore, useSettingsStore } from '../store'

// Preset dosis cepat
const PRESET_DOSIS = [
  '1 X 1 TABLET', '2 X 1 TABLET', '3 X 1 TABLET',
  '1 X 2 TABLET', '2 X 2 TABLET', '3 X 2 TABLET',
  '1 X 1 KAPSUL', '2 X 1 KAPSUL', '3 X 1 KAPSUL',
  '1 X 1 SENDOK TEH', '3 X 1 SENDOK TEH',
  '1 X 1 SENDOK MAKAN', '3 X 1 SENDOK MAKAN',
]

const PRESET_WAKTU = ['PAGI', 'SIANG', 'MALAM', 'PAGI & MALAM', 'PAGI, SIANG & MALAM']

const PRESET_KET = [
  'SETELAH MAKAN', 'SEBELUM MAKAN', 'BERSAMA MAKAN',
  'JIKA PERLU', 'SEBELUM TIDUR', 'SAAT SAKIT',
]

function ObatForm({ obat, index, total, onChange, onRemove }) {
  const [showPresets, setShowPresets] = useState(false)

  return (
    <div className="card overflow-hidden">
      {/* Header card obat */}
      <div className="flex items-center gap-2 px-4 py-3 bg-apotek-50 dark:bg-apotek-900/20 border-b border-apotek-100 dark:border-apotek-800/50">
        <span className="w-6 h-6 rounded-full bg-apotek-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-apotek-800 dark:text-apotek-300 flex-1">
          Etiket {index + 1}
        </span>
        {total > 1 && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Dosis */}
        <div>
          <label className="label">Dosis <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={obat.dosis}
            onChange={(e) => onChange('dosis', e.target.value.toUpperCase())}
            placeholder="Contoh: 3 X 1 KAPSUL"
            className="input-field font-semibold uppercase"
          />
          {/* Preset dosis */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESET_DOSIS.slice(0, 6).map((p) => (
              <button
                key={p}
                onClick={() => onChange('dosis', p)}
                className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                  obat.dosis === p
                    ? 'bg-apotek-600 text-white border-apotek-600'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setShowPresets((v) => !v)}
              className="text-xs px-2 py-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
            >
              {showPresets ? 'Tutup' : 'Lainnya...'}
            </button>
          </div>
          {showPresets && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {PRESET_DOSIS.slice(6).map((p) => (
                <button
                  key={p}
                  onClick={() => { onChange('dosis', p); setShowPresets(false) }}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                    obat.dosis === p
                      ? 'bg-apotek-600 text-white border-apotek-600'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Waktu */}
        <div>
          <label className="label">Waktu Minum</label>
          <input
            type="text"
            value={obat.waktu}
            onChange={(e) => onChange('waktu', e.target.value.toUpperCase())}
            placeholder="Contoh: MALAM"
            className="input-field font-semibold uppercase"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESET_WAKTU.map((p) => (
              <button
                key={p}
                onClick={() => onChange('waktu', p)}
                className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                  obat.waktu === p
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <label className="label">Keterangan</label>
          <input
            type="text"
            value={obat.keterangan}
            onChange={(e) => onChange('keterangan', e.target.value.toUpperCase())}
            placeholder="Contoh: SETELAH MAKAN"
            className="input-field uppercase"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESET_KET.map((p) => (
              <button
                key={p}
                onClick={() => onChange('keterangan', p)}
                className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                  obat.keterangan === p
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EtiketPage() {
  const { form, setField, setObatField, addObat, removeObat, resetForm, initForm } = useEtiketStore()
  const [showPreview, setShowPreview] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)

  useEffect(() => { initForm() }, [])

  const filledObat = form.obatList.filter((o) => o.dosis?.trim())

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <TopBar title="Buat Etiket" />

      <main className="flex-1 px-4 pt-4 pb-36 max-w-lg mx-auto w-full space-y-4">

        {/* Info Pasien */}
        <div className="card p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-apotek-500 rounded-full" />
            Data Pasien
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">No. Resep</label>
              <input
                type="number"
                value={form.nomorResep}
                onChange={(e) => setField('nomorResep', e.target.value)}
                placeholder="1"
                className="input-field"
                min="1"
              />
            </div>
            <div>
              <label className="label">Tanggal</label>
              <input
                type="text"
                value={form.tanggal}
                onChange={(e) => setField('tanggal', e.target.value.toUpperCase())}
                className="input-field text-xs"
                placeholder="18 JUNI 2026"
              />
            </div>
          </div>

          <div>
            <label className="label">Nama Pasien <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.namaPasien}
              onChange={(e) => setField('namaPasien', e.target.value.toUpperCase())}
              placeholder="NAMA LENGKAP PASIEN"
              className="input-field uppercase font-medium"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="label">Dokter</label>
            <input
              type="text"
              value={form.namaDokter}
              onChange={(e) => setField('namaDokter', e.target.value)}
              placeholder="dr. Nama Dokter"
              className="input-field"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Etiket counter info */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Daftar Etiket
            <span className="ml-2 bg-apotek-100 dark:bg-apotek-900/40 text-apotek-700 dark:text-apotek-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {form.obatList.length} etiket
            </span>
          </p>
          <p className="text-xs text-gray-400">Tiap etiket = 1 kertas cetak</p>
        </div>

        {/* Daftar obat / etiket */}
        {form.obatList.map((obat, i) => (
          <ObatForm
            key={i}
            obat={obat}
            index={i}
            total={form.obatList.length}
            onChange={(field, val) => setObatField(i, field, val)}
            onRemove={() => removeObat(i)}
          />
        ))}

        {/* Tambah etiket */}
        <button
          onClick={addObat}
          className="w-full py-3 border-2 border-dashed border-apotek-300 dark:border-apotek-700 rounded-xl text-apotek-600 dark:text-apotek-400 font-medium text-sm flex items-center justify-center gap-2 hover:bg-apotek-50 dark:hover:bg-apotek-900/20 transition-colors"
        >
          <Plus size={18} />
          Tambah Etiket Lagi
        </button>

        {/* Preview section */}
        <div>
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? 'Sembunyikan Preview' : `Preview Etiket (${filledObat.length || form.obatList.length} lembar)`}
          </button>

          {showPreview && (
            <div className="mt-3 space-y-3">
              {/* Tab selector jika lebih dari 1 */}
              {form.obatList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {form.obatList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIdx(i)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        previewIdx === i
                          ? 'bg-apotek-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      Etiket {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPreviewIdx('all')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      previewIdx === 'all'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    Semua
                  </button>
                </div>
              )}

              {/* Preview render */}
              {previewIdx === 'all'
                ? form.obatList.map((obat, i) => (
                    <EtiketPreview
                      key={i}
                      obat={obat}
                      index={i}
                      nomorResep={form.nomorResep}
                      tanggal={form.tanggal}
                      namaPasien={form.namaPasien}
                      namaDokter={form.namaDokter}
                    />
                  ))
                : (
                  <EtiketPreview
                    obat={form.obatList[typeof previewIdx === 'number' ? previewIdx : 0]}
                    index={typeof previewIdx === 'number' ? previewIdx : 0}
                    nomorResep={form.nomorResep}
                    tanggal={form.tanggal}
                    namaPasien={form.namaPasien}
                    namaDokter={form.namaDokter}
                  />
                )
              }
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={resetForm}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors"
        >
          <RefreshCw size={14} />
          Reset Form Baru
        </button>
      </main>

      {/* Print FAB */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-2 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-gray-50/90 dark:via-gray-950/90 pt-3 max-w-lg mx-auto">
        <PrintButton formData={form} />
      </div>
    </div>
  )
}
