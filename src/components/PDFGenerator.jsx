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
  function addLabeledTextInline(label, value) {
    doc.setFont('helvetica', 'bold')
    const labelWidth = doc.getTextWidth(label)
    const availableWidth = pageWidth - 2 * margin
    doc.setFont('helvetica', 'normal')
    const valueLines = doc.splitTextToSize(value, availableWidth - labelWidth - 2)
    // Se couber na mesma linha
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
      // Label na linha de cima, valor quebrado embaixo
      if (yOffset > maxYOffset) {
        doc.addPage()
        yOffset = 20
      }
      doc.setFont('Montserrat', 'bold')
      doc.text(label, margin, yOffset)
      yOffset += lineHeight
      doc.setFont('Montserrat', 'normal')
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

  // Título
  doc.setFont('Montserrat', 'bold')
  doc.setFontSize(21)
  doc.text('Relatório de Evidências de Testes de Software', pageWidth / 2, yOffset, { align: 'center' })
  yOffset += 20

  // Informações Gerais
  doc.setFont('Montserrat', 'bold')
  doc.setFontSize(16)
  doc.text('Informações Gerais', pageWidth / 2, yOffset, { align: 'center' })
  yOffset += 10

  doc.setFontSize(12)
  addLabeledTextInline('Produto:', generalInfo.product)
  addLabeledTextInline('Versão:', generalInfo.version)
  addLabeledTextInline('Data:', formatDateBR(generalInfo.date))
  addLabeledTextInline('Responsável:', generalInfo.responsible)
  yOffset += 8

  // Escopo do Teste
  doc.setFont('Montserrat', 'bold')
  doc.setFontSize(16)
  doc.text('Escopo do Teste', pageWidth / 2, yOffset, { align: 'center' })
  yOffset += 10

  doc.setFont('Montserrat', 'bold')
  doc.setFontSize(12)
  addLabeledTextInline('Objetivo do Teste:', generalInfo.objective)
  yOffset += 8

  // Casos de Teste
  doc.setFont('Montserrat', 'bold')
  doc.setFontSize(16)
  yOffset += 10
  doc.text('Evidências dos Testes', pageWidth / 2, yOffset, { align: 'center' })
  yOffset += 10

  doc.setFontSize(12)
  for (const testCase of testCases) {
    if (yOffset > maxYOffset) {
      doc.addPage()
      yOffset = 20
    }
    addTextWithPageBreak([`Caso de Teste ${testCase.id}`])
    addLabeledTextInline('Descrição:', testCase.description)
    addLabeledTextInline('Resultado Esperado:', testCase.expectedResult)
    addLabeledTextInline('Resultado Obtido:', testCase.actualResult)
    addLabeledTextInline('Status:', testCase.status)
    yOffset += 8

    // Evidência (se houver)
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
          imgHeight *= ratio
        }

        if (imgHeight > maxHeight) {
          const ratio = maxHeight / imgHeight
          imgHeight = maxHeight
          imgWidth *= ratio
        }

        if (yOffset + imgHeight > maxYOffset) {
          doc.addPage()
          yOffset = 20
        }

        doc.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, imgHeight)
        yOffset += imgHeight + 8
      } catch (error) {
        console.error('Erro ao processar imagem:', error)
      }
    }
    yOffset += 8
  }

  // Adiciona nova página se necessário antes do resumo
  if (yOffset > maxYOffset - 40) {
    doc.addPage()
    yOffset = 20
  }

  // Resumo Geral (no final)
  if (summary) {
    doc.setFontSize(16)
    doc.text('Resumo Geral', margin, yOffset)
    yOffset += 10
    doc.setFontSize(12)
    addLabeledTextInline('Total de Casos de Teste Executados:', String(summary.total))
    addLabeledTextInline('Casos Aprovados:', String(summary.approved))
    addLabeledTextInline('Casos Reprovados:', String(summary.rejected))
    addLabeledTextInline('Cobertura dos Testes:', `${summary.coverage}%`)
    yOffset += 8
  }

  // Observações Finais (no final)
  if (summary?.summaryNotes?.trim()) {
    if (yOffset > maxYOffset - 40) {
      doc.addPage()
      yOffset = 20
    }
    doc.setFontSize(14)
    doc.setFont('Montserrat', 'bold')
    doc.text('Observações Finais e Recomendações:', margin, yOffset)
    yOffset += 8
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const notesLines = doc.splitTextToSize(summary.summaryNotes, pageWidth - (2 * margin))
    addTextWithPageBreak(notesLines)
    yOffset += 8
  }

  // Salva o PDF
  doc.save('relatorio-teste.pdf')
}
