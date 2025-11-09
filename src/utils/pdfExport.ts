import { jsPDF } from 'jspdf';
import { ProjectEstimate, ComponentOption } from '@/types/estimator';

export const generateEstimatePDF = (estimate: ProjectEstimate) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const toSentenceCase = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

  const addText = (text: string, x: number, y: number, fontSize: number = 12, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    doc.text(text, x, y);
  };

  const addLine = (y: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Header
  doc.setFillColor(70, 130, 180);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  addText('Construction Cost Estimate', pageWidth / 2, 20, 20, 'bold');
  doc.setTextColor(255, 255, 255);
  addText('Vanilla Something', pageWidth / 2, 30, 10);
  yPos = 50;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Project Details
  addText('Project Details', margin, yPos, 16, 'bold');
  yPos += 10;
  addLine(yPos);
  yPos += 8;
  
  addText(`Location: ${estimate.city}, ${estimate.state}`, margin, yPos, 11);
  yPos += 7;
  addText(`Project Type: ${toSentenceCase(estimate.projectType)}`, margin, yPos, 11);
  yPos += 7;
  addText(`Area: ${estimate.area.toLocaleString()} ${estimate.areaUnit}`, margin, yPos, 11);
  yPos += 12;

  // Total Cost - Highlighted
  doc.setFillColor(240, 240, 255);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
  yPos += 8;
  addText('Estimated Total Cost', margin + 5, yPos, 12, 'bold');
  yPos += 8;
  doc.setTextColor(70, 130, 180);
  addText(formatCurrency(estimate.totalCost), margin + 5, yPos, 18, 'bold');
  doc.setTextColor(100, 100, 100);
  addText(`(${formatCurrency(Math.round(estimate.totalCost / estimate.area))} per ${estimate.areaUnit})`, pageWidth - margin - 60, yPos, 10);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  // Cost Breakdown
  addText('Cost Distribution', margin, yPos, 14, 'bold');
  yPos += 10;
  addLine(yPos);
  yPos += 8;

  const breakdown = [
    { label: 'Base Construction', value: estimate.categoryBreakdown.construction },
    { label: 'Core Components', value: estimate.categoryBreakdown.core },
    { label: 'Finishes', value: estimate.categoryBreakdown.finishes },
    { label: 'Interiors', value: estimate.categoryBreakdown.interiors },
  ];

  breakdown.forEach(item => {
    addText(item.label, margin + 5, yPos, 11);
    addText(formatCurrency(item.value), pageWidth - margin - 5, yPos, 11, 'bold');
    yPos += 7;
  });

  yPos += 8;

  // Timeline
  addText('Project Timeline', margin, yPos, 14, 'bold');
  yPos += 10;
  addLine(yPos);
  yPos += 8;

  addText(`Total Duration: ${estimate.timeline.totalMonths} months`, margin + 5, yPos, 11);
  yPos += 7;
  addText(`Planning: ${estimate.timeline.phases.planning} months`, margin + 10, yPos, 10);
  yPos += 6;
  addText(`Construction: ${estimate.timeline.phases.construction} months`, margin + 10, yPos, 10);
  yPos += 6;
  addText(`Interiors: ${estimate.timeline.phases.interiors} months`, margin + 10, yPos, 10);
  yPos += 12;

  // Helper to format component level
  const formatLevel = (level: ComponentOption) => {
    if (level === 'standard') return 'Standard';
    if (level === 'premium') return 'Premium';
    if (level === 'luxury') return 'Luxury';
    return level;
  };

  // Helper to check if component is included
  const isIncluded = (value: string | undefined): boolean => {
    return !!(value && value !== 'none' && value !== '');
  };

  // Selected Components
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  addText('Selected Components & Features', margin, yPos, 14, 'bold');
  yPos += 10;
  addLine(yPos);
  yPos += 8;

  const components = [
    { category: 'Core', name: 'Quality of Construction', level: estimate.civilQuality },
    { category: 'Core', name: 'Plumbing & Sanitary', level: estimate.plumbing },
    { category: 'Core', name: 'Electrical Systems', level: estimate.electrical },
    { category: 'Core', name: 'AC & HVAC', level: estimate.ac },
    { category: 'Core', name: 'Elevator/Lift', level: estimate.elevator },
    { category: 'Finishes', name: 'Building Envelope', level: estimate.buildingEnvelope },
    { category: 'Finishes', name: 'Lighting Systems', level: estimate.lighting },
    { category: 'Finishes', name: 'Windows & Glazing', level: estimate.windows },
    { category: 'Finishes', name: 'Ceiling Design', level: estimate.ceiling },
    { category: 'Finishes', name: 'Wall & Floor Finishes', level: estimate.surfaces },
    { category: 'Interiors', name: 'Fixed Furniture', level: estimate.fixedFurniture },
    { category: 'Interiors', name: 'Loose Furniture', level: estimate.looseFurniture },
    { category: 'Interiors', name: 'Furnishings', level: estimate.furnishings },
    { category: 'Interiors', name: 'Appliances', level: estimate.appliances },
    { category: 'Interiors', name: 'Artefacts', level: estimate.artefacts },
  ].filter(item => isIncluded(item.level));

  components.forEach(item => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(item.category, margin + 5, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(item.name, margin + 30, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(formatLevel(item.level), pageWidth - margin - 25, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
  });

  // Disclaimer
  yPos += 10;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(255, 245, 230);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 30, 'F');
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 100, 0);
  doc.text('Important Note:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  yPos += 5;
  const disclaimerText = `This is an indicative estimate based on standard inputs and market rates for ${estimate.city}. Final costs may vary based on site conditions, material availability, contractor rates, and specific requirements. For an accurate detailed quote, please contact our team.`;
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 10);
  doc.text(splitDisclaimer, margin + 5, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by Vanilla Something Estimator | www.vanillasometh.in', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });

  // Save the PDF
  const fileName = `Construction_Estimate_${estimate.city}_${estimate.area}${estimate.areaUnit}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
