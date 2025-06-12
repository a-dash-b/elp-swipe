
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw, Users } from 'lucide-react';
import VennDiagram from './VennDiagram';
import QuickReference from './QuickReference';
import TeamFinder from '@/components/team/TeamFinder';
import { useResultsData } from '@/hooks/useResultsData';
import { getStudentNames } from '@/lib/database';
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
  const [showTeamFinder, setShowTeamFinder] = useState(false);
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});
  const [namesLoading, setNamesLoading] = useState(true);

  // Load student names when data is available
  useEffect(() => {
    const loadStudentNames = async () => {
      if (!data || data.memberResults.length === 0) {
        setNamesLoading(false);
        return;
      }

      try {
        const allMemberCodes = data.memberResults.map(result => result.memberCode);
        const names = await getStudentNames(allMemberCodes);
        setStudentNames(names);
      } catch (error) {
        console.error('Error loading student names:', error);
      } finally {
        setNamesLoading(false);
      }
    };

    loadStudentNames();
  }, [data]);

  const handleExportPDF = async () => {
    if (!data) return;
    
    try {
      // Create data with student names for export
      const dataWithNames = {
        ...data,
        memberResults: data.memberResults.map(result => ({
          ...result,
          memberName: studentNames[result.memberCode] || result.memberCode
        }))
      };
      await exportToPDF(dataWithNames);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  if (isLoading || namesLoading) {
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

  // Show Team Finder if requested
  if (showTeamFinder) {
    return (
      <TeamFinder
        memberCode={memberCodes[0]} // Use first member code for team finder
        groupCode={groupCode}
        onBack={() => setShowTeamFinder(false)}
      />
    );
  }

  // Create enhanced data with student names for components
  const dataWithNames = {
    ...data,
    memberResults: data.memberResults.map(result => ({
      ...result,
      memberName: studentNames[result.memberCode] || result.memberCode
    }))
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Button variant="outline" onClick={onBackToInput}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Input
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTeamFinder(true)}
            className="bg-purple-50 border-purple-200 hover:bg-purple-100"
          >
            <Users className="h-4 w-4 mr-2" />
            Team Finder
          </Button>
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
          <VennDiagram data={dataWithNames} />
        </div>
        
        {/* Quick Reference - Right 1 column */}
        <div className="lg:col-span-1">
          <QuickReference data={dataWithNames} />
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
