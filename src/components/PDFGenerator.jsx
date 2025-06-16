import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (generalInfo, testCases, summary) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const pageHeight = doc.internal.pageSize.getHeight()
  let yOffset = 20
  const lineHeight = 7
  const bottomMargin = 20
  const maxYOffset = pageHeight - bottomMargin

  function formatDateBR(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Função auxiliar para adicionar label em negrito e valor ao lado (ou embaixo se não couber)
  function addLabeledTextInline(label, value, justify = false) {
    doc.setFont('helvetica', 'bold')
    const labelWidth = doc.getTextWidth(label)
    const availableWidth = pageWidth - 2 * margin
    doc.setFont('helvetica', 'normal')
    if (justify) {
      // Parágrafo justificado: label na linha, valor como parágrafo
      if (yOffset > maxYOffset) {
        doc.addPage()
        yOffset = 20
      }
      doc.setFont('helvetica', 'bold')
      doc.text(label, margin, yOffset)
      doc.setFont('helvetica', 'normal')
      const valueLines = doc.splitTextToSize(value, availableWidth - labelWidth - 2)
      // Renderiza o valor como parágrafo, logo após o label
      if (valueLines.length > 0) {
        doc.text(valueLines, margin + labelWidth + 2, yOffset)
        yOffset += valueLines.length * lineHeight
      } else {
        yOffset += lineHeight
      }
    } else {
      const valueLines = doc.splitTextToSize(value, availableWidth - labelWidth - 2)
      if (valueLines.length === 1 && (labelWidth + doc.getTextWidth(valueLines[0]) < availableWidth)) {
        if (yOffset > maxYOffset) {
          doc.addPage()
          yOffset = 20
        }
        doc.setFont('helvetica', 'bold')
        doc.text(label, margin, yOffset)
        doc.setFont('helvetica', 'normal')
        doc.text(valueLines[0], margin + labelWidth + 2, yOffset)
        yOffset += lineHeight
      } else {
        if (yOffset > maxYOffset) {
          doc.addPage()
          yOffset = 20
        }
        doc.setFont('helvetica', 'bold')
        doc.text(label, margin, yOffset)
        yOffset += lineHeight
        doc.setFont('helvetica', 'normal')
        for (const line of valueLines) {
          if (yOffset > maxYOffset) {
            doc.addPage()
            yOffset = 20
          }
          doc.text(line, margin, yOffset)
          yOffset += lineHeight
        }
      }
    }
  }

  // Função auxiliar para adicionar texto simples
  function addTextWithPageBreak(textLines) {
    for (const line of textLines) {
      if (yOffset > maxYOffset) {
        doc.addPage()
        yOffset = 20
      }
      doc.text(line, margin, yOffset)
      yOffset += lineHeight
    }
  }

  // Função para desenhar linha horizontal
  function drawHorizontalLine(y) {
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
  }

  // Título centralizado
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('Relatório de Evidências de Testes de Software', pageWidth / 2, yOffset, { align: 'center' })
  yOffset += 10
  drawHorizontalLine(yOffset)
  yOffset += 8

  // Informações Gerais
  doc.setFontSize(12)
  addLabeledTextInline('Projeto/Produto:', generalInfo.product)
  addLabeledTextInline('Versão:', generalInfo.version)
  addLabeledTextInline('Data:', formatDateBR(generalInfo.date))
  addLabeledTextInline('Responsável:', generalInfo.responsible)
  yOffset += 4
  drawHorizontalLine(yOffset)
  yOffset += 8

  // Escopo do Teste (label em cima, texto embaixo)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Escopo do Teste:', margin, yOffset)
  yOffset += lineHeight
  doc.setFont('helvetica', 'normal')
  const escopoLines = doc.splitTextToSize(generalInfo.objective, pageWidth - 2 * margin)
  for (const line of escopoLines) {
    if (yOffset > maxYOffset) { doc.addPage(); yOffset = 20 }
    doc.text(line, margin, yOffset)
    yOffset += lineHeight
  }
  yOffset += 2
  drawHorizontalLine(yOffset)
  yOffset += 8

  // Casos de Teste
  for (const testCase of testCases) {
    // Cabeçalho colorido
    if (testCase.status === 'Reprovado') {
      doc.setFillColor(236, 146, 146) // vermelho
    } else if (testCase.status === 'Aprovado'){
      doc.setFillColor(185, 215, 167) // Verde
    } else {
      doc.setFillColor(237, 207, 116) // Amarelo
    }
    doc.rect(margin, yOffset, pageWidth - 2 * margin, 10, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text(`Caso de Teste: ${testCase.id}`, margin + 2, yOffset + 7)
    doc.text(`Status: ${testCase.status}`, pageWidth / 2, yOffset + 7)
    doc.setTextColor(0, 0, 0)
    yOffset += 14

    // Descrição (label em cima, texto embaixo)
    doc.setFont('helvetica', 'bold')
    doc.text('Descrição:', margin, yOffset)
    yOffset += lineHeight
    doc.setFont('helvetica', 'normal')
    const descLines = doc.splitTextToSize(testCase.description, pageWidth - 2 * margin)
    for (const line of descLines) {
      if (yOffset > maxYOffset) { doc.addPage(); yOffset = 20 }
      doc.text(line, margin, yOffset)
      yOffset += lineHeight
    }
    yOffset += 2

    // Resultado Esperado (label em cima, texto embaixo)
    doc.setFont('helvetica', 'bold')
    doc.text('Resultado Esperado:', margin, yOffset)
    yOffset += lineHeight
    doc.setFont('helvetica', 'normal')
    const expLines = doc.splitTextToSize(testCase.expectedResult, pageWidth - 2 * margin)
    for (const line of expLines) {
      if (yOffset > maxYOffset) { doc.addPage(); yOffset = 20 }
      doc.text(line, margin, yOffset)
      yOffset += lineHeight
    }
    yOffset += 2

    // Resultado Obtido (label em cima, texto embaixo)
    doc.setFont('helvetica', 'bold')
    doc.text('Resultado Obtido:', margin, yOffset)
    yOffset += lineHeight
    doc.setFont('helvetica', 'normal')
    const obtLines = doc.splitTextToSize(testCase.actualResult, pageWidth - 2 * margin)
    for (const line of obtLines) {
      if (yOffset > maxYOffset) { doc.addPage(); yOffset = 20 }
      doc.text(line, margin, yOffset)
      yOffset += lineHeight
    }
    yOffset += 2

    // Evidências (imagens)
    if (testCase.evidences && testCase.evidences.length > 0) {
      for (const file of testCase.evidences) {
        const imageDataUrl = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(file)
        })
        const imgProps = doc.getImageProperties(imageDataUrl)
        const maxImgWidth = pageWidth - 2 * margin
        const maxImgHeight = 80
        let imgWidth = imgProps.width
        let imgHeight = imgProps.height
        if (imgWidth > maxImgWidth) {
          imgHeight = (maxImgWidth / imgWidth) * imgHeight
          imgWidth = maxImgWidth
        }
        if (imgHeight > maxImgHeight) {
          imgWidth = (maxImgHeight / imgHeight) * imgWidth
          imgHeight = maxImgHeight
        }
        if (yOffset + imgHeight > maxYOffset) {
          doc.addPage()
          yOffset = 20
        }
        doc.addImage(imageDataUrl, 'JPEG', margin, yOffset, imgWidth, imgHeight)
        yOffset += imgHeight + 4
      }
    }

    drawHorizontalLine(yOffset)
    yOffset += 8
  }

  // Resumo Geral
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Resumo Geral', margin, yOffset)
  yOffset += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  addLabeledTextInline('Total de Casos de Teste Executados:', String(summary.total))
  addLabeledTextInline('Casos Aprovados:', String(summary.approved))
  addLabeledTextInline('Casos Reprovados:', String(summary.rejected))
  addLabeledTextInline('Cobertura dos Testes:', `${summary.coverage}%`)
  yOffset += 8

  // Observações Finais (no final)
  if (summary?.summaryNotes?.trim()) {
    doc.setFont('helvetica', 'bold')
    doc.text('Observações Finais e Recomendações:', margin, yOffset)
    yOffset += 8
    doc.setFont('helvetica', 'normal')
    const notesLines = doc.splitTextToSize(summary.summaryNotes, pageWidth - (2 * margin))
    addTextWithPageBreak(notesLines)
    yOffset += 8
  }

  // Salva o PDF
  doc.save('relatorio-teste.pdf')
}
