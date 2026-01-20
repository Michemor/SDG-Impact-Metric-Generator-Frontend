import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import jsPDF from 'jspdf'

export default function ExportButtons({ summary, disabled }) {
  const exportCSV = () => {
    if (!summary?.sdgs?.length) return
    
    const headers = ['SDG ID', 'Code', 'Title', 'Projects', 'Publications', 'Impact Score']
    const rows = summary.sdgs.map(sdg => [
      sdg.id,
      sdg.code,
      sdg.title,
      sdg.projectCount || 0,
      sdg.publicationCount || 0,
      sdg.impactScore || 'N/A'
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sdg_report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    if (!summary?.sdgs?.length) return
    
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('SDG Impact Report', 20, 20)
    
    doc.setFontSize(12)
    let y = 40
    
    summary.sdgs.forEach((sdg) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(`${sdg.code}: ${sdg.title}`, 20, y)
      y += 8
      doc.setFontSize(10)
      doc.text(`Projects: ${sdg.projectCount || 0} | Publications: ${sdg.publicationCount || 0}`, 25, y)
      y += 12
      doc.setFontSize(12)
    })
    
    doc.save('sdg_report.pdf')
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={exportCSV}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Export CSV
      </button>
      <button
        onClick={exportPDF}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FileText className="w-4 h-4" />
        Export PDF
      </button>
    </div>
  )
}
