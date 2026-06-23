/**
 * Versi "bersih" dari EtiketPreview, khusus untuk di-capture jadi bitmap dan dicetak.
 *
 * Beda dengan EtiketPreview (yang dipakai untuk preview di layar):
 * - Tidak ada label hijau "Etiket N" (itu cuma UI list, bukan bagian struk)
 * - Tidak ada shadow / rounded corner (supaya background bersih putih saat di-threshold jadi 1-bit)
 * - Lebar tetap (fixed width) dalam px supaya hasil capture konsisten,
 *   terlepas dari ukuran layar HP kasir.
 *
 * Komponen ini di-render ke DOM tersembunyi (lihat utils/captureEtiket.js),
 * di-capture dengan html2canvas, hasilnya dikirim ke Android sebagai PNG base64.
 */
export default function EtiketPrintTemplate({
  obat,
  nomorResep,
  tanggal,
  namaPasien,
  namaApotek,
  alamat,
  telepon,
  apotekerName,
  logoUrl,
  width = 576, // lebar render dalam px (di-scale ulang oleh Android sesuai lebar printer asli)
}) {
  return (
    <div
      style={{
        width: `${width}px`,
        background: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ border: '2px solid #000', margin: '8px' }}>
        {/* Header row: Logo | Nama Apotek + Info */}
        <div style={{ display: 'flex', borderBottom: '2px solid #000', minHeight: '110px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '2px solid #000',
              minWidth: '140px',
              width: '140px',
              padding: '10px',
              background: '#fff',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Apotek"
                crossOrigin="anonymous"
                style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
                <div style={{ fontSize: '26px' }}>⚕</div>
                <div style={{ fontSize: '15px', fontWeight: 900 }}>APOTEK</div>
                <div style={{ fontSize: '22px', fontWeight: 900 }}>
                  {namaApotek.replace('APOTEK ', '').split(' ')[0]}
                </div>
                <div style={{ fontSize: '11px', color: '#444', wordBreak: 'break-all' }}>
                  {alamat.split(',').slice(-2).join(',').trim()}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1.2, margin: 0, color: '#000' }}>
              {namaApotek}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.3, margin: '4px 0 0 0', color: '#000' }}>{alamat}</p>
            <p style={{ fontSize: '16px', lineHeight: 1.3, margin: 0, color: '#000' }}>
              Apoteker: {apotekerName}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.3, margin: 0, color: '#000' }}>No Telp: {telepon}</p>
          </div>
        </div>

        {/* Row: No + Tanggal */}
        <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
          <div style={{ flex: 1, padding: '8px 12px', borderRight: '2px solid #000' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#000' }}>NO: {nomorResep}</span>
          </div>
          <div style={{ flex: 1, padding: '8px 12px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#000' }}>TANGGAL: {tanggal}</span>
          </div>
        </div>

        {/* Row: Pasien */}
        <div style={{ borderBottom: '2px solid #000', padding: '8px 12px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#000' }}>PASIEN: {namaPasien || ''}</span>
        </div>

        {/* Row: OBAT label */}
        <div style={{ borderBottom: '2px solid #000', padding: '8px 0', textAlign: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#000' }}>OBAT:</span>
        </div>

        {/* Dosis + Waktu + Keterangan */}
        <div style={{ padding: '10px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '34px', fontWeight: 900, lineHeight: 1.15, margin: 0, padding: '8px 6px', color: '#000' }}>
            {obat?.dosis || ''}
          </p>

          {obat?.waktu && (
            <p style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.15, margin: 0, padding: '6px 6px', color: '#000' }}>
              {obat.waktu}
            </p>
          )}

          {obat?.keterangan && (
            <p style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1.3, margin: 0, padding: '6px 6px', color: '#000' }}>
              {obat.keterangan}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
