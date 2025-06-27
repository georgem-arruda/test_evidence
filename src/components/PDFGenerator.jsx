import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useRef } from 'react'

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
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d)) return ''
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  function addLabeledTextInline(label, value, justify = false) {
    doc.setFont('helvetica', 'bold')
    const labelWidth = doc.getTextWidth(label)
    const availableWidth = pageWidth - 2 * margin
    doc.setFont('helvetica', 'normal')
    if (justify) {
      if (yOffset > maxYOffset) {
        doc.addPage()
        yOffset = 20
      }
      doc.setFont('helvetica', 'bold')
      doc.text(label, margin, yOffset)
      doc.setFont('helvetica', 'normal')
      const valueLines = doc.splitTextToSize(value, availableWidth - labelWidth - 2)
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

  function drawHorizontalLine(y) {
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
  }

  // // Título
  // doc.setFont('helvetica', 'bold')
  // doc.setFontSize(24)
  // doc.text('Relatório de Evidências de Testes de Software', pageWidth / 2, yOffset, { align: 'center' })
  // yOffset += 10

  // Cabeçalho tipo planilha
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  const cellPadding = 3
  const cellHeight = 8
  const tableWidth = pageWidth - 2 * margin

  const col1Width = Math.round(tableWidth * 0.5)
  const col2Width = tableWidth - col1Width
  const col3Width = Math.round(tableWidth * 0.3)
  const col4Width = tableWidth - col3Width
  const col5Width = Math.round(tableWidth * 0.2)
  const col6Width = Math.round(tableWidth * 0.2)
  const col7Width = Math.round(tableWidth * 0.2)
  const col8Width = Math.round(tableWidth * 0.2)
  const col9Width = tableWidth - (col5Width + col6Width + col7Width + col8Width)

  const startX = margin
  let tableY = yOffset
  
  // Redefine larguras das colunas
  const col50 = tableWidth / 2
  const col33 = tableWidth / 3
  const col25 = tableWidth / 4
  const col75 = tableWidth * 0.75
  
  // Função auxiliar
  function drawLabeledCell(label, value, x, y, width) {
    doc.setFont('helvetica', 'bold')
    doc.rect(x, y, width, cellHeight)
    doc.text(label, x + cellPadding, y + 6)
    const labelWidth = doc.getTextWidth(label) + cellPadding + 2
    doc.setFont('helvetica', 'normal')
    doc.text(value || '-', x + labelWidth, y + 6)
  }
  
  // Linha de título única
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.rect(startX, tableY, tableWidth, cellHeight)
  doc.text('Relatório de Evidências de Testes de Software', pageWidth / 2, tableY + 6, { align: 'center' })
  tableY += cellHeight
  
  // Linha 1: Projeto/Produto
  drawLabeledCell('Projeto/Produto:', generalInfo.product, startX, tableY, tableWidth)
  tableY += cellHeight
  
  // Linha 2: Versão | Data
  drawLabeledCell('Versão:', generalInfo.version, startX, tableY, col50)
  drawLabeledCell('Data:', formatDateBR(generalInfo.date), startX + col50, tableY, col50)
  tableY += cellHeight
  
  // Linha 3: Responsável | Tipo de Teste
  drawLabeledCell('Responsável:', generalInfo.responsible, startX, tableY, col50)
  drawLabeledCell('Tipo de Teste:', generalInfo.testType, startX + col50, tableY, col50)
  tableY += cellHeight
  
  // Linha 4: Ambiente | SO
  drawLabeledCell('Ambiente:', generalInfo.testEnvironment, startX, tableY, col50)
  drawLabeledCell('SO:', generalInfo.os, startX + col50, tableY, col50)
  tableY += cellHeight
  
  // Linha 5: Navegador | Banco de Dados
  drawLabeledCell('Navegador:', generalInfo.browser, startX, tableY, col50)
  drawLabeledCell('Banco de Dados:', generalInfo.database, startX + col50, tableY, col50)
  tableY += cellHeight
  
  // Finaliza cabeçalho
  yOffset = tableY + 4
  drawHorizontalLine(yOffset)
  yOffset += 8
  
  

  // RESUMO GERAL (antes do escopo)
  // Cabeçalho do resumo
  const summaryTableWidth = tableWidth;
  const summaryStartX = startX;
  let summaryY = yOffset;
  const summaryRowHeight = 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  // Cabeçalho cinza claro
  doc.setFillColor(230, 230, 230);
  doc.rect(summaryStartX, summaryY, summaryTableWidth, summaryRowHeight, 'F');
  doc.setTextColor(60, 60, 60);
  doc.text('Resumo Geral', pageWidth / 2, summaryY + 8, { align: 'center' });
  summaryY += summaryRowHeight;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Linhas do resumo
  const summaryRows = [
    { label: 'Total de Casos de Teste Executados', value: summary.total, color: [200, 200, 200] },
    { label: 'Casos Aprovados', value: summary.approved, color: [185, 215, 167] },
    { label: 'Casos Reprovados', value: summary.rejected, color: [236, 146, 146] },
    { label: 'Casos Bloqueados', value: summary.blocked, color: [237, 207, 116] },
    { label: 'Cobertura dos Testes', value: `${summary.coverage}%`, color: [200, 200, 200] },
  ];
  const labelWidth = Math.round(summaryTableWidth * 0.7);
  const valueWidth = summaryTableWidth - labelWidth;
  for (const row of summaryRows) {
    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(245, 245, 245);
    doc.rect(summaryStartX, summaryY, labelWidth, summaryRowHeight, 'F');
    doc.text(row.label, summaryStartX + 3, summaryY + 8);
    // Valor
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(...row.color);
    doc.rect(summaryStartX + labelWidth, summaryY, valueWidth, summaryRowHeight, 'F');
    doc.text(String(row.value), summaryStartX + labelWidth + valueWidth / 2, summaryY + 8, { align: 'center' });
    summaryY += summaryRowHeight;
  }
  yOffset = summaryY + 8;

  // Escopo
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
    if (testCase.status === 'Reprovado') {
      doc.setFillColor(236, 146, 146)
    } else if (testCase.status === 'Aprovado') {
      doc.setFillColor(185, 215, 167)
    } else {
      doc.setFillColor(237, 207, 116)
    }
    doc.rect(margin, yOffset, pageWidth - 2 * margin, 10, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text(`Caso de Teste: ${testCase.id}`, margin + 2, yOffset + 7)
    doc.text(`Status: ${testCase.status}`, pageWidth / 2, yOffset + 7)
    doc.setTextColor(0, 0, 0)
    yOffset += 14

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

  if (summary?.summaryNotes?.trim()) {
    doc.setFont('helvetica', 'bold')
    doc.text('Observações Finais e Recomendações:', margin, yOffset)
    yOffset += 8
    doc.setFont('helvetica', 'normal')
    const notesLines = doc.splitTextToSize(summary.summaryNotes, pageWidth - (2 * margin))
    addTextWithPageBreak(notesLines)
    yOffset += 8
  }

  doc.save('relatorio-teste.pdf')
}
