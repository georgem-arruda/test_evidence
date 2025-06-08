import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (generalInfo, testCases) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yOffset = 20

  // Título
  doc.setFontSize(20)
  doc.text('Test Evidence Management System', pageWidth / 2, yOffset, { align: 'center' })
  yOffset += 20

  // Informações Gerais
  doc.setFontSize(16)
  doc.text('Informações Gerais', margin, yOffset)
  yOffset += 10

  doc.setFontSize(12)
  doc.text(`Produto: ${generalInfo.product}`, margin, yOffset)
  yOffset += 7
  doc.text(`Versão: ${generalInfo.version}`, margin, yOffset)
  yOffset += 7
  doc.text(`Data: ${generalInfo.date}`, margin, yOffset)
  yOffset += 7
  doc.text(`Responsável: ${generalInfo.responsible}`, margin, yOffset)
  yOffset += 15

  // Escopo do Teste
  doc.setFontSize(16)
  doc.text('Escopo do Teste', margin, yOffset)
  yOffset += 10

  doc.setFontSize(12)
  const objectiveLines = doc.splitTextToSize(generalInfo.objective, pageWidth - (2 * margin))
  doc.text(objectiveLines, margin, yOffset)
  yOffset += (objectiveLines.length * 7) + 15

  // Casos de Teste
  doc.setFontSize(16)
  doc.text('Casos de Teste', margin, yOffset)
  yOffset += 10

  doc.setFontSize(12)
  for (const testCase of testCases) {
    // Verifica se precisa de nova página
    if (yOffset > 250) {
      doc.addPage()
      yOffset = 20
    }

    doc.text(`Caso de Teste ${testCase.id}`, margin, yOffset)
    yOffset += 7
    doc.text(`Descrição: ${testCase.description}`, margin, yOffset)
    yOffset += 7
    doc.text(`Resultado Esperado: ${testCase.expectedResult}`, margin, yOffset)
    yOffset += 7
    doc.text(`Resultado Obtido: ${testCase.actualResult}`, margin, yOffset)
    yOffset += 7
    doc.text(`Status: ${testCase.status}`, margin, yOffset)
    yOffset += 15

    // Adiciona a evidência se existir
    if (testCase.evidence) {
      try {
        const imgData = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(testCase.evidence)
        })

        const img = new Image()
        img.src = imgData
        await new Promise((resolve) => {
          img.onload = resolve
        })

        // Calcula as dimensões da imagem para caber na página
        const maxWidth = pageWidth - (2 * margin)
        const maxHeight = 100
        let imgWidth = img.width
        let imgHeight = img.height

        if (imgWidth > maxWidth) {
          const ratio = maxWidth / imgWidth
          imgWidth = maxWidth
          imgHeight = imgHeight * ratio
        }

        if (imgHeight > maxHeight) {
          const ratio = maxHeight / imgHeight
          imgHeight = maxHeight
          imgWidth = imgWidth * ratio
        }

        // Verifica se precisa de nova página
        if (yOffset + imgHeight > 250) {
          doc.addPage()
          yOffset = 20
        }

        doc.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, imgHeight)
        yOffset += imgHeight + 15
      } catch (error) {
        console.error('Erro ao processar imagem:', error)
      }
    }

    yOffset += 10
  }

  // Salva o PDF
  doc.save('relatorio-teste.pdf')
} 