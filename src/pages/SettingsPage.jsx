import { useState, useRef } from 'react'
import { Save, CheckCircle2, RefreshCw, Upload, Trash2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useSettingsStore } from '../store'
import { upsertApotekSettings } from '../services/supabase'

export default function SettingsPage() {
  const settings = useSettingsStore()
  const { setSettings } = settings
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    namaApotek: settings.namaApotek,
    alamat: settings.alamat,
    telepon: settings.telepon,
    apotekerName: settings.apotekerName,
    logoUrl: settings.logoUrl || '',
    noEtiketAutoIncrement: settings.noEtiketAutoIncrement,
  })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Logo harus berupa file PNG atau JPG')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      handleChange('logoUrl', dataUrl)
      // Auto-save logo langsung ke store agar langsung aktif di etiket
      setSettings({ logoUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    handleChange('logoUrl', '')
    setSettings({ logoUrl: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSettings(form)
    await upsertApotekSettings({ id: 'default', ...form })
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <TopBar title="Pengaturan" />

      <main className="flex-1 px-4 pt-4 pb-24 max-w-lg mx-auto w-full space-y-4">

        {/* Apotek Info */}
        <div className="card p-4 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-apotek-500 rounded-full inline-block" />
            Informasi Apotek
          </h2>

          <div>
            <label className="label">Nama Apotek</label>
            <input
              type="text"
              value={form.namaApotek}
              onChange={(e) => handleChange('namaApotek', e.target.value)}
              className="input-field"
              placeholder="Nama Apotek Anda"
            />
          </div>

          <div>
            <label className="label">Alamat</label>
            <input
              type="text"
              value={form.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              className="input-field"
              placeholder="Jl. Kesehatan No. 1"
            />
          </div>

          <div>
            <label className="label">Nomor Telepon</label>
            <input
              type="tel"
              value={form.telepon}
              onChange={(e) => handleChange('telepon', e.target.value)}
              className="input-field"
              placeholder="08xxx"
            />
          </div>

          <div>
            <label className="label">Nama Apoteker</label>
            <input
              type="text"
              value={form.apotekerName}
              onChange={(e) => handleChange('apotekerName', e.target.value)}
              className="input-field"
              placeholder="Apt. Nama Apoteker, S.Farm"
            />
          </div>

          <div>
            <label className="label">Logo Apotek</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="Logo Apotek" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl">⚕</span>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="logo-upload-input"
                  className="btn-secondary text-sm flex items-center justify-center gap-2 py-2 cursor-pointer"
                >
                  <Upload size={16} />
                  {form.logoUrl ? 'Ganti Logo' : 'Upload Logo'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload-input"
                />
                {form.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-xs text-red-500 flex items-center justify-center gap-1 py-1"
                  >
                    <Trash2 size={14} />
                    Hapus logo, pakai default
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Format PNG atau JPG. Logo akan tampil di pojok kiri header etiket.</p>
          </div>
        </div>

        {/* Etiket Settings */}
        <div className="card p-4 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-apotek-500 rounded-full inline-block" />
            Pengaturan Etiket
          </h2>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Auto-increment No. Etiket</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Nomor otomatis bertambah setiap reset form</p>
            </div>
            <button
              onClick={() => handleChange('noEtiketAutoIncrement', !form.noEtiketAutoIncrement)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.noEtiketAutoIncrement ? 'bg-apotek-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.noEtiketAutoIncrement ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Tampilan gelap lebih nyaman di malam hari</p>
            </div>
            <button
              onClick={settings.toggleDarkMode}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.darkMode ? 'bg-apotek-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings.darkMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Supabase Info */}
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
            Sinkronisasi Cloud
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Data etiket disinkronkan ke Supabase secara otomatis.
              Konfigurasi via environment variable <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">VITE_SUPABASE_URL</code> dan{' '}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">VITE_SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            saved ? 'bg-apotek-500' : ''
          }`}
        >
          {isSaving ? (
            <><RefreshCw size={18} className="animate-spin" />Menyimpan...</>
          ) : saved ? (
            <><CheckCircle2 size={18} />Tersimpan!</>
          ) : (
            <><Save size={18} />Simpan Pengaturan</>
          )}
        </button>

        {/* App info */}
        <p className="text-center text-xs text-gray-300 dark:text-gray-700 pb-2">
          Apotek Etiket v1.0.0 · Made with ❤️
        </p>
      </main>
    </div>
  )
}
