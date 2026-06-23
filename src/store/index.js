import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { saveEtiketToCloud, fetchEtiketHistory, deleteEtiket } from '../services/supabase'

// ─── Settings Store ──────────────────────────────────────────────────────────

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      namaApotek: 'APOTEK BIMA',
      alamat: 'JL. Bima, Nglaban, Sinduharjo, Ngaglik, Sleman',
      telepon: '082146129602',
      apotekerName: 'apt. Puguh Indrasetiawan, S.Farm., M.Sc., Ph.D.',
      logoUrl: '', // base64 data URL atau path logo apotek (kosong = pakai logo default teks)
      darkMode: false,
      noEtiketAutoIncrement: true,
      lastEtiketNo: 0,

      setSettings: (settings) => set(settings),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      getNextEtiketNo: () => {
        const next = get().lastEtiketNo + 1
        set({ lastEtiketNo: next })
        return next
      },
    }),
    { name: 'apotek-settings' }
  )
)

// ─── Etiket Form Store ───────────────────────────────────────────────────────

// Satu "resep" bisa punya banyak obat, tiap obat punya:
// - namaObat (opsional, untuk referensi)
// - dosis: misal "1 X 1 KAPSUL"  
// - waktu: misal "MALAM"
// - keterangan: misal "SETELAH MAKAN"
const emptyObat = () => ({ dosis: '', waktu: '', keterangan: '' })

const emptyForm = () => ({
  nomorResep: '',
  tanggal: format(new Date(), 'dd MMMM yyyy', { locale: idLocale }).toUpperCase(),
  namaPasien: '',
  namaDokter: '',
  obatList: [emptyObat()],  // array of obat, tiap obat = 1 etiket
})

export const useEtiketStore = create(
  persist(
    (set, get) => ({
      form: emptyForm(),
      history: [],
      isLoadingHistory: false,
      isSyncing: false,

      setField: (field, value) =>
        set((s) => ({ form: { ...s.form, [field]: value } })),

      // Update satu field dalam obat tertentu
      setObatField: (index, field, value) =>
        set((s) => {
          const obatList = [...s.form.obatList]
          obatList[index] = { ...obatList[index], [field]: value }
          return { form: { ...s.form, obatList } }
        }),

      addObat: () =>
        set((s) => ({
          form: { ...s.form, obatList: [...s.form.obatList, emptyObat()] }
        })),

      removeObat: (index) =>
        set((s) => {
          if (s.form.obatList.length <= 1) return s
          const obatList = s.form.obatList.filter((_, i) => i !== index)
          return { form: { ...s.form, obatList } }
        }),

      resetForm: () => {
        const settings = useSettingsStore.getState()
        set({
          form: {
            ...emptyForm(),
            nomorResep: settings.noEtiketAutoIncrement
              ? settings.getNextEtiketNo()
              : '',
            tanggal: format(new Date(), 'dd MMMM yyyy', { locale: idLocale }).toUpperCase(),
          },
        })
      },

      initForm: () => {
        const settings = useSettingsStore.getState()
        const form = get().form
        if (!form.nomorResep && settings.noEtiketAutoIncrement) {
          set((s) => ({
            form: {
              ...s.form,
              nomorResep: settings.getNextEtiketNo(),
              tanggal: format(new Date(), 'dd MMMM yyyy', { locale: idLocale }).toUpperCase(),
            },
          }))
        }
      },

      saveToHistory: async (data) => {
        const entry = {
          id: Date.now().toString(),
          ...data,
          created_at: new Date().toISOString(),
          synced: false,
        }
        set((s) => ({ history: [entry, ...s.history].slice(0, 100) }))
        set({ isSyncing: true })
        const { data: saved, error } = await saveEtiketToCloud(entry)
        if (!error && saved) {
          set((s) => ({
            history: s.history.map((h) =>
              h.id === entry.id ? { ...h, synced: true } : h
            ),
          }))
        }
        set({ isSyncing: false })
        return entry
      },

      loadHistory: async () => {
        set({ isLoadingHistory: true })
        const { data, error } = await fetchEtiketHistory()
        if (!error && data.length > 0) set({ history: data })
        set({ isLoadingHistory: false })
      },

      deleteFromHistory: async (id) => {
        set((s) => ({ history: s.history.filter((h) => h.id !== id) }))
        await deleteEtiket(id)
      },
    }),
    {
      name: 'apotek-etiket',
      partialize: (s) => ({ form: s.form, history: s.history }),
    }
  )
)

// ─── Printer Store ───────────────────────────────────────────────────────────

export const usePrinterStore = create(
  persist(
    (set) => ({
      isConnected: false,
      lastDevice: null,
      availableDevices: [],
      isScanning: false,
      setConnected: (val) => set({ isConnected: val }),
      setLastDevice: (device) => set({ lastDevice: device }),
      setAvailableDevices: (devices) => set({ availableDevices: devices }),
      setScanning: (val) => set({ isScanning: val }),
    }),
    { name: 'apotek-printer' }
  )
)
