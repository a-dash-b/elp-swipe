
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, ArrowLeft } from 'lucide-react';

interface CompletionScreenProps {
  likedProjects: string[];
  passedProjects: string[];
  onBackToSectors?: () => void;
  onStartOver: () => void;
}

const CompletionScreen = ({ 
  likedProjects, 
  passedProjects, 
  onBackToSectors, 
  onStartOver 
}: CompletionScreenProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">All Done!</h3>
          <p className="text-muted-foreground mb-4">
            Responses recorded! Message Akhil (8527447321) with your group code once everyone's done for a summary dashboard of commonly and individually liked projects with full descriptions!
          </p>
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
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionScreen;
