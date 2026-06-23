import { useSettingsStore } from '../store'

/**
 * Komponen preview etiket tunggal - persis seperti format apotek profesional
 * Tiap "obat" = 1 etiket terpisah
 */
export default function EtiketPreview({ 
  obat,           // { dosis, waktu, keterangan }
  nomorResep,     // nomor urut (1, 2, 3...)
  tanggal,
  namaPasien,
  namaDokter,
  index = 0,      // index dalam array (untuk label etiket ke-N)
  compact = false 
}) {
  const { namaApotek, alamat, telepon, apotekerName, logoUrl } = useSettingsStore()

  if (compact) {
    return (
      <div className="bg-white border border-gray-300 rounded text-xs font-mono p-2">
        <p className="font-bold text-center text-xs">{namaApotek}</p>
        <p className="text-center text-xs truncate">{alamat}</p>
        <div className="border-t border-gray-300 mt-1 pt-1 flex gap-2">
          <span>No: {nomorResep}</span>
          <span>{tanggal}</span>
        </div>
        <p className="truncate">Pasien: {namaPasien}</p>
        {obat?.dosis && <p className="font-bold text-center">{obat.dosis}</p>}
        {obat?.waktu && <p className="text-center">{obat.waktu}</p>}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Label etiket ke-N */}
      <div className="bg-apotek-600 text-white text-xs font-semibold px-3 py-1 flex items-center gap-2">
        <span className="w-4 h-4 bg-white text-apotek-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
        Etiket {index + 1}
      </div>

      {/* Border table wrapper */}
      <div className="border border-gray-400" style={{ margin: '6px' }}>
        
        {/* Header row: Logo | Nama Apotek + Info */}
        <div className="flex border-b border-gray-400" style={{ minHeight: '70px' }}>
          {/* Logo - kiri (gambar upload jika ada, fallback teks) */}
          <div className="flex items-center justify-center border-r border-gray-400 bg-white" style={{ minWidth: '88px', width: '88px', padding: '6px' }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Apotek"
                style={{ maxWidth: '76px', maxHeight: '76px', objectFit: 'contain' }}
              />
            ) : (
              <div className="text-center">
                {/* Logo apotek sederhana (default, jika belum upload logo) */}
                <div className="text-apotek-700 font-black leading-none" style={{ fontSize: '10px', lineHeight: '1.1' }}>
                  <div style={{ fontSize: '17px' }}>⚕</div>
                  <div className="text-apotek-600 font-black" style={{ fontSize: '10px' }}>APOTEK</div>
                  <div className="text-apotek-800 font-black" style={{ fontSize: '15px' }}>{namaApotek.replace('APOTEK ', '').split(' ')[0]}</div>
                  <div className="text-gray-500" style={{ fontSize: '7px', wordBreak: 'break-all' }}>{alamat.split(',').slice(-2).join(',').trim()}</div>
                </div>
              </div>
            )}
          </div>

          {/* Nama apotek + info - kanan */}
          <div className="flex-1 flex flex-col items-center justify-center p-2 text-center">
            <p className="font-black text-gray-900" style={{ fontSize: '18px', lineHeight: '1.2' }}>{namaApotek}</p>
            <p className="text-gray-700 mt-0.5" style={{ fontSize: '11px', lineHeight: '1.3' }}>{alamat}</p>
            <p className="text-gray-700" style={{ fontSize: '11px', lineHeight: '1.3' }}>Apoteker: {apotekerName}</p>
            <p className="text-gray-700" style={{ fontSize: '11px' }}>No Telp: {telepon}</p>
          </div>
        </div>

        {/* Row: No + Tanggal */}
        <div className="flex border-b border-gray-400">
          <div className="flex-1 py-1 px-2 border-r border-gray-400">
            <span className="font-bold text-gray-900" style={{ fontSize: '11px' }}>NO: {nomorResep}</span>
          </div>
          <div className="flex-1 py-1 px-2">
            <span className="font-bold text-gray-900" style={{ fontSize: '11px' }}>TANGGAL: {tanggal}</span>
          </div>
        </div>

        {/* Row: Pasien */}
        <div className="border-b border-gray-400 py-1 px-2">
          <span className="font-bold text-gray-900" style={{ fontSize: '11px' }}>PASIEN: {namaPasien || ''}</span>
        </div>

        {/* Row: OBAT label */}
        <div className="border-b border-gray-400 py-1 text-center">
          <span className="font-bold text-gray-900" style={{ fontSize: '11px' }}>OBAT:</span>
        </div>

        {/* Dosis + Waktu + Keterangan - digabung dalam satu kotak tanpa garis pemisah */}
        <div className="py-2 text-center">
          <p className="font-black text-gray-900" style={{
            fontSize: obat?.dosis?.length > 20 ? '14px' : obat?.dosis?.length > 14 ? '18px' : '22px',
            lineHeight: '1.2', margin: 0, padding: '6px 6px', wordBreak: 'break-word'
          }}>
            {obat?.dosis || ''}
          </p>

          {obat?.waktu && (
            <p className="font-black text-gray-900" style={{
              fontSize: obat?.waktu?.length > 20 ? '14px' : obat?.waktu?.length > 14 ? '18px' : '24px',
              lineHeight: '1.2', margin: 0, padding: '4px 6px', wordBreak: 'break-word'
            }}>
              {obat.waktu}
            </p>
          )}

          {obat?.keterangan && (
            <p className="font-semibold text-gray-800" style={{
              fontSize: obat?.keterangan?.length > 25 ? '11px' : obat?.keterangan?.length > 16 ? '13px' : '15px',
              lineHeight: '1.3', margin: 0, padding: '4px 6px', wordBreak: 'break-word'
            }}>
              {obat.keterangan}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
