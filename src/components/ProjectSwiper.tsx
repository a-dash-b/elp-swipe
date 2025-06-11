import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, X, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';
import { useUserResponses } from '@/hooks/useUserResponses';
import { Project } from '@/lib/database';

interface ProjectSwiperProps {
  selectedSectors: string[];
  groupCode: string;
  memberCode: string;
}

const ProjectSwiper = ({ selectedSectors, groupCode, memberCode }: ProjectSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [passedProjects, setPassedProjects] = useState<string[]>([]);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: projects = [], isLoading, error } = useProjects();
  const saveResponseMutation = useUserResponses();

  const filteredProjects = selectedSectors.length > 0 
    ? projects.filter(project => selectedSectors.includes(project.sec))
    : projects;

  const currentProject = filteredProjects[currentIndex];
  const nextProject = filteredProjects[currentIndex + 1];

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (isAnimating || !currentProject) return;

    setIsAnimating(true);
    const response = direction === 'like' ? 1 : 0;

    // Save response to database
    try {
      await saveResponseMutation.mutateAsync({
        group_code: groupCode,
        member_code: memberCode,
        project_code: currentProject.code,
        response
      });
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Failed to save response:', error);
    }

    if (direction === 'like') {
      setLikedProjects(prev => [...prev, currentProject.code]);
    } else {
      setPassedProjects(prev => [...prev, currentProject.code]);
    }

    // Animate card out
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${direction === 'like' ? '100%' : '-100%'}) rotate(${direction === 'like' ? '20deg' : '-20deg'})`;
      cardRef.current.style.opacity = '0';
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
      setDragOffset(0);
      
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) rotate(0)';
        cardRef.current.style.opacity = '1';
      }
    }, 300);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && !isAnimating) {
      const previousIndex = currentIndex - 1;
      const previousProject = filteredProjects[previousIndex];
      
      setCurrentIndex(previousIndex);
      setLikedProjects(prev => prev.filter(code => code !== previousProject.code));
      setPassedProjects(prev => prev.filter(code => code !== previousProject.code));
      
      toast({
        title: "Action Undone",
        description: "Your last swipe has been undone",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isAnimating) return;
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const offset = e.clientX - centerX;
      setDragOffset(Math.max(-150, Math.min(150, offset)));
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragOffset) > 80) {
      handleSwipe(dragOffset > 0 ? 'like' : 'pass');
    } else {
      setDragOffset(0);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Connection Issue</h3>
          <p className="text-muted-foreground mb-4">
            Using sample data. Please check your connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (currentIndex >= filteredProjects.length) {
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
          
          <Button 
            onClick={() => {
              setCurrentIndex(0);
              setLikedProjects([]);
              setPassedProjects([]);
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentProject) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No projects found for the selected sectors.</p>
        </CardContent>
      </Card>
    );
  }

  const getCardStyle = () => {
    const rotation = dragOffset * 0.1;
    const opacity = Math.max(0.7, 1 - Math.abs(dragOffset) / 200);
    
    return {
      transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
      opacity,
      cursor: isDragging ? 'grabbing' : 'grab'
    };
  };

  const getOverlayColor = () => {
    if (Math.abs(dragOffset) < 40) return 'transparent';
    return dragOffset > 0 
      ? 'rgba(34, 197, 94, 0.2)' // green for like
      : 'rgba(239, 68, 68, 0.2)'; // red for pass
  };

  return (
    <div className="space-y-4">
      {/* Card Stack Container */}
      <div className="relative h-[400px]">
        {/* Next Card (Background) */}
        {nextProject && (
          <Card className="absolute inset-0 transform scale-95 opacity-50 shadow-md">
            <CardContent className="p-0 h-full">
              <div className="h-full flex flex-col">
                {/* Project Code Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center">
                  <h3 className="text-lg font-bold">{nextProject.code}</h3>
                  {nextProject.title && (
                    <p className="text-sm opacity-90 mt-1">{nextProject.title}</p>
                  )}
                </div>
                
                {/* Description */}
                <div className="flex-1 p-4">
                  <ScrollArea className="h-full">
                    <p className="text-muted-foreground text-sm">
                      {nextProject.description}
                    </p>
                  </ScrollArea>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t bg-muted/20">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{nextProject.sec}</Badge>
                    <Badge variant="secondary">{nextProject.cat}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Card */}
        <Card 
          ref={cardRef}
          className="absolute inset-0 shadow-xl transition-all duration-200 select-none"
          style={getCardStyle()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CardContent className="p-0 h-full relative overflow-hidden">
            {/* Drag Overlay */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none transition-colors duration-200"
              style={{ backgroundColor: getOverlayColor() }}
            />
            
            <div className="h-full flex flex-col relative z-20">
              {/* Project Code and Title Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 text-center">
                <h3 className="text-xl font-bold">{currentProject.code}</h3>
                {currentProject.title && (
                  <p className="text-sm opacity-90 mt-2">{currentProject.title}</p>
                )}
              </div>
              
              {/* Scrollable Description */}
              <div className="flex-1 p-4">
                <ScrollArea className="h-full">
                  <p className="text-foreground leading-relaxed">
                    {currentProject.description}
                  </p>
                </ScrollArea>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t bg-muted/20">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-sm">{currentProject.sec}</Badge>
                  <Badge variant="secondary" className="text-sm">{currentProject.cat}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => handleSwipe('pass')}
          disabled={isAnimating}
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-400 hover:bg-red-50"
        >
          <X className="w-6 h-6 text-red-500" />
        </Button>

        <Button
          onClick={handleUndo}
          disabled={isAnimating || currentIndex === 0}
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
        >
          <RotateCcw className="w-6 h-6 text-gray-500" />
        </Button>

        <Button
          onClick={() => handleSwipe('like')}
          disabled={isAnimating}
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          <Heart className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Progress */}
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">
          {currentIndex + 1} of {filteredProjects.length} projects
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / filteredProjects.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSwiper;
