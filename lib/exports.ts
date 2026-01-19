import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';
import { MonthData } from '../types';

// Professional, modern PDF Export with beautiful styling and complete offer details
export async function exportToPDF(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData) {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const borderMargin = 8;
  
  // Modern color palette - white bg, dark text, blue accents
  const colors = {
    primary: [25, 48, 92] as const,        // Dark Navy Blue for headers
    accent: [41, 98, 255] as const,        // Bright Blue for accents
    accentLight: [219, 234, 254] as const, // Light Blue background
    text: [31, 41, 55] as const,           // Dark Gray/Black text
    textMuted: [75, 85, 99] as const,      // Medium Gray text  
    textLight: [107, 114, 128] as const,   // Light Gray text
    border: [41, 98, 255] as const,        // Blue borders
    borderLight: [226, 232, 240] as const, // Light Gray borders
    success: [16, 163, 127] as const,      // Green
    successLight: [220, 252, 231] as const,
    warning: [245, 158, 11] as const,      // Orange
    warningLight: [254, 243, 199] as const,
    white: [255, 255, 255] as const,
    bg: [249, 250, 251] as const,          // Very light gray
    hero: [15, 23, 42] as const,           // Dark slate for hero
  };


  const setTextColor = (c: readonly [number, number, number]) => pdf.setTextColor(c[0], c[1], c[2]);
  const setDrawColor = (c: readonly [number, number, number]) => pdf.setDrawColor(c[0], c[1], c[2]);
  const setFillColor = (c: readonly [number, number, number]) => pdf.setFillColor(c[0], c[1], c[2]);

  // Draw page border
  const drawPageBorder = () => {
    setDrawColor(colors.border);
    pdf.setLineWidth(1);
    pdf.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2);
  };

  // Add page number
  let pageNumber = 1;
  const addPageNumber = () => {
    setTextColor(colors.textMuted);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    pageNumber++;
  };

  const toNumberUnits = (v: unknown): number => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    if (typeof v === 'string') {
      const n = parseInt(v.replace(/[^0-9-]/g, ''), 10);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const formatINRCompact = (value: number): string => {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    const fmt = (n: number) => {
      const rounded = Math.round(n * 10) / 10;
      return rounded % 1 === 0 ? String(Math.round(rounded)) : String(rounded);
    };
    if (abs >= 1e7) return `${sign}₹${fmt(abs / 1e7)} Cr`;
    if (abs >= 1e5) return `${sign}₹${fmt(abs / 1e5)} L`;
    if (abs >= 1e3) return `${sign}₹${fmt(abs / 1e3)} K`;
    return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
  };

  const parseINRCompact = (input?: string): number | null => {
    if (!input) return null;
    const raw = input.replace(/,/g, '').trim();
    const m = raw.match(/(-?[0-9]*\.?[0-9]+)\s*(cr|crore|l|lac|lakh|k|thousand)?/i);
    if (!m) return null;
    const num = parseFloat(m[1]);
    if (!Number.isFinite(num)) return null;
    const unit = (m[2] || '').toLowerCase();
    const mult = unit === 'cr' || unit === 'crore' ? 1e7 : unit === 'l' || unit === 'lac' || unit === 'lakh' ? 1e5 : unit === 'k' || unit === 'thousand' ? 1e3 : 1;
    return num * mult;
  };

  const safeText = (text: string | undefined | null) => (text || '').toString().trim();

  // Calculate stats
  const totalOffers = exportData.reduce((acc, m) => acc + m.offers.length, 0);
  const totalActiveOffers = exportData.reduce((acc, m) => acc + m.offers.filter(o => !o.cancelled).length, 0);

  // ================== COVER PAGE ==================
  setFillColor(colors.white);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Draw border
  drawPageBorder();

  // Top accent bar
  setFillColor(colors.primary);
  pdf.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, 8, 'F');

  // Hero section with dark background for image placeholder
  let y = borderMargin + 20;
  setFillColor(colors.hero);
  pdf.roundedRect(margin, y, contentWidth, 85, 2, 2, 'F');
  
  // Center text on hero section
  setTextColor(colors.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('PHYSIQUE 57 INDIA', pageWidth / 2, y + 25, { align: 'center' });
  
  pdf.setFontSize(32);
  pdf.text('2026 SALES MASTERPLAN', pageWidth / 2, y + 42, { align: 'center' });
  
  setTextColor([200, 200, 200] as const);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text('Strategic Planning & Revenue Growth', pageWidth / 2, y + 55, { align: 'center' });
  
  pdf.setFontSize(9);
  pdf.text('Premium Fitness Studios — Bengaluru & Mumbai', pageWidth / 2, y + 75, { align: 'center' });

  // Quick stats section
  y += 95;
  const statsY = y;
  const statBoxWidth = contentWidth / 3 - 3;
  
  // Stat 1: Total Offers
  let statX = margin;
  setFillColor(colors.accentLight);
  pdf.roundedRect(statX, y, statBoxWidth, 24, 2, 2, 'F');
  setTextColor(colors.primary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text(String(totalOffers), statX + statBoxWidth / 2, y + 12, { align: 'center' });
  setTextColor(colors.textMuted);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Total Offers', statX + statBoxWidth / 2, y + 20, { align: 'center' });
  
  // Stat 2: Active Offers
  statX += statBoxWidth + 4.5;
  setFillColor(colors.successLight);
  pdf.roundedRect(statX, y, statBoxWidth, 24, 2, 2, 'F');
  setTextColor(colors.success);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text(String(totalActiveOffers), statX + statBoxWidth / 2, y + 12, { align: 'center' });
  setTextColor(colors.textMuted);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Active Offers', statX + statBoxWidth / 2, y + 20, { align: 'center' });
  
  // Stat 3: Months
  statX += statBoxWidth + 4.5;
  setFillColor(colors.warningLight);
  pdf.roundedRect(statX, y, statBoxWidth, 24, 2, 2, 'F');
  setTextColor(colors.warning);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text(String(exportData.length), statX + statBoxWidth / 2, y + 12, { align: 'center' });
  setTextColor(colors.textMuted);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Months Planned', statX + statBoxWidth / 2, y + 20, { align: 'center' });

  // Document info section
  y += 32;
  setDrawColor(colors.borderLight);
  pdf.setLineWidth(0.3);
  pdf.line(margin, y, pageWidth - margin, y);
  
  y += 10;
  setTextColor(colors.text);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('DOCUMENT INFORMATION', margin, y);
  
  y += 8;
  setTextColor(colors.textMuted);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  const infoItems = [
    `Report Scope: ${scope === 'all' ? 'Complete Year Overview' : `${currentMonth?.name || 'Current Month'} Details`}`,
    `Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    `Total Revenue Targets: Multi-location strategy`,
    `Document Status: Confidential - Internal Use Only`
  ];
  
  infoItems.forEach((item, idx) => {
    pdf.text(`• ${item}`, margin + 3, y + (idx * 6));
  });

  // Footer accent
  y = pageHeight - 25;
  setDrawColor(colors.border);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  
  setTextColor(colors.textLight);
  pdf.setFontSize(8);
  pdf.text('Physique 57 India', pageWidth / 2, y + 8, { align: 'center' });
  pdf.text('Premium Boutique Fitness Studios', pageWidth / 2, y + 12, { align: 'center' });
  
  addPageNumber();


  // ================== MONTH PAGES ==================
  exportData.forEach((month, monthIndex) => {
    pdf.addPage();
    setFillColor(colors.white);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    drawPageBorder();

    // Top accent bar
    setFillColor(colors.primary);
    pdf.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, 5, 'F');

    let y = borderMargin + 16;

    // Month header
    setFillColor(colors.primary);
    pdf.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
    
    setTextColor(colors.white);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(`MONTH ${monthIndex + 1} OF ${exportData.length}`, margin + 4, y + 6);
    
    pdf.setFontSize(16);
    pdf.text(month.name.toUpperCase(), margin + 4, y + 16);

    // Theme
    y += 26;
    setTextColor(colors.accent);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    const themeLines = pdf.splitTextToSize(month.theme, contentWidth);
    pdf.text(themeLines, margin, y);
    y += themeLines.length * 5 + 2;

    // Summary
    setTextColor(colors.text);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const summaryLines = pdf.splitTextToSize(safeText(month.summary), contentWidth);
    pdf.text(summaryLines.slice(0, 3), margin, y);
    y += Math.min(3, summaryLines.length) * 4 + 4;

    // Stats bar
    const activeOffers = month.offers.filter(o => !o.cancelled).length;
    const cancelledOffers = month.offers.filter(o => o.cancelled).length;
    const parsedTarget = parseINRCompact(safeText(month.revenueTargetTotal).replace(/[₹]/g, ''));
    const targetDisplay = parsedTarget != null ? formatINRCompact(parsedTarget) : month.revenueTargetTotal;

    setFillColor(colors.bg);
    pdf.roundedRect(margin, y, contentWidth, 10, 1, 1, 'F');
    
    setTextColor(colors.text);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(`✓ ${activeOffers} Active`, margin + 3, y + 6);
    pdf.text(`✕ ${cancelledOffers} Cancelled`, margin + 40, y + 6);
    
    setTextColor(colors.success);
    pdf.text(`Target: ${targetDisplay}`, margin + 85, y + 6);

    y += 14;

    // Section divider
    setDrawColor(colors.border);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    
    y += 6;
    setTextColor(colors.primary);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('OFFER DETAILS', margin, y);
    
    y += 7;

    const ensureSpace = (space: number) => {
      if (y + space > pageHeight - 22) {
        addPageNumber();
        pdf.addPage();
        setFillColor(colors.white);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        drawPageBorder();
        setFillColor(colors.primary);
        pdf.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, 5, 'F');
        y = borderMargin + 16;
        setTextColor(colors.textMuted);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text(`${month.name} — Continued`, margin, y);
        y += 8;
      }
    };

    const activeOffersList = month.offers.filter(o => !o.cancelled);
    
    activeOffersList.forEach((offer, idx) => {
      const offerHeight = 58; // Increased height for location details
      ensureSpace(offerHeight);
      
      // Offer container
      setFillColor(colors.bg);
      pdf.roundedRect(margin, y, contentWidth, offerHeight, 2, 2, 'F');
      
      // Type badge
      const getTypeBgColor = (type: string) => {
        switch(type) {
          case 'Hero': return colors.primary;
          case 'New': return colors.accent;
          case 'Retention': return colors.success;
          default: return colors.textMuted;
        }
      };
      
      setFillColor(getTypeBgColor(offer.type));
      pdf.roundedRect(margin + 2, y + 2, 22, 6, 1, 1, 'F');
      setTextColor(colors.white);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6);
      pdf.text(offer.type.toUpperCase(), margin + 13, y + 5.5, { align: 'center' });
      
      // Offer number badge
      setDrawColor(colors.accent);
      pdf.setLineWidth(0.3);
      pdf.circle(pageWidth - margin - 6, y + 5, 4, 'D');
      setTextColor(colors.accent);
      pdf.setFontSize(7);
      pdf.text(String(idx + 1), pageWidth - margin - 6, y + 6.5, { align: 'center' });
      
      // Title
      setTextColor(colors.text);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      const titleLines = pdf.splitTextToSize(offer.title, contentWidth - 10);
      pdf.text(titleLines.slice(0, 1), margin + 2, y + 12);
      
      // Description
      setTextColor(colors.textMuted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      const descLines = pdf.splitTextToSize(offer.description, contentWidth - 8);
      pdf.text(descLines.slice(0, 2), margin + 2, y + 18);
      
      // Pricing headline
      setTextColor(colors.accent);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(offer.pricing, margin + 2, y + 28);
      
      // Divider
      setDrawColor(colors.borderLight);
      pdf.setLineWidth(0.2);
      pdf.line(margin + 2, y + 32, pageWidth - margin - 2, y + 32);
      
      // LOCATION DETAILS - BENGALURU
      y += 34;
      setFillColor(colors.accentLight);
      pdf.roundedRect(margin + 2, y, (contentWidth - 6) / 2, 20, 1, 1, 'F');
      
      setTextColor(colors.primary);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text('📍 BENGALURU', margin + 4, y + 4);
      
      setTextColor(colors.text);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      const bengaluruOriginal = offer.priceBengaluru ? `₹${offer.priceBengaluru.toLocaleString('en-IN')}` : 'N/A';
      const bengaluruFinal = offer.finalPriceBengaluru ? `₹${offer.finalPriceBengaluru.toLocaleString('en-IN')}` : 'N/A';
      pdf.text(`Price: ${bengaluruOriginal}`, margin + 4, y + 9);
      
      setTextColor(colors.success);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Final: ${bengaluruFinal}`, margin + 4, y + 13);
      
      setTextColor(colors.textMuted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.text(`Discount: ${offer.discountPercent}%`, margin + 4, y + 17);
      
      // LOCATION DETAILS - MUMBAI
      const mumbaiX = margin + 4 + (contentWidth - 6) / 2;
      setFillColor(colors.successLight);
      pdf.roundedRect(mumbaiX, y - 34, (contentWidth - 6) / 2, 20, 1, 1, 'F');
      
      setTextColor(colors.primary);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text('📍 MUMBAI', mumbaiX + 2, y - 30);
      
      setTextColor(colors.text);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      const mumbaiOriginal = offer.priceMumbai ? `₹${offer.priceMumbai.toLocaleString('en-IN')}` : 'N/A';
      const mumbaiFinal = offer.finalPriceMumbai ? `₹${offer.finalPriceMumbai.toLocaleString('en-IN')}` : 'N/A';
      pdf.text(`Price: ${mumbaiOriginal}`, mumbaiX + 2, y - 25);
      
      setTextColor(colors.success);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Final: ${mumbaiFinal}`, mumbaiX + 2, y - 21);
      
      setTextColor(colors.textMuted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.text(`Savings: ${offer.savings || 'N/A'}`, mumbaiX + 2, y - 17);
      
      // Additional details on same line as Bengaluru
      setTextColor(colors.warning);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Units: ${offer.targetUnits || 'N/A'}`, mumbaiX + 2, y + 17);
      
      y += 24;
    });

    // ---- FINANCIAL TARGETS SECTION ----
    if (month.financialTargets && month.financialTargets.length > 0) {
      ensureSpace(30);
      
      y += 4;
      setDrawColor(colors.border);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      
      y += 6;
      setTextColor(colors.primary);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('FINANCIAL TARGETS', margin, y);
      
      y += 7;

      month.financialTargets.forEach((target, idx) => {
        ensureSpace(18);
        
        setFillColor(colors.accentLight);
        pdf.roundedRect(margin, y, contentWidth, 16, 1, 1, 'F');
        
        setTextColor(colors.primary);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.text(`📍 ${target.location}`, margin + 2, y + 5);
        
        setTextColor(colors.text);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(target.category || '', margin + 40, y + 5);
        
        setTextColor(colors.text);
        pdf.setFontSize(7);
        pdf.text(`${target.targetUnits} units`, margin + 2, y + 10);
        
        setTextColor(colors.success);
        pdf.setFont('helvetica', 'bold');
        pdf.text(target.revenueTarget, margin + 25, y + 10);
        
        setTextColor(colors.textMuted);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        const logicLines = pdf.splitTextToSize(target.logic, contentWidth - 6);
        pdf.text(logicLines.slice(0, 1), margin + 2, y + 14);
        
        y += 18;
      });
    }

    // Page footer
    setTextColor(colors.textLight);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text(`${month.name} — 2026 Sales Plan`, margin, pageHeight - 10);
    setTextColor(colors.accent);
    pdf.text('Physique 57 India', pageWidth - margin, pageHeight - 10, { align: 'right' });
    
    addPageNumber();
  });

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

// Generate professional email HTML body
export function generateEmailBody(data: MonthData[], scope: 'current' | 'all', currentMonth?: MonthData): string {
  const exportData = scope === 'current' && currentMonth ? [currentMonth] : data;
  const totalActiveOffers = exportData.reduce((sum, m) => sum + m.offers.filter(o => !o.cancelled).length, 0);
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Physique 57 India - 2026 Sales Masterplan</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="640" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333EA 0%, #7C3AED 50%, #C026D3 100%); padding: 48px 40px; text-align: center;">
              <p style="color: rgba(255,255,255,0.8); font-size: 12px; letter-spacing: 2px; margin: 0 0 8px 0; text-transform: uppercase;">Physique 57 India</p>
              <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 8px 0; font-weight: 700;">2026 Sales Masterplan</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">${scope === 'all' ? 'Complete Annual Overview' : `${currentMonth?.name} Overview`}</p>
            </td>
          </tr>
          
          <!-- Stats Bar -->
          <tr>
            <td style="padding: 24px 40px; background: #faf5ff; border-bottom: 1px solid #e9d5ff;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 0 10px;">
                    <p style="color: #9333EA; font-size: 28px; font-weight: 700; margin: 0;">${exportData.length}</p>
                    <p style="color: #7c3aed; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Months</p>
                  </td>
                  <td style="text-align: center; padding: 0 10px; border-left: 1px solid #e9d5ff;">
                    <p style="color: #10B981; font-size: 28px; font-weight: 700; margin: 0;">${totalActiveOffers}</p>
                    <p style="color: #059669; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Active Offers</p>
                  </td>
                  <td style="text-align: center; padding: 0 10px; border-left: 1px solid #e9d5ff;">
                    <p style="color: #C026D3; font-size: 28px; font-weight: 700; margin: 0;">${new Date().getFullYear()}</p>
                    <p style="color: #a21caf; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Plan Year</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          ${exportData.map((month, idx) => `
          <tr>
            <td style="padding: ${idx === 0 ? '32px' : '0'} 40px 32px 40px;">
              ${idx > 0 ? '<div style="height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); margin-bottom: 32px;"></div>' : ''}
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="color: #9333EA; font-size: 11px; font-weight: 700; letter-spacing: 2px; margin: 0 0 8px 0; text-transform: uppercase;">Month ${idx + 1}</p>
                    <h2 style="color: #111827; font-size: 24px; margin: 0 0 4px 0; font-weight: 700;">${month.name}</h2>
                    <p style="color: #9333EA; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">${month.theme}</p>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">${month.summary}</p>
                    
                    <table cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background: #dcfce7; color: #059669; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                          💰 Target: ${month.revenueTargetTotal}
                        </td>
                        <td width="12"></td>
                        <td style="background: #faf5ff; color: #9333EA; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                          📦 ${month.offers.filter(o => !o.cancelled).length} Offers
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Offers Grid -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${month.offers.filter(o => !o.cancelled).map((offer, oIdx) => `
                <tr>
                  <td style="padding: 16px; background: #f9fafb; border-radius: 12px; margin-bottom: 12px; ${oIdx < month.offers.filter(o => !o.cancelled).length - 1 ? 'border-bottom: 8px solid white;' : ''}">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="display: inline-block; background: ${offer.type === 'Hero' ? '#f3e8ff' : offer.type === 'New' ? '#dbeafe' : offer.type === 'Retention' ? '#dcfce7' : '#f3f4f6'}; color: ${offer.type === 'Hero' ? '#9333ea' : offer.type === 'New' ? '#3b82f6' : offer.type === 'Retention' ? '#10b981' : '#6b7280'}; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${offer.type}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0 0 6px 0;">${offer.title}</p>
                          <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">${offer.description}</p>
                          <p style="color: #C026D3; font-size: 14px; font-weight: 700; margin: 0;">${offer.pricing}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>
          `).join('')}
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">Generated on ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="color: #6b7280; font-size: 14px; font-weight: 600; margin: 0;">Physique 57 India — Premium Fitness Studios</p>
              <p style="color: #9ca3af; font-size: 11px; margin: 12px 0 0 0;">This is a confidential document intended for internal use only.</p>
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
    const textArea = document.createElement('textarea');
    textArea.value = emailHtml;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

// Generate notes email HTML
export function generateNotesEmailBody(notes: Array<{ content: string; userName: string; createdAt: string }>, monthName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #9333EA 0%, #C026D3 100%); padding: 40px; text-align: center;">
              <p style="color: rgba(255,255,255,0.8); font-size: 11px; letter-spacing: 2px; margin: 0 0 8px 0; text-transform: uppercase;">Physique 57 India</p>
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">📝 ${monthName} Notes</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 32px 40px;">
              ${notes.map((note, idx) => `
              <div style="padding: 20px; background: #faf5ff; border-radius: 12px; border-left: 4px solid #9333EA; ${idx < notes.length - 1 ? 'margin-bottom: 16px;' : ''}">
                <p style="color: #111827; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">${note.content}</p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  <strong style="color: #9333EA;">${note.userName}</strong> • ${new Date(note.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              `).join('')}
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 40px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Physique 57 India — 2026 Sales Masterplan</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
