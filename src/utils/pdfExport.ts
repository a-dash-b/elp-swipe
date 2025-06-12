
import jsPDF from 'jspdf';
import { ResultsData } from '@/hooks/useResultsData';

export const exportToPDF = async (data: ResultsData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  let currentY = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text('ELP Results Dashboard', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // Group Code
  pdf.setFontSize(14);
  pdf.text(`Group Code: ${data.groupCode}`, margin, currentY);
  currentY += 10;

  // Date
  pdf.setFontSize(10);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, currentY);
  currentY += 15;

  // Summary Statistics
  pdf.setFontSize(16);
  pdf.text('Summary Statistics', margin, currentY);
  currentY += 10;

  pdf.setFontSize(12);
  const stats = [
    `Total Members: ${data.memberResults.length}`,
    `Projects Liked by All: ${data.allIntersections.length}`,
    `Total Likes: ${data.memberResults.reduce((sum, member) => sum + member.likedProjects.length, 0)}`,
    `Unique Sectors: ${new Set(data.memberResults.flatMap(m => m.likedProjects.map(p => p.sec))).size}`
  ];

  stats.forEach(stat => {
    pdf.text(stat, margin, currentY);
    currentY += 7;
  });

  currentY += 10;

  // Projects Liked by All Members
  if (data.allIntersections.length > 0) {
    pdf.setFontSize(16);
    pdf.text('Projects Liked by All Members', margin, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    data.allIntersections.forEach(project => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(12);
      pdf.text(`Code: ${project.code}`, margin, currentY);
      currentY += 6;
      
      pdf.setFontSize(10);
      pdf.text(`Title: ${project.title}`, margin + 5, currentY);
      currentY += 5;
      
      if (project.description) {
        const descLines = pdf.splitTextToSize(`Description: ${project.description}`, pageWidth - 2 * margin - 5);
        pdf.text(descLines, margin + 5, currentY);
        currentY += descLines.length * 4;
      }
      
      pdf.text(`Sector: ${project.sec || 'N/A'}`, margin + 5, currentY);
      currentY += 5;
      pdf.text(`Category: ${project.cat || 'N/A'}`, margin + 5, currentY);
      currentY += 10;
    });
  }

  // Individual Member Results
  pdf.addPage();
  currentY = margin;
  
  pdf.setFontSize(16);
  pdf.text('Individual Member Results', margin, currentY);
  currentY += 15;

  data.memberResults.forEach(member => {
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.setFontSize(14);
    pdf.text(`Member: ${member.memberCode}`, margin, currentY);
    currentY += 8;

    pdf.setFontSize(12);
    pdf.text(`Total Projects Liked: ${member.likedProjects.length}`, margin + 5, currentY);
    currentY += 8;

    if (member.likedProjects.length > 0) {
      pdf.setFontSize(10);
      pdf.text('Liked Projects:', margin + 5, currentY);
      currentY += 5;

      member.likedProjects.forEach(project => {
        if (currentY > pageHeight - 20) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.text(`• ${project.code} - ${project.title}`, margin + 10, currentY);
        currentY += 4;
        
        if (project.sec) {
          pdf.text(`  Sector: ${project.sec}`, margin + 15, currentY);
          currentY += 4;
        }
      });
    }

    currentY += 10;
  });

  // Sector Analysis
  pdf.addPage();
  currentY = margin;
  
  pdf.setFontSize(16);
  pdf.text('Sector Analysis', margin, currentY);
  currentY += 15;

  const sectorCounts = new Map<string, number>();
  data.memberResults.forEach(member => {
    member.likedProjects.forEach(project => {
      if (project.sec) {
        sectorCounts.set(project.sec, (sectorCounts.get(project.sec) || 0) + 1);
      }
    });
  });

  const sortedSectors = Array.from(sectorCounts.entries())
    .sort(([, a], [, b]) => b - a);

  pdf.setFontSize(12);
  sortedSectors.forEach(([sector, count]) => {
    pdf.text(`${sector}: ${count} likes`, margin, currentY);
    currentY += 6;
  });

  // Save the PDF
  const fileName = `ELP_Results_${data.groupCode}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
