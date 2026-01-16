import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';
import { MonthData } from '../types';

// Generate PDF Export - Using jsPDF native methods (no html2canvas)
export async function exportToPDF(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData) {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Colors
  const gold = [212, 175, 55] as const;
  const dark = [26, 26, 26] as const;
  const gray = [102, 102, 102] as const;
  const lightGray = [200, 200, 200] as const;
  
  // Helper functions
  const setColor = (color: readonly [number, number, number]) => {
    pdf.setTextColor(color[0], color[1], color[2]);
  };
  
  const setFillColor = (color: readonly [number, number, number]) => {
    pdf.setFillColor(color[0], color[1], color[2]);
  };
  
  // ========== COVER PAGE ==========
  // Black background
  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Gold accent bar at top
  pdf.setFillColor(gold[0], gold[1], gold[2]);
  pdf.rect(0, 0, pageWidth, 3, 'F');
  
  // Logo area
  pdf.setFillColor(gold[0], gold[1], gold[2]);
  pdf.roundedRect(margin, 25, 18, 18, 3, 3, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(10, 10, 10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('57', margin + 9, 37, { align: 'center' });
  
  // Brand name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Physique 57', margin + 24, 33);
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(8);
  pdf.text('INDIA', margin + 24, 40);
  
  // Title section
  setColor(gold);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STRATEGIC PLANNING DOCUMENT', margin, 75);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text('2026 Sales', margin, 95);
  pdf.text('Masterplan', margin, 110);
  
  // Description
  pdf.setTextColor(136, 136, 136);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const description = 'A comprehensive revenue strategy encompassing targeted offers, seasonal campaigns, and customer lifecycle optimization across all studio locations.';
  const descLines = pdf.splitTextToSize(description, 120);
  pdf.text(descLines, margin, 130);
  
  // Stats
  const statsY = 180;
  pdf.setDrawColor(34, 34, 34);
  pdf.line(margin, statsY - 15, pageWidth - margin, statsY - 15);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(exportData.length), margin, statsY + 10);
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(8);
  pdf.text('MONTHS', margin, statsY + 18);
  
  const totalOffers = exportData.reduce((acc, m) => acc + m.offers.filter(o => !o.cancelled).length, 0);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.text(String(totalOffers), margin + 50, statsY + 10);
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(8);
  pdf.text('ACTIVE OFFERS', margin + 50, statsY + 18);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.text('3', margin + 110, statsY + 10);
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(8);
  pdf.text('STUDIOS', margin + 110, statsY + 18);
  
  // Footer date
  pdf.setTextColor(68, 68, 68);
  pdf.setFontSize(9);
  pdf.text(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin, pageHeight - 30, { align: 'right' });
  pdf.setFontSize(8);
  pdf.text('CONFIDENTIAL', pageWidth - margin, pageHeight - 22, { align: 'right' });
  
  // ========== MONTH PAGES ==========
  exportData.forEach((month, index) => {
    pdf.addPage();
    
    const activeOffers = month.offers.filter(o => !o.cancelled);
    
    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Month indicator box
    pdf.setFillColor(dark[0], dark[1], dark[2]);
    pdf.roundedRect(margin, 20, 22, 22, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(month.name.substring(0, 3).toUpperCase(), margin + 11, 31, { align: 'center' });
    pdf.setFontSize(7);
    pdf.setTextColor(180, 180, 180);
    pdf.text('2026', margin + 11, 38, { align: 'center' });
    
    // Month title
    setColor(dark);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(month.name, margin + 30, 28);
    
    setColor(gold);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(month.theme, margin + 30, 36);
    
    // Summary
    setColor(gray);
    pdf.setFontSize(9);
    const summaryLines = pdf.splitTextToSize(month.summary, contentWidth - 60);
    pdf.text(summaryLines, margin + 30, 44);
    
    // Revenue target box
    pdf.setFillColor(248, 248, 248);
    pdf.roundedRect(pageWidth - margin - 45, 20, 45, 25, 3, 3, 'F');
    pdf.setTextColor(136, 136, 136);
    pdf.setFontSize(7);
    pdf.text('REVENUE TARGET', pageWidth - margin - 40, 28);
    setColor(dark);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(month.revenueTargetTotal || '', pageWidth - margin - 40, 38);
    
    // Offers section header
    let yPos = 65;
    
    setColor(gold);
    pdf.setFillColor(gold[0], gold[1], gold[2]);
    pdf.rect(margin, yPos, 8, 2, 'F');
    
    setColor(dark);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STRATEGIC OFFERS', margin + 12, yPos + 2);
    
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(margin + 55, yPos - 3, 25, 8, 2, 2, 'F');
    setColor(gray);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${activeOffers.length} Active`, margin + 67, yPos + 2, { align: 'center' });
    
    yPos += 15;
    
    // Offers grid
    activeOffers.forEach((offer, oIndex) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 25;
      }
      
      const cardHeight = 55;
      const cardWidth = (contentWidth - 8) / 2;
      const xPos = oIndex % 2 === 0 ? margin : margin + cardWidth + 8;
      
      if (oIndex % 2 === 0 && oIndex > 0) {
        yPos += cardHeight + 8;
      }
      
      if (yPos > 250) {
        pdf.addPage();
        yPos = 25;
      }
      
      // Card background
      pdf.setFillColor(250, 250, 250);
      pdf.setDrawColor(235, 235, 235);
      pdf.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, 'FD');
      
      // Type badge
      const typeColors: {[key: string]: [number, number, number]} = {
        'Hero': [212, 175, 55],
        'New': [8, 145, 178],
        'Flash': [180, 83, 9],
        'Retention': [5, 150, 105],
        'Event': [190, 24, 93],
        'Lapsed': [82, 82, 82]
      };
      const typeColor = typeColors[offer.type] || typeColors['New'];
      setColor(typeColor);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.text(offer.type.toUpperCase(), xPos + 4, yPos + 8);
      
      // Offer title
      setColor(dark);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(offer.title, cardWidth - 10);
      pdf.text(titleLines.slice(0, 2), xPos + 4, yPos + 16);
      
      // Prices
      const priceY = yPos + 30;
      
      // Mumbai
      pdf.setTextColor(136, 136, 136);
      pdf.setFontSize(6);
      pdf.text('MUMBAI', xPos + 4, priceY);
      if (offer.priceMumbai) {
        setColor(dark);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`₹${(offer.finalPriceMumbai || offer.priceMumbai).toLocaleString('en-IN')}`, xPos + 4, priceY + 6);
        if (offer.targetUnitsMumbai) {
          setColor(gold);
          pdf.setFontSize(6);
          pdf.text(`${offer.targetUnitsMumbai} units`, xPos + 4, priceY + 12);
        }
      }
      
      // Bengaluru
      pdf.setTextColor(136, 136, 136);
      pdf.setFontSize(6);
      pdf.text('BENGALURU', xPos + cardWidth/2, priceY);
      if (offer.priceBengaluru) {
        setColor(dark);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`₹${(offer.finalPriceBengaluru || offer.priceBengaluru).toLocaleString('en-IN')}`, xPos + cardWidth/2, priceY + 6);
        if (offer.targetUnitsBengaluru) {
          setColor(gold);
          pdf.setFontSize(6);
          pdf.text(`${offer.targetUnitsBengaluru} units`, xPos + cardWidth/2, priceY + 12);
        }
      }
      
      // Discount badge
      if (offer.discountPercent) {
        pdf.setFillColor(254, 243, 199);
        pdf.roundedRect(xPos + 4, yPos + cardHeight - 10, 18, 6, 1, 1, 'F');
        pdf.setTextColor(180, 83, 9);
        pdf.setFontSize(5);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${offer.discountPercent}% OFF`, xPos + 6, yPos + cardHeight - 6);
      }
    });
    
    // Studio targets section (if exists)
    if (month.financialTargets && month.financialTargets.length > 0) {
      yPos += 70;
      
      if (yPos > 230) {
        pdf.addPage();
        yPos = 25;
      }
      
      setColor(gold);
      pdf.setFillColor(gold[0], gold[1], gold[2]);
      pdf.rect(margin, yPos, 8, 2, 'F');
      
      setColor(dark);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('STUDIO TARGETS', margin + 12, yPos + 2);
      
      yPos += 15;
      
      const targetWidth = (contentWidth - 16) / 3;
      month.financialTargets.forEach((target, tIndex) => {
        const txPos = margin + (tIndex * (targetWidth + 8));
        
        pdf.setFillColor(250, 250, 250);
        pdf.setDrawColor(235, 235, 235);
        pdf.roundedRect(txPos, yPos, targetWidth, 35, 3, 3, 'FD');
        
        pdf.setTextColor(136, 136, 136);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text(target.location.toUpperCase(), txPos + targetWidth/2, yPos + 10, { align: 'center' });
        
        setColor(dark);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(target.revenueTarget, txPos + targetWidth/2, yPos + 22, { align: 'center' });
        
        setColor(gray);
        pdf.setFontSize(6);
        pdf.setFont('helvetica', 'normal');
        const logicLines = pdf.splitTextToSize(target.logic || '', targetWidth - 8);
        pdf.text(logicLines.slice(0, 1), txPos + targetWidth/2, yPos + 30, { align: 'center' });
      });
    }
  });
  
  // Save PDF
  pdf.save(`Physique57_Sales_Plan_${scope === 'all' ? 'Full' : currentMonth?.name || 'Current'}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Generate Word Document Export
export async function exportToWord(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData) {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;
  
  const children: any[] = [
    new Paragraph({
      text: "Physique 57 India",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: "2026 Sales Masterplan",
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: `Generated: ${new Date().toLocaleDateString()}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  ];
  
  exportData.forEach(month => {
    // Month header
    children.push(
      new Paragraph({
        text: month.name,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        text: month.theme,
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: month.summary,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Revenue Target: ${month.revenueTargetTotal}`,
            bold: true,
            color: "059669"
          })
        ],
        spacing: { after: 300 }
      })
    );
    
    // Strategic Offers
    children.push(
      new Paragraph({
        text: `Strategic Offers (${month.offers.filter(o => !o.cancelled).length} Active)`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 200 }
      })
    );
    
    month.offers.filter(o => !o.cancelled).forEach(offer => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${offer.title} `,
              bold: true,
              size: 24
            }),
            new TextRun({
              text: `[${offer.type}]`,
              color: "7c3aed",
              bold: true
            })
          ],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: offer.description,
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: offer.pricing,
              bold: true,
              color: "c026d3"
            })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Mumbai: ₹${offer.priceMumbai?.toLocaleString('en-IN') || 'N/A'} → ₹${offer.finalPriceMumbai?.toLocaleString('en-IN') || 'N/A'} | `,
              size: 20
            }),
            new TextRun({
              text: `Bengaluru: ₹${offer.priceBengaluru?.toLocaleString('en-IN') || 'N/A'} → ₹${offer.finalPriceBengaluru?.toLocaleString('en-IN') || 'N/A'}`,
              size: 20
            })
          ],
          spacing: { after: 50 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Discount: ${offer.discountPercent}% | Savings: ${offer.savings} | Target: ${offer.targetUnits} units`,
              size: 20,
              color: "059669"
            })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Strategy: ${offer.whyItWorks}`,
              italics: true
            })
          ],
          spacing: { after: 100 }
        })
      );
      
      if (offer.marketingCollateral) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Marketing: ${offer.marketingCollateral}`,
                size: 18,
                color: "7c3aed"
              })
            ],
            spacing: { after: 50 }
          })
        );
      }
      
      if (offer.operationalSupport) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Operations: ${offer.operationalSupport}`,
                size: 18,
                color: "059669"
              })
            ],
            spacing: { after: 200 }
          })
        );
      }
    });
    
    // Financial Targets
    if (month.financialTargets && month.financialTargets.length > 0) {
      children.push(
        new Paragraph({
          text: "Financial Targets",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 300, after: 200 }
        })
      );
      
      month.financialTargets.forEach(target => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${target.location} - ${target.category}`,
                bold: true
              })
            ],
            spacing: { before: 150, after: 50 }
          }),
          new Paragraph({
            text: `Target: ${target.targetUnits} units | Revenue: ${target.revenueTarget}`,
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: target.logic,
                italics: true
              })
            ],
            spacing: { after: 150 }
          })
        );
      });
    }
  });
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });
  
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const filename = scope === 'current' && currentMonth 
    ? `Physique57_${currentMonth.name}_Plan_${new Date().toISOString().split('T')[0]}.docx`
    : `Physique57_2026_Sales_Plan_${new Date().toISOString().split('T')[0]}.docx`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate Image Export
export async function exportToImage(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData) {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;
  
  // Create a temporary container
  const container = document.createElement('div');
  container.style.width = '1200px';
  container.style.padding = '60px';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Inter, Arial, sans-serif';
  
  let html = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #c026d3; font-size: 48px; margin-bottom: 15px; font-weight: bold;">Physique 57 India</h1>
      <h2 style="color: #6b7280; font-size: 32px; margin-bottom: 20px;">2026 Sales Masterplan</h2>
      <p style="color: #9ca3af; font-size: 16px;">Generated: ${new Date().toLocaleDateString()}</p>
    </div>
  `;
  
  exportData.forEach(month => {
    html += `
      <div style="margin-bottom: 50px; padding: 40px; background: linear-gradient(135deg, #fdf4ff 0%, #f0abfc 100%); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <h3 style="color: #c026d3; font-size: 36px; margin-bottom: 10px; font-weight: bold;">${month.name}</h3>
        <h4 style="color: #7c3aed; font-size: 24px; margin-bottom: 20px;">${month.theme}</h4>
        <p style="color: #4b5563; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">${month.summary}</p>
        <p style="color: #059669; font-weight: bold; font-size: 22px;">💰 Revenue Target: ${month.revenueTargetTotal}</p>
        
        <div style="margin-top: 30px; padding-top: 30px; border-top: 3px solid #c026d3;">
          <h5 style="color: #374151; font-size: 24px; margin-bottom: 20px;">✨ Strategic Offers (${month.offers.filter(o => !o.cancelled).length} Active)</h5>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            ${month.offers.filter(o => !o.cancelled).map(offer => `
              <div style="padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <h6 style="color: #111827; font-size: 18px; font-weight: bold; margin: 0;">${offer.title}</h6>
                  <span style="background: #ddd6fe; color: #7c3aed; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: bold;">${offer.type}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin: 10px 0; line-height: 1.5;">${offer.description}</p>
                <p style="color: #c026d3; font-weight: bold; font-size: 16px; margin: 10px 0;">${offer.pricing}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  document.body.appendChild(container);
  
  const canvas = await html2canvas(container, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false
  });
  
  document.body.removeChild(container);
  
  // Download as PNG
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  const filename = scope === 'current' && currentMonth 
    ? `Physique57_${currentMonth.name}_Plan_${new Date().toISOString().split('T')[0]}.png`
    : `Physique57_2026_Sales_Plan_${new Date().toISOString().split('T')[0]}.png`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate Email Body HTML
export function generateEmailBody(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData): string {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Physique 57 India - 2026 Sales Masterplan</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #c026d3 0%, #7c3aed 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0;">Physique 57 India</h1>
              <h2 style="color: #fdf4ff; font-size: 20px; margin: 0;">2026 Sales Masterplan</h2>
            </td>
          </tr>
          
          <!-- Content -->
          ${exportData.map(month => `
          <tr>
            <td style="padding: 30px;">
              <h3 style="color: #c026d3; font-size: 24px; margin: 0 0 10px 0;">${month.name}: ${month.theme}</h3>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">${month.summary}</p>
              <p style="color: #059669; font-weight: bold; font-size: 16px; margin: 0 0 20px 0;">💰 Revenue Target: ${month.revenueTargetTotal}</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                ${month.offers.filter(o => !o.cancelled).map(offer => `
                <tr>
                  <td style="padding: 15px; background: #f9fafb; border-radius: 8px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                      <strong style="color: #111827; font-size: 16px;">${offer.title}</strong>
                      <span style="background: #ddd6fe; color: #7c3aed; padding: 4px 10px; border-radius: 12px; font-size: 11px;">${offer.type}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">${offer.description}</p>
                    <p style="color: #c026d3; font-weight: bold; font-size: 14px;">${offer.pricing}</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                `).join('')}
              </table>
            </td>
          </tr>
          <tr><td style="height: 1px; background: #e5e7eb;"></td></tr>
          `).join('')}
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background: #f9fafb; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">Generated: ${new Date().toLocaleDateString()}</p>
              <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">Physique 57 India - Premium Fitness Studios</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  
  return html;
}

// Copy email to clipboard
export async function copyEmailToClipboard(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData): Promise<void> {
  const emailHtml = generateEmailBody(data, scope, currentMonth);
  
  try {
    await navigator.clipboard.writeText(emailHtml);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = emailHtml;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}
