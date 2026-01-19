import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, FileText, Settings, Eye } from 'lucide-react';

interface PDFExporterProps {
  targetElementId: string;
  filename?: string;
  title?: string;
}

export const PDFExporter: React.FC<PDFExporterProps> = ({ 
  targetElementId, 
  filename = 'sales-plan-2026', 
  title = 'Export PDF' 
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [scale, setScale] = useState<number>(2);
  const [marginMM, setMarginMM] = useState<number>(10);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  const [imageQuality, setImageQuality] = useState<number>(0.95);
  const [compressImages, setCompressImages] = useState(true);

  const generatePDF = async (element: HTMLElement) => {
    // Scroll element into view and ensure it's visible
    element.scrollIntoView({ behavior: 'auto', block: 'start' });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force visibility and save original styles
    const originalStyles = {
      position: element.style.position,
      visibility: element.style.visibility,
      opacity: element.style.opacity,
      display: element.style.display,
      transform: element.style.transform
    };
    
    element.style.position = 'relative';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.display = 'block';
    element.style.transform = 'none';
    
    // Force reflow
    void element.offsetHeight;
    
    // Wait for fonts, images, and animations
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturing element:', {
      id: element.id,
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight
    });

    // Ensure element is visible
    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      console.error('Element dimensions:', {
        computed: window.getComputedStyle(element).display,
        visibility: window.getComputedStyle(element).visibility,
        opacity: window.getComputedStyle(element).opacity
      });
      // Restore original styles
      Object.assign(element.style, originalStyles);
      throw new Error('Element has zero dimensions - it may be hidden. Please ensure the yearly view is visible.');
    }

    try {
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(targetElementId);
          if (clonedElement) {
            // Remove print-hidden elements
            clonedElement.querySelectorAll('[class*="print:hidden"], .print\\:hidden').forEach(el => el.remove());
            // Ensure visibility in clone
            clonedElement.style.position = 'relative';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.display = 'block';
          }
        }
      });

      console.log('Canvas created:', { width: canvas.width, height: canvas.height });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions - capture failed');
      }

      const imgData = canvas.toDataURL('image/jpeg', imageQuality);
      
      if (!imgData || imgData === 'data:,' || imgData.length < 100) {
        throw new Error('Failed to create image data from canvas');
      }

      console.log('Image data created, length:', imgData.length);

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - (marginMM * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = marginMM;

      pdf.addImage(imgData, 'JPEG', marginMM, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - marginMM * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + marginMM;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', marginMM, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - marginMM * 2);
      }

      console.log('PDF generated successfully');
      return pdf;
    } finally {
      // Restore original styles
      Object.assign(element.style, originalStyles);
    }
  };

  const exportToPDF = async (preview = false) => {
    const element = document.getElementById(targetElementId);
    if (!element) {
      alert('Content not found. Please refresh and try again.');
      return;
    }

    if (element.offsetHeight === 0 || element.offsetWidth === 0) {
      alert('Content is not visible. Please try again.');
      return;
    }

    setShowOptions(false);

    try {
      const pdf = await generatePDF(element);
      
      if (preview) {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        pdf.save(`${filename}.pdf`);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        data-pdf-exporter={targetElementId}
        onClick={() => exportToPDF(false)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm print:hidden"
      >
        <Download className="w-4 h-4" />
        {title}
      </button>

      <button
        onClick={() => setShowOptions(s => !s)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors print:hidden"
        title="Preview & Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {showOptions && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowOptions(false)} />
          <div className="absolute z-50 right-0 top-12 bg-white border rounded-lg shadow-xl p-5 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Export Settings</h3>
              <button onClick={() => setShowOptions(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Page Size</label>
                  <select value={pageSize} onChange={e => setPageSize(e.target.value as any)} className="w-full p-2 border rounded text-sm">
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Orientation</label>
                  <select value={orientation} onChange={e => setOrientation(e.target.value as any)} className="w-full p-2 border rounded text-sm">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Render Quality: {scale.toFixed(1)}x</label>
                <input type="range" min={1} max={3} step={0.1} value={scale} onChange={e => setScale(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Faster</span>
                  <span>Higher Quality</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Image Quality: {(imageQuality * 100).toFixed(0)}%</label>
                <input type="range" min={0.5} max={1} step={0.05} value={imageQuality} onChange={e => setImageQuality(Number(e.target.value))} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Margin (mm)</label>
                  <input type="number" min={0} max={30} value={marginMM} onChange={e => setMarginMM(Number(e.target.value))} className="w-full p-2 border rounded text-sm" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={compressImages} onChange={e => setCompressImages(e.target.checked)} className="rounded" />
                    Compress
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button onClick={() => exportToPDF(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  <Eye className="w-4 h-4" />Preview
                </button>
                <button onClick={() => exportToPDF(false)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  <Download className="w-4 h-4" />Export
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Advanced PDF Exporter with enhanced quality
export const AdvancedPDFExporter: React.FC<PDFExporterProps> = ({ 
  targetElementId, 
  filename = 'sales-masterplan-2026', 
  title = 'Advanced PDF' 
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [scale, setScale] = useState<number>(2.5);
  const [marginMM, setMarginMM] = useState<number>(8);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  const [imageQuality, setImageQuality] = useState<number>(0.98);
  const [removeBackgrounds, setRemoveBackgrounds] = useState(false);

  const generatePDF = async (element: HTMLElement) => {
    // Scroll into view
    element.scrollIntoView({ behavior: 'auto', block: 'start' });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clone and style for print
    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.print\\:hidden, [class*="print:hidden"]').forEach(el => el.remove());
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `position:fixed;left:0;top:0;width:794px;background:${removeBackgrounds ? 'transparent' : '#fff'};z-index:99999;padding:20px;box-sizing:border-box;overflow:visible;`;
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Force reflow
    void wrapper.offsetHeight;
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      console.log('Advanced PDF - wrapper dimensions:', {
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
        scrollWidth: wrapper.scrollWidth,
        scrollHeight: wrapper.scrollHeight,
        cloneWidth: clone.offsetWidth,
        cloneHeight: clone.offsetHeight
      });

      if (wrapper.offsetWidth === 0 || wrapper.offsetHeight === 0) {
        throw new Error('Wrapper has zero dimensions');
      }

      const canvas = await html2canvas(wrapper, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: removeBackgrounds ? null : '#ffffff',
        logging: true,
        width: wrapper.scrollWidth,
        height: wrapper.scrollHeight,
        windowWidth: wrapper.scrollWidth,
        windowHeight: wrapper.scrollHeight,
        x: 0,
        y: 0
      });

      console.log('Canvas created:', { width: canvas.width, height: canvas.height });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas dimensions are zero');
      }

      const imgData = canvas.toDataURL('image/jpeg', imageQuality);
      
      if (!imgData || imgData === 'data:,' || imgData.length < 100) {
        throw new Error('Failed to create image data from canvas');
      }

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - (marginMM * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = marginMM;

      pdf.addImage(imgData, 'JPEG', marginMM, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - marginMM * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + marginMM;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', marginMM, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - marginMM * 2);
      }

      console.log('Advanced PDF generated successfully');
      return pdf;
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  const exportAdvancedPDF = async (preview = false) => {
    const element = document.getElementById(targetElementId);
    if (!element) {
      alert('Content not found. Please refresh and try again.');
      return;
    }

    setShowOptions(false);

    try {
      const pdf = await generatePDF(element);
      
      if (preview) {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        pdf.save(`${filename}.pdf`);
      }
    } catch (error) {
      console.error('Advanced PDF failed:', error);
      alert(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => exportAdvancedPDF(false)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg print:hidden"
      >
        <FileText className="w-5 h-5" />
        {title}
      </button>

      <button
        onClick={() => setShowOptions(s => !s)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors print:hidden"
      >
        <Settings className="w-4 h-4" />
      </button>

      {showOptions && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowOptions(false)} />
          <div className="absolute z-50 right-0 top-12 bg-white border rounded-lg shadow-xl p-5 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Advanced Settings</h3>
              <button onClick={() => setShowOptions(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Page Size</label>
                  <select value={pageSize} onChange={e => setPageSize(e.target.value as any)} className="w-full p-2 border rounded text-sm">
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Orientation</label>
                  <select value={orientation} onChange={e => setOrientation(e.target.value as any)} className="w-full p-2 border rounded text-sm">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Render Quality: {scale.toFixed(1)}x</label>
                <input type="range" min={1.5} max={3} step={0.1} value={scale} onChange={e => setScale(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Good</span>
                  <span>Best</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Image Quality: {(imageQuality * 100).toFixed(0)}%</label>
                <input type="range" min={0.7} max={1} step={0.05} value={imageQuality} onChange={e => setImageQuality(Number(e.target.value))} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Margin (mm)</label>
                  <input type="number" min={0} max={30} value={marginMM} onChange={e => setMarginMM(Number(e.target.value))} className="w-full p-2 border rounded text-sm" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={removeBackgrounds} onChange={e => setRemoveBackgrounds(e.target.checked)} className="rounded" />
                    No BG
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button onClick={() => exportAdvancedPDF(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  <Eye className="w-4 h-4" />Preview
                </button>
                <button onClick={() => exportAdvancedPDF(false)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  <Download className="w-4 h-4" />Export
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};