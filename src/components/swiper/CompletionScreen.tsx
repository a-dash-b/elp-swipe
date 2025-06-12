
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, ArrowLeft, RotateCcw, Users, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompletionScreenProps {
  likedProjects: string[];
  passedProjects: string[];
  groupCode: string;
  memberCode: string;
  onBackToSectors?: () => void;
  onStartOver: () => void;
  isAutoRedirect?: boolean;
}

const CompletionScreen = ({ 
  likedProjects, 
  passedProjects,
  groupCode,
  memberCode,
  onBackToSectors, 
  onStartOver,
  isAutoRedirect = false
}: CompletionScreenProps) => {
  const navigate = useNavigate();

  const handleTeamFinder = () => {
    navigate('/team-finder', { 
      state: { 
        groupCode, 
        memberCode,
        prefilled: true 
      } 
    });
  };

  const handleTeamDashboard = () => {
    navigate('/results', { 
      state: { 
        groupCode, 
        memberCodes: [memberCode],
        prefilled: true 
      } 
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {isAutoRedirect ? 'Welcome Back!' : 'All Done!'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isAutoRedirect 
              ? 'You have already completed your project selections!'
              : 'Great work! Now explore your options below:'
            }
          </p>
          {isAutoRedirect && (
            <Badge variant="secondary" className="mb-4">
              Previously Completed
            </Badge>
          )}
        </div>

        {/* Team Navigation Buttons */}
        <div className="mb-8 space-y-3">
          <Button
            onClick={handleTeamFinder}
            className="w-full h-auto p-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-left"
          >
            <div className="flex items-center w-full">
              <Users className="w-6 h-6 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Team Finder</div>
                <div className="text-sm opacity-90">Find your ideal teammates based on project preferences</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={handleTeamDashboard}
            className="w-full h-auto p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-left"
          >
            <div className="flex items-center w-full">
              <LayoutDashboard className="w-6 h-6 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Team Dashboard</div>
                <div className="text-sm opacity-90">View group results and analyze project preferences</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Liked Projects Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
            ❤️ Liked Projects ({likedProjects.length})
          </h4>
          {likedProjects.length > 0 ? (
            <ScrollArea className="h-32 w-full border rounded-lg p-3">
              <div className="flex flex-wrap gap-2">
                {likedProjects.map((projectCode, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    {projectCode}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground text-sm italic">No projects were liked</p>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{likedProjects.length}</p>
              <p className="text-sm text-muted-foreground">Projects Liked</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{passedProjects.length}</p>
              <p className="text-sm text-muted-foreground">Projects Passed</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {onBackToSectors && (
            <Button 
              onClick={onBackToSectors}
              variant="outline"
              className="w-full border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Change Sectors
            </Button>
          )}
          
          <Button 
            onClick={onStartOver}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            {isAutoRedirect ? 'Redo Selections' : 'Start Over'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionScreen;
