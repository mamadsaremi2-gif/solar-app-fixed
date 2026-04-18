export function exportProjectPdf(project) {
  try {
    const dataStr = JSON.stringify(project, null, 2)

    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'solar-project.json'
    a.click()

    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF export error:', err)
    alert('خطا در خروجی گرفتن')
  }
}
