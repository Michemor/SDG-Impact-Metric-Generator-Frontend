import jsPDF from 'jspdf'

const formatTimestamp = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleString()
  } catch (error) {
    console.warn('Unable to format timestamp:', error)
    return timestamp
  }
}

const buildCsvContent = (summary, detail) => {
  if (!summary?.sdgs?.length) {
    return ''
  }

  const header = ['SDG Code', 'SDG Title', 'Projects', 'Publications', 'Departments', 'Researchers']
  const rows = summary.sdgs.map((sdg) => [
    sdg.code,
    sdg.title.replace(/,/g, ';'),
    sdg.projectCount,
    sdg.publicationCount,
    sdg.departmentCount,
    sdg.researcherCount,
  ])

  const csvLines = [header.join(','), ...rows.map((row) => row.join(','))]

  if (detail?.sdg) {
    csvLines.push('')
    csvLines.push(`Drill-down for ${detail.sdg.code} ${detail.sdg.title.replace(/,/g, ';')}`)
    const itemHeader = ['Type', 'Title', 'Year', 'Department', 'Researchers', 'SDGs']
    const drillRows = [...detail.projects, ...detail.publications].map((record) => [
      record.type,
      record.title.replace(/,/g, ';'),
      record.year,
      record.department?.name?.replace(/,/g, ';') ?? 'N/A',
      record.researchers.map((person) => person.name).join('; '),
      record.sdgs.map((goal) => goal.code).join('; '),
    ])
    csvLines.push(itemHeader.join(','))
    drillRows.forEach((row) => csvLines.push(row.join(',')))
  }

  return csvLines.join('\n')
}

const downloadBlob = (content, type, filename) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const exportPdf = (summary, detail) => {
  if (!summary?.sdgs?.length) {
    return
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  let cursorY = 60

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Daystar Research Intelligence Hub — SDG Report', 40, cursorY)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  cursorY += 20
  doc.text(`Generated at: ${formatTimestamp(summary.generatedAt)}`, 40, cursorY)

  cursorY += 30
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('SDG Summary', 40, cursorY)
  cursorY += 16

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  summary.sdgs.forEach((sdg) => {
    if (cursorY > 760) {
      doc.addPage()
      cursorY = 60
    }

    doc.text(`${sdg.code} — ${sdg.title}`, 40, cursorY)
    cursorY += 14
    doc.text(`Projects: ${sdg.projectCount} | Publications: ${sdg.publicationCount} | Departments: ${sdg.departmentCount} | Researchers: ${sdg.researcherCount}`, 40, cursorY)
    cursorY += 18
  })

  if (detail?.sdg) {
    if (cursorY > 720) {
      doc.addPage()
      cursorY = 60
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(`Drill-down — ${detail.sdg.code} ${detail.sdg.title}`, 40, cursorY)
    cursorY += 18

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(
      `Projects: ${detail.stats.projects} | Publications: ${detail.stats.publications} | Departments: ${detail.stats.departments} | Researchers: ${detail.stats.researchers}`,
      40,
      cursorY,
    )
    cursorY += 20

    const renderItems = (items, heading) => {
      if (!items.length) {
        return
      }

      doc.setFont('helvetica', 'bold')
      doc.text(heading, 40, cursorY)
      cursorY += 16
      doc.setFont('helvetica', 'normal')

      items.forEach((item) => {
        if (cursorY > 760) {
          doc.addPage()
          cursorY = 60
        }

        doc.setFont('helvetica', 'bold')
        doc.text(`${item.title} (${item.year})`, 40, cursorY)
        cursorY += 14
        doc.setFont('helvetica', 'normal')

        const departmentLine = item.department?.name ? `Department: ${item.department.name}` : 'Department: N/A'
        const researcherLine = item.researchers.length
          ? `Researchers: ${item.researchers.map((person) => person.name).join(', ')}`
          : 'Researchers: N/A'
        const sdgLine = `SDGs: ${item.sdgs.map((goal) => goal.code).join(', ')}`

        const descriptionLines = doc.splitTextToSize(item.description || 'No description provided.', pageWidth - 80)

        doc.text(departmentLine, 40, cursorY)
        cursorY += 12
        doc.text(researcherLine, 40, cursorY)
        cursorY += 12
        doc.text(sdgLine, 40, cursorY)
        cursorY += 12
        doc.text(descriptionLines, 40, cursorY)
        cursorY += descriptionLines.length * 12 + 12
      })
    }

    renderItems(detail.projects, 'Projects')
    renderItems(detail.publications, 'Publications')
  }

  doc.save(`daystar-sdg-report-${Date.now()}.pdf`)
}

const ExportButtons = ({ summary, selectedDetail, disabled }) => {
  const handleCsv = () => {
    if (disabled) {
      return
    }
    const csvContent = buildCsvContent(summary, selectedDetail)
    if (!csvContent) {
      return
    }
    downloadBlob(csvContent, 'text/csv;charset=utf-8;', `daystar-sdg-report-${Date.now()}.csv`)
  }

  const handlePdf = () => {
    if (disabled) {
      return
    }
    exportPdf(summary, selectedDetail)
  }

  return (
    <div className="chip-list">
      <button onClick={handlePdf} disabled={disabled}>
        Export PDF
      </button>
      <button onClick={handleCsv} disabled={disabled}>
        Export CSV
      </button>
    </div>
  )
}

export default ExportButtons
