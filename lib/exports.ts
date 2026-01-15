import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';
import { MonthData } from '../types';

// Generate PDF Export - Ultra Modern Minimalist Professional Styling
export async function exportToPDF(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData) {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;
  
  // Create a temporary container for rendering
  const container = document.createElement('div');
  container.style.width = '900px';
  container.style.padding = '0';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";
  
  // Build HTML content with ultra-modern minimalist styling
  let html = `
    <style>
      * { box-sizing: border-box; }
      .pdf-container { background: white; }
      
      /* Cover Page - Editorial Minimalist */
      .cover-page {
        min-height: 500px;
        background: #0a0a0a;
        padding: 80px;
        position: relative;
        overflow: hidden;
      }
      .cover-page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #d4af37, #c9a227, #b8860b);
      }
      .cover-accent {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
      }
      
      /* Month Sections - Clean & Sophisticated */
      .month-section {
        padding: 60px 70px;
        background: #ffffff;
        page-break-after: always;
        position: relative;
      }
      .month-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 70px;
        right: 70px;
        height: 1px;
        background: linear-gradient(90deg, transparent, #e5e5e5, transparent);
      }
      
      /* Month Header - Elegant Typography */
      .month-header {
        display: flex;
        align-items: flex-start;
        gap: 40px;
        margin-bottom: 50px;
        padding-bottom: 40px;
        border-bottom: 1px solid #f0f0f0;
      }
      .month-indicator {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }
      .month-indicator .month-abbr {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .month-indicator .year {
        font-size: 11px;
        opacity: 0.6;
        margin-top: 2px;
      }
      
      /* Offer Grid - Card System */
      .offer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-top: 40px;
      }
      .offer-card {
        background: #fafafa;
        border: 1px solid #ebebeb;
        border-radius: 16px;
        padding: 28px;
        transition: all 0.3s ease;
      }
      .offer-card:hover {
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      }
      
      /* Type Badges - Refined */
      .offer-type-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 100px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 16px;
      }
      .type-hero { background: linear-gradient(135deg, #1a1a1a, #333); color: #d4af37; }
      .type-new { background: #e8f4f8; color: #0891b2; }
      .type-flash { background: #fef3c7; color: #b45309; }
      .type-retention { background: #ecfdf5; color: #059669; }
      .type-event { background: #fdf2f8; color: #be185d; }
      .type-lapsed { background: #f5f5f5; color: #525252; }
      
      /* Pricing Display - Clean */
      .pricing-row {
        display: flex;
        gap: 16px;
        margin-top: 20px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        border: 1px solid #f0f0f0;
      }
      .location-price {
        flex: 1;
        text-align: center;
        padding: 12px;
      }
      .location-price:first-child {
        border-right: 1px solid #f0f0f0;
      }
      .location-label {
        font-size: 10px;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }
      .original-price {
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
      }
      .final-price {
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
        margin-top: 4px;
      }
      .target-units {
        font-size: 11px;
        color: #d4af37;
        margin-top: 6px;
        font-weight: 500;
      }
      
      /* Revenue Block */
      .revenue-block {
        text-align: right;
        padding: 24px 32px;
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        border-radius: 16px;
        border: 1px solid #e8e8e8;
      }
      .revenue-label {
        font-size: 11px;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 500;
      }
      .revenue-value {
        font-size: 32px;
        font-weight: 800;
        color: #1a1a1a;
        margin-top: 8px;
        letter-spacing: -1px;
      }
      
      /* Section Headers */
      .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
      }
      .section-line {
        width: 24px;
        height: 2px;
        background: linear-gradient(90deg, #d4af37, #b8860b);
        border-radius: 1px;
      }
      .section-title {
        font-size: 14px;
        font-weight: 700;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      .section-count {
        background: #f5f5f5;
        color: #666;
        padding: 4px 12px;
        border-radius: 100px;
        font-size: 11px;
        font-weight: 600;
      }
      
      /* Studio Targets Grid */
      .targets-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 30px;
      }
      .target-card {
        padding: 24px;
        background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        border-radius: 14px;
        text-align: center;
        border: 1px solid #ebebeb;
      }
      .target-location {
        font-size: 11px;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 600;
        margin-bottom: 12px;
      }
      .target-amount {
        font-size: 26px;
        font-weight: 800;
        color: #1a1a1a;
        letter-spacing: -0.5px;
      }
      .target-logic {
        font-size: 11px;
        color: #888;
        margin-top: 8px;
        line-height: 1.4;
      }
      
      /* Insight Box */
      .insight-box {
        margin-top: 16px;
        padding: 16px;
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-radius: 10px;
        border-left: 3px solid #d4af37;
      }
      .insight-text {
        color: #78716c;
        font-size: 12px;
        font-style: italic;
        line-height: 1.6;
      }
      
      /* Discount Badge */
      .discount-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #b45309;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 700;
        margin-right: 8px;
      }
      .ads-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: #e0f2fe;
        color: #0369a1;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 600;
      }
    </style>
    
    <div class="pdf-container">
      <!-- Cover Page - Editorial Minimalist -->
      <div class="cover-page">
        <div class="cover-accent"></div>
        <div style="position: relative; z-index: 1;">
          
          <!-- Logo & Brand -->
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 80px;">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #d4af37, #b8860b); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #0a0a0a; font-size: 28px; font-weight: 800;">57</span>
            </div>
            <div>
              <h1 style="color: white; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 1px;">Physique 57</h1>
              <p style="color: #666; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 4px; font-weight: 500;">India</p>
            </div>
          </div>
          
          <!-- Main Title -->
          <div style="margin-bottom: 60px;">
            <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 4px; margin: 0 0 16px 0; font-weight: 600;">Strategic Planning Document</p>
            <h2 style="color: white; font-size: 56px; margin: 0; font-weight: 800; line-height: 1.1; letter-spacing: -2px;">
              2026 Sales<br/>Masterplan
            </h2>
          </div>
          
          <!-- Description -->
          <p style="color: #888; font-size: 16px; max-width: 450px; line-height: 1.8; margin-bottom: 60px;">
            A comprehensive revenue strategy encompassing targeted offers, seasonal campaigns, and customer lifecycle optimization across all studio locations.
          </p>
          
          <!-- Stats -->
          <div style="display: flex; gap: 60px; padding-top: 40px; border-top: 1px solid #222;">
            <div>
              <div style="font-size: 48px; font-weight: 800; color: white; letter-spacing: -2px;">${exportData.length}</div>
              <div style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Months</div>
            </div>
            <div>
              <div style="font-size: 48px; font-weight: 800; color: white; letter-spacing: -2px;">${exportData.reduce((acc, m) => acc + m.offers.filter(o => !o.cancelled).length, 0)}</div>
              <div style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Active Offers</div>
            </div>
            <div>
              <div style="font-size: 48px; font-weight: 800; color: white; letter-spacing: -2px;">3</div>
              <div style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Studios</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="position: absolute; bottom: 60px; right: 80px; text-align: right;">
            <p style="color: #444; font-size: 11px; margin: 0; letter-spacing: 1px;">${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="color: #333; font-size: 10px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Confidential</p>
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
        <!-- Month Header -->
        <div class="month-header">
          <div class="month-indicator">
            <span class="month-abbr">${month.name.substring(0, 3)}</span>
            <span class="year">2026</span>
          </div>
          <div style="flex: 1;">
            <h3 style="color: #1a1a1a; font-size: 32px; margin: 0 0 8px 0; font-weight: 800; letter-spacing: -1px;">${month.name}</h3>
            <h4 style="color: #d4af37; font-size: 16px; margin: 0 0 16px 0; font-weight: 600; letter-spacing: 0.5px;">${month.theme}</h4>
            <p style="color: #666; font-size: 14px; line-height: 1.7; margin: 0; max-width: 500px;">${month.summary}</p>
          </div>
          <div class="revenue-block">
            <div class="revenue-label">Revenue Target</div>
            <div class="revenue-value">${month.revenueTargetTotal}</div>
          </div>
        </div>
        
        <!-- Strategic Offers -->
        <div style="margin-bottom: 50px;">
          <div class="section-header">
            <div class="section-line"></div>
            <span class="section-title">Strategic Offers</span>
            <span class="section-count">${activeOffers.length} Active</span>
          </div>
          
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
                  <h6 style="color: #1a1a1a; font-size: 17px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.4;">${offer.title}</h6>
                  <p style="color: #666; font-size: 13px; margin: 0; line-height: 1.6;">${offer.description}</p>
                  
                  <div class="pricing-row">
                    <div class="location-price">
                      <div class="location-label">Mumbai</div>
                      ${offer.priceMumbai ? `
                        <div class="original-price">₹${offer.priceMumbai.toLocaleString('en-IN')}</div>
                        <div class="final-price">₹${(offer.finalPriceMumbai || offer.priceMumbai).toLocaleString('en-IN')}</div>
                        ${offer.targetUnitsMumbai ? `<div class="target-units">${offer.targetUnitsMumbai} units</div>` : ''}
                      ` : '<div style="color: #ccc; font-size: 13px;">—</div>'}
                    </div>
                    <div class="location-price">
                      <div class="location-label">Bengaluru</div>
                      ${offer.priceBengaluru ? `
                        <div class="original-price">₹${offer.priceBengaluru.toLocaleString('en-IN')}</div>
                        <div class="final-price">₹${(offer.finalPriceBengaluru || offer.priceBengaluru).toLocaleString('en-IN')}</div>
                        ${offer.targetUnitsBengaluru ? `<div class="target-units">${offer.targetUnitsBengaluru} units</div>` : ''}
                      ` : '<div style="color: #ccc; font-size: 13px;">—</div>'}
                    </div>
                  </div>
                  
                  <div style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px;">
                    ${offer.discountPercent ? `<span class="discount-badge">${offer.discountPercent}% OFF</span>` : ''}
                    ${offer.promoteOnAds ? `<span class="ads-badge">📢 Ads Active</span>` : ''}
                  </div>
                  
                  <div class="insight-box">
                    <p class="insight-text">💡 ${offer.whyItWorks}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        ${month.financialTargets && month.financialTargets.length > 0 ? `
          <div>
            <div class="section-header">
              <div class="section-line"></div>
              <span class="section-title">Studio Targets</span>
            </div>
            <div class="targets-grid">
              ${month.financialTargets.map(target => `
                <div class="target-card">
                  <div class="target-location">${target.location}</div>
                  <div class="target-amount">${target.revenueTarget}</div>
                  <div class="target-logic">${target.logic}</div>
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
