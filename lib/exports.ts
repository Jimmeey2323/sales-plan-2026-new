import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';
import { MonthData } from '../types';

// Generate PDF Export - Modern Professional Styling
export async function exportToPDF(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData) {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;
  
  // Create a temporary container for rendering
  const container = document.createElement('div');
  container.style.width = '900px';
  container.style.padding = '0';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
  
  // Build HTML content with modern professional styling
  let html = `
    <style>
      .pdf-container { background: white; }
      .cover-page {
        min-height: 400px;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        padding: 80px 60px;
        position: relative;
        overflow: hidden;
      }
      .cover-page::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%);
        border-radius: 50%;
        transform: translate(50%, -50%);
      }
      .cover-page::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200px;
        height: 200px;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
        border-radius: 50%;
        transform: translate(-50%, 50%);
      }
      .month-section {
        padding: 50px 60px;
        border-bottom: 1px solid #e2e8f0;
        page-break-after: always;
      }
      .month-header {
        display: flex;
        align-items: flex-start;
        gap: 24px;
        margin-bottom: 40px;
        padding-bottom: 30px;
        border-bottom: 2px solid #f1f5f9;
      }
      .month-badge {
        background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        text-align: center;
        min-width: 80px;
        box-shadow: 0 4px 14px -3px rgba(124, 58, 237, 0.4);
      }
      .offer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 30px;
      }
      .offer-card {
        background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      .offer-type-badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }
      .type-hero { background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); color: #7c3aed; }
      .type-new { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #2563eb; }
      .type-flash { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #d97706; }
      .type-retention { background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); color: #16a34a; }
      .type-event { background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); color: #db2777; }
      .type-lapsed { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #64748b; }
      .pricing-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 16px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
      }
      .pricing-location {
        text-align: center;
        padding: 12px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      .stats-bar {
        display: flex;
        gap: 20px;
        margin-top: 20px;
        padding: 20px;
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border-radius: 12px;
        border: 1px solid #bbf7d0;
      }
      .stat-item {
        text-align: center;
        flex: 1;
      }
    </style>
    
    <div class="pdf-container">
      <!-- Cover Page -->
      <div class="cover-page">
        <div style="position: relative; z-index: 1;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
            <div style="width: 60px; height: 60px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 32px; font-weight: bold; color: #7c3aed; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);">P</div>
            <div>
              <h1 style="color: white; font-size: 32px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Physique 57 India</h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Premium Fitness Studios</p>
            </div>
          </div>
          
          <h2 style="color: white; font-size: 52px; margin: 60px 0 20px 0; font-weight: 800; line-height: 1.1; letter-spacing: -1px;">
            2026 Sales<br/>
            <span style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Masterplan</span>
          </h2>
          
          <p style="color: #cbd5e1; font-size: 18px; max-width: 400px; line-height: 1.6; margin-bottom: 40px;">
            Strategic revenue optimization through targeted offers, seasonal campaigns, and customer lifecycle management.
          </p>
          
          <div style="display: flex; gap: 30px; margin-top: 50px;">
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: 800; color: white;">${exportData.length}</div>
              <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Months Planned</div>
            </div>
            <div style="width: 1px; background: #475569;"></div>
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: 800; color: white;">${exportData.reduce((acc, m) => acc + m.offers.filter(o => !o.cancelled).length, 0)}</div>
              <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Active Offers</div>
            </div>
            <div style="width: 1px; background: #475569;"></div>
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: 800; color: white;">3</div>
              <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Studio Locations</div>
            </div>
          </div>
          
          <div style="position: absolute; bottom: 30px; right: 60px; text-align: right;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Generated: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="color: #475569; font-size: 11px; margin: 4px 0 0 0;">Confidential Business Document</p>
          </div>
        </div>
      </div>
  `;
  
  exportData.forEach((month, index) => {
    const activeOffers = month.offers.filter(o => !o.cancelled);
    const totalRevenue = activeOffers.reduce((acc, o) => {
      const mumbaiRev = (o.finalPriceMumbai || o.priceMumbai || 0) * (typeof o.targetUnitsMumbai === 'number' ? o.targetUnitsMumbai : parseInt(o.targetUnitsMumbai as string) || 0);
      const blrRev = (o.finalPriceBengaluru || o.priceBengaluru || 0) * (typeof o.targetUnitsBengaluru === 'number' ? o.targetUnitsBengaluru : parseInt(o.targetUnitsBengaluru as string) || 0);
      return acc + mumbaiRev + blrRev;
    }, 0);
    
    html += `
      <div class="month-section">
        <div class="month-header">
          <div class="month-badge">${month.name.substring(0, 3).toUpperCase()}<br/><span style="font-size: 10px; opacity: 0.8;">2026</span></div>
          <div style="flex: 1;">
            <h3 style="color: #0f172a; font-size: 28px; margin: 0 0 8px 0; font-weight: 700;">${month.name}</h3>
            <h4 style="color: #7c3aed; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">${month.theme}</h4>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; max-width: 600px;">${month.summary}</p>
          </div>
          <div style="text-align: right; padding: 16px 24px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #bbf7d0;">
            <div style="font-size: 11px; color: #16a34a; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Revenue Target</div>
            <div style="font-size: 24px; color: #15803d; font-weight: 800; margin-top: 4px;">${month.revenueTargetTotal}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h5 style="color: #374151; font-size: 16px; margin: 0 0 20px 0; font-weight: 700; display: flex; align-items: center; gap: 10px;">
            <span style="width: 4px; height: 20px; background: linear-gradient(135deg, #7c3aed, #a855f7); border-radius: 2px;"></span>
            Strategic Offers
            <span style="background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${activeOffers.length} Active</span>
          </h5>
          
          <div class="offer-grid">
            ${activeOffers.map(offer => {
              const getTypeClass = (type: string) => {
                const typeMap: {[key: string]: string} = {
                  'Hero': 'type-hero', 'New': 'type-new', 'Flash': 'type-flash',
                  'Retention': 'type-retention', 'Event': 'type-event', 'Lapsed': 'type-lapsed'
                };
                return typeMap[type] || 'type-new';
              };
              
              return `
                <div class="offer-card">
                  <span class="offer-type-badge ${getTypeClass(offer.type)}">${offer.type}</span>
                  <h6 style="color: #0f172a; font-size: 16px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.3;">${offer.title}</h6>
                  <p style="color: #64748b; font-size: 12px; margin: 0 0 12px 0; line-height: 1.5;">${offer.description}</p>
                  
                  <div class="pricing-grid">
                    <div class="pricing-location">
                      <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Mumbai</div>
                      ${offer.priceMumbai ? `
                        <div style="font-size: 11px; color: #94a3b8; text-decoration: line-through;">₹${offer.priceMumbai.toLocaleString('en-IN')}</div>
                        <div style="font-size: 16px; color: #0f172a; font-weight: 700;">₹${(offer.finalPriceMumbai || offer.priceMumbai).toLocaleString('en-IN')}</div>
                        ${offer.targetUnitsMumbai ? `<div style="font-size: 10px; color: #7c3aed; margin-top: 4px;">${offer.targetUnitsMumbai} units target</div>` : ''}
                      ` : '<div style="color: #94a3b8; font-size: 12px;">N/A</div>'}
                    </div>
                    <div class="pricing-location">
                      <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Bengaluru</div>
                      ${offer.priceBengaluru ? `
                        <div style="font-size: 11px; color: #94a3b8; text-decoration: line-through;">₹${offer.priceBengaluru.toLocaleString('en-IN')}</div>
                        <div style="font-size: 16px; color: #0f172a; font-weight: 700;">₹${(offer.finalPriceBengaluru || offer.priceBengaluru).toLocaleString('en-IN')}</div>
                        ${offer.targetUnitsBengaluru ? `<div style="font-size: 10px; color: #7c3aed; margin-top: 4px;">${offer.targetUnitsBengaluru} units target</div>` : ''}
                      ` : '<div style="color: #94a3b8; font-size: 12px;">N/A</div>'}
                    </div>
                  </div>
                  
                  <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0;">
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                      ${offer.discountPercent ? `<span style="background: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 600;">${offer.discountPercent}% OFF</span>` : ''}
                      ${offer.promoteOnAds ? `<span style="background: #dbeafe; color: #2563eb; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 600;">📢 Ads</span>` : ''}
                    </div>
                  </div>
                  
                  <p style="color: #64748b; font-size: 11px; font-style: italic; margin: 12px 0 0 0; line-height: 1.4; padding: 10px; background: #f8fafc; border-radius: 8px;">
                    💡 ${offer.whyItWorks}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        ${month.financialTargets && month.financialTargets.length > 0 ? `
          <div style="margin-top: 30px;">
            <h5 style="color: #374151; font-size: 16px; margin: 0 0 20px 0; font-weight: 700; display: flex; align-items: center; gap: 10px;">
              <span style="width: 4px; height: 20px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 2px;"></span>
              Studio Targets
            </h5>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
              ${month.financialTargets.map(target => `
                <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #bbf7d0; text-align: center;">
                  <div style="font-size: 11px; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 8px;">${target.location}</div>
                  <div style="font-size: 24px; color: #15803d; font-weight: 800;">${target.revenueTarget}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 6px;">${target.logic}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  });
  
  html += `</div>`;
  
  container.innerHTML = html;
  document.body.appendChild(container);
  
  // Convert to canvas
  const canvas = await html2canvas(container, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true
  });
  
  document.body.removeChild(container);
  
  // Create PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  
  const imgData = canvas.toDataURL('image/png');
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  const filename = scope === 'current' && currentMonth 
    ? `Physique57_${currentMonth.name}_Plan_${new Date().toISOString().split('T')[0]}.pdf`
    : `Physique57_2026_Sales_Plan_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(filename);
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
