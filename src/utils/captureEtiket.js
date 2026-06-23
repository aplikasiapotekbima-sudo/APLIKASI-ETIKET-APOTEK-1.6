import { createRoot } from 'react-dom/client'
import html2canvas from 'html2canvas'

/**
 * Render sebuah elemen React ke DOM tersembunyi (di luar viewport, bukan display:none
 * supaya html2canvas tetap bisa menghitung layout dengan benar), tunggu sampai semua
 * <img> di dalamnya selesai load (logo apotek bisa async), lalu capture jadi PNG.
 *
 * @param {React.ReactElement} element  elemen yang mau di-capture (mis. <EtiketPrintTemplate ... />)
 * @param {number} scale  faktor render html2canvas, lebih besar = lebih tajam tapi lebih berat
 * @returns {Promise<string>} base64 PNG TANPA prefix "data:image/png;base64,"
 */
export async function captureElementAsImage(element, scale = 2) {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '-99999px' // di luar viewport, tapi tetap "visible" supaya ter-render
  container.style.zIndex = '-1'
  container.style.background = '#ffffff'
  document.body.appendChild(container)

  const root = createRoot(container)

  try {
    await new Promise((resolve) => {
      root.render(element)
      // Tunggu satu frame agar React selesai commit ke DOM
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    })

    await waitForImages(container)

    const canvas = await html2canvas(container, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    })

    const dataUrl = canvas.toDataURL('image/png')
    return dataUrl.split(',')[1] // buang prefix "data:image/png;base64,"
  } finally {
    root.unmount()
    document.body.removeChild(container)
  }
}

/** Tunggu semua <img> di dalam container selesai load (atau gagal load, supaya tidak nyangkut) */
function waitForImages(container, timeoutMs = 3000) {
  const images = Array.from(container.querySelectorAll('img'))
  if (images.length === 0) return Promise.resolve()

  return Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise((resolve) => {
        const timer = setTimeout(resolve, timeoutMs)
        img.addEventListener('load', () => { clearTimeout(timer); resolve() }, { once: true })
        img.addEventListener('error', () => { clearTimeout(timer); resolve() }, { once: true })
      })
    })
  )
}
