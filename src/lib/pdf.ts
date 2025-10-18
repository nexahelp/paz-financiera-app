
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportSectionToPDF(containerId: string, filename: string) {
  const el = document.getElementById(containerId)
  if (!el) throw new Error('No se encontró el contenedor')
  const canvas = await html2canvas(el, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'pt', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth - 40
  const imgHeight = canvas.height * (imgWidth / canvas.width)

  if (imgHeight <= pageHeight - 40) {
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight)
  } else {
    let position = 0
    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 20, 20 - position, imgWidth, imgHeight)
      position += pageHeight
      if (position < imgHeight) pdf.addPage()
    }
  }
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}
