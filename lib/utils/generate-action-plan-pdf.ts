/**
 * Gerar Action Plan em PDF
 * Converte sugestões e plano em documento PDF profissional
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ActionPlanItem {
  priority: number
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  impact?: string
  estimatedDays?: number
}

export async function generateActionPlanPDF(
  businessName: string,
  overallScore: number,
  actionItems: ActionPlanItem[],
  htmlElement?: HTMLElement
) {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPos = 20

    // Header
    pdf.setFontSize(24)
    pdf.setTextColor(31, 41, 55) // gray-900
    pdf.text('📋 Action Plan', pageWidth / 2, yPos, { align: 'center' })

    yPos += 15

    // Business Info
    pdf.setFontSize(12)
    pdf.setTextColor(75, 85, 99) // gray-600
    pdf.text(`Negócio: ${businessName}`, 20, yPos)

    yPos += 8

    pdf.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, 20, yPos)

    yPos += 15

    // Overall Score
    pdf.setFontSize(14)
    pdf.setTextColor(31, 41, 55)
    pdf.text('Overall Business Score', 20, yPos)

    yPos += 10

    // Score Box
    pdf.setFillColor(219, 234, 254) // blue-100
    pdf.rect(20, yPos, 170, 25, 'F')
    pdf.setFontSize(32)
    pdf.setTextColor(37, 99, 235) // blue-600
    pdf.text(`${overallScore}`, 100, yPos + 18, { align: 'center' })

    yPos += 40

    // Action Items
    pdf.setFontSize(14)
    pdf.setTextColor(31, 41, 55)
    pdf.text('Plano de Ação', 20, yPos)

    yPos += 12

    actionItems.forEach((item, index) => {
      // Check if need new page
      if (yPos > pageHeight - 40) {
        pdf.addPage()
        yPos = 20
      }

      // Priority Badge
      const badgeColor = item.type === 'critical'
        ? { r: 239, g: 68, b: 68 }
        : item.type === 'warning'
          ? { r: 234, g: 179, b: 8 }
          : { r: 96, g: 165, b: 250 }
      pdf.setFillColor(badgeColor.r, badgeColor.g, badgeColor.b)
      pdf.rect(20, yPos, 10, 10, 'F')

      pdf.setFontSize(10)
      pdf.setTextColor(31, 41, 55)
      pdf.text(`${item.priority}`, 25, yPos + 7)

      // Title
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(item.title, 35, yPos + 3, { maxWidth: 155 })

      yPos += 12

      // Description
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(75, 85, 99)
      const descLines = pdf.splitTextToSize(item.description, 165)
      pdf.text(descLines, 35, yPos)

      yPos += descLines.length * 5 + 3

      // Impact
      if (item.impact) {
        pdf.setTextColor(22, 163, 74) // green-600
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8)
        pdf.text(`Impacto: ${item.impact}`, 35, yPos)
        yPos += 6
      }

      // Estimated days
      if (item.estimatedDays) {
        pdf.setTextColor(100, 116, 139) // slate-500
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.text(`⏱️ Estimado: ${item.estimatedDays} dias`, 35, yPos)
        yPos += 6
      }

      yPos += 8
    })

    // Footer
    yPos = pageHeight - 20
    pdf.setFontSize(8)
    pdf.setTextColor(156, 163, 175) // gray-400
    pdf.text(
      `Gerado em ${new Date().toLocaleDateString('pt-PT')} - Ecom Cockpit Dashboard`,
      pageWidth / 2,
      yPos,
      { align: 'center' }
    )

    // Download
    pdf.save(`action-plan-${businessName}-${new Date().toISOString().split('T')[0]}.pdf`)
    return true
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return false
  }
}

export async function generateScreenshotPDF(
  htmlElement: HTMLElement,
  fileName: string
) {
  try {
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth - 10
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight)

    // Add timestamp
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(
      `Gerado em ${new Date().toLocaleDateString('pt-PT')} - ${new Date().toLocaleTimeString('pt-PT')}`,
      pdfWidth / 2,
      pdfHeight - 5,
      { align: 'center' }
    )

    pdf.save(`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`)
    return true
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return false
  }
}
