
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import VennDiagram from './VennDiagram';
import QuickReference from './QuickReference';
import { useResultsData } from '@/hooks/useResultsData';
import LoadingResults from './LoadingResults';
import ErrorResults from './ErrorResults';
import { exportToPDF } from '@/utils/pdfExport';

interface ResultsDashboardProps {
  groupCode: string;
  memberCodes: string[];
  onBackToInput: () => void;
}

const ResultsDashboard = ({ groupCode, memberCodes, onBackToInput }: ResultsDashboardProps) => {
  const { data, isLoading, error, refetch } = useResultsData(groupCode, memberCodes);

  const handleExportPDF = async () => {
    if (!data) return;
    
    try {
      await exportToPDF(data);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  if (isLoading) {
    return <LoadingResults />;
  }

  if (error) {
    return <ErrorResults onRetry={() => refetch()} onBackToInput={onBackToInput} />;
  }

  if (!data || data.memberResults.length === 0) {
    return (
      <div className="text-center">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-4">
            No evaluation data found for the provided group and member codes.
          </p>
          <Button onClick={onBackToInput}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Input
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Button variant="outline" onClick={onBackToInput}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Input
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-pink-600">{data.memberResults.length}</div>
          <div className="text-sm text-muted-foreground">Members</div>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{data.allIntersections.length}</div>
          <div className="text-sm text-muted-foreground">Common Likes</div>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.memberResults.reduce((sum, member) => sum + member.likedProjects.length, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Likes</div>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {new Set(data.memberResults.flatMap(m => m.likedProjects.map(p => p.sec))).size}
          </div>
          <div className="text-sm text-muted-foreground">Sectors</div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venn Diagram - Left 2 columns */}
        <div className="lg:col-span-2">
          <VennDiagram data={data} />
        </div>
        
        {/* Quick Reference - Right 1 column */}
        <div className="lg:col-span-1">
          <QuickReference data={data} />
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
