import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export function formatTanggal(date = new Date()) {
  return format(date, 'dd/MM/yyyy', { locale: idLocale })
}

export function formatTanggalLong(dateStr) {
  try {
    const [day, month, year] = dateStr.split('/')
    const date = new Date(year, month - 1, day)
    return format(date, 'dd MMMM yyyy', { locale: idLocale })
  } catch {
    return dateStr
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Generate ESC/POS preview text untuk thermal 58mm
 * Ini hanya untuk preview visual di web, print actual dilakukan Android
 */
export function buildEtiketText({ namaApotek, nomorEtiket, tanggal, namaPasien, namaDokter, instruksi }) {
  const LINE = '--------------------------------'
  const SEPARATOR = '================================'
  const WIDTH = 32

  const center = (text, width = WIDTH) => {
    if (!text) return ''
    const pad = Math.max(0, Math.floor((width - text.length) / 2))
    return ' '.repeat(pad) + text
  }

  const lines = []
  lines.push(SEPARATOR)
  lines.push(center(namaApotek.toUpperCase()))
  lines.push('')
  lines.push(`No    : ${nomorEtiket}`)
  lines.push(`Tgl   : ${tanggal}`)
  lines.push('')
  lines.push(`Nama  : ${namaPasien}`)
  lines.push(`Dokter: ${namaDokter}`)
  lines.push(LINE)

  instruksi.forEach((ins, i) => {
    if (ins && ins.trim()) {
      lines.push(`${i + 1}. ${ins}`)
    }
  })

  lines.push(LINE)
  lines.push(center('Semoga lekas sembuh'))
  lines.push(SEPARATOR)

  return lines.join('\n')
}
