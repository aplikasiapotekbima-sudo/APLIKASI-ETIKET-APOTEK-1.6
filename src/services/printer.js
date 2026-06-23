/**
 * AndroidPrinter Bridge Service
 * Komunikasi dengan APK Android via window.AndroidPrinter JavascriptInterface
 */
import { createElement } from 'react'
import EtiketPrintTemplate from '../components/EtiketPrintTemplate'
import { captureElementAsImage } from '../utils/captureEtiket'

export function isAndroidWebView() {
  return typeof window !== 'undefined' && typeof window.AndroidPrinter !== 'undefined'
}

/**
 * JALUR PRINT UTAMA (gambar): print SEMUA etiket dalam satu resep.
 * Tiap obat di-render ke bitmap (persis tampilan EtiketPreview di web),
 * lalu bitmap itu yang dikirim ke APK untuk dicetak sebagai ESC/POS raster image.
 * Karena yang dicetak adalah gambar, hasil cetak otomatis identik dengan preview
 * (border kotak, logo, layout 2 kolom semua ikut tercetak).
 */
export async function printAllEtiketAsImage(data) {
  const { nomorResep, tanggal, namaPasien, namaApotek, alamat, telepon, apotekerName, logoUrl, obatList } = data

  const filled = (obatList || []).filter((o) => o.dosis?.trim())
  const results = []

  for (let i = 0; i < filled.length; i++) {
    const obat = filled[i]
    try {
      if (isAndroidWebView()) {
        const base64Png = await captureElementAsImage(
          createElement(EtiketPrintTemplate, {
            obat,
            nomorResep,
            tanggal,
            namaPasien,
            namaApotek,
            alamat,
            telepon,
            apotekerName,
            logoUrl,
          })
        )
        window.AndroidPrinter.printImage(base64Png)
      } else {
        console.log(`[DEV] Print etiket ${i + 1} (image mode) - lewati capture di browser biasa`)
      }
      results.push({ index: i, success: true })
    } catch (err) {
      results.push({ index: i, success: false, message: err.message })
    }
  }

  const failed = results.filter((r) => !r.success)
  if (failed.length > 0) {
    return { success: false, message: `Gagal print etiket ke-${failed.map((f) => f.index + 1).join(', ')}` }
  }
  return {
    success: true,
    message: isAndroidWebView()
      ? `${results.length} etiket dikirim ke printer`
      : `DEV: ${results.length} etiket di-log ke console`,
  }
}

/**
 * @deprecated Jalur lama berbasis TEKS ESC/POS. Hasil cetak TIDAK akan punya
 * border tabel/logo seperti preview web, karena printer thermal mode teks
 * tidak punya konsep gambar. Dipertahankan hanya sebagai referensi / fallback.
 * Gunakan printAllEtiketAsImage() untuk hasil identik preview.
 */
export function printAllEtiket(data) {
  const { nomorResep, tanggal, namaPasien, namaDokter, namaApotek, alamat, telepon, apotekerName, obatList } = data

  const results = []

  for (let i = 0; i < obatList.length; i++) {
    const obat = obatList[i]
    if (!obat.dosis?.trim()) continue

    const payload = {
      nomorResep: String(nomorResep),
      tanggal,
      namaPasien,
      namaDokter: namaDokter || '',
      namaApotek,
      alamat: alamat || '',
      telepon: telepon || '',
      apotekerName: apotekerName || '',
      etiketIndex: i + 1,
      totalEtiket: obatList.filter(o => o.dosis?.trim()).length,
      dosis: obat.dosis,
      waktu: obat.waktu || '',
      keterangan: obat.keterangan || '',
    }

    if (isAndroidWebView()) {
      try {
        window.AndroidPrinter.print(JSON.stringify(payload))
        results.push({ index: i, success: true })
      } catch (err) {
        results.push({ index: i, success: false, message: err.message })
      }
    } else {
      console.log(`[DEV] Print etiket ${i + 1}:`, JSON.stringify(payload, null, 2))
      results.push({ index: i, success: true })
    }
  }

  const failed = results.filter((r) => !r.success)
  if (failed.length > 0) {
    return { success: false, message: `Gagal print etiket ke-${failed.map(f => f.index + 1).join(', ')}` }
  }
  const count = results.length
  return {
    success: true,
    message: isAndroidWebView()
      ? `${count} etiket dikirim ke printer`
      : `DEV: ${count} etiket di-log ke console`
  }
}

export function scanBluetooth() {
  if (isAndroidWebView() && window.AndroidPrinter.scanDevices) {
    window.AndroidPrinter.scanDevices()
  } else {
    console.log('[DEV] scanBluetooth called')
  }
}

export function connectPrinter(macAddress) {
  if (isAndroidWebView() && window.AndroidPrinter.connect) {
    window.AndroidPrinter.connect(macAddress)
  } else {
    console.log('[DEV] connectPrinter:', macAddress)
  }
}

export function disconnectPrinter() {
  if (isAndroidWebView() && window.AndroidPrinter.disconnect) {
    window.AndroidPrinter.disconnect()
  } else {
    console.log('[DEV] disconnectPrinter called')
  }
}

export function getPrinterStatus() {
  if (isAndroidWebView() && window.AndroidPrinter.isConnected) {
    const s = window.AndroidPrinter.isConnected()
    return s === 'true' || s === true
  }
  return false
}

export function registerAndroidCallbacks({ onDeviceList, onConnected, onDisconnected, onPrintStatus }) {
  if (onDeviceList) window.onBluetoothDeviceList = onDeviceList
  if (onConnected) window.onPrinterConnected = onConnected
  if (onDisconnected) window.onPrinterDisconnected = onDisconnected
  if (onPrintStatus) window.onPrintStatus = onPrintStatus
}
