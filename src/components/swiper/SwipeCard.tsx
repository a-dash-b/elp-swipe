
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/lib/database';

interface SwipeCardProps {
  project: Project;
  nextProject?: Project;
  dragOffset: number;
  isDragging: boolean;
  isAnimating: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

const SwipeCard = ({
  project,
  nextProject,
  dragOffset,
  isDragging,
  isAnimating,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}: SwipeCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

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
    <div className="relative h-[450px] w-full max-w-lg mx-auto">
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
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
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
              <h3 className="text-xl font-bold">{project.code}</h3>
              {project.title && (
                <p className="text-sm opacity-90 mt-2">{project.title}</p>
              )}
            </div>
            
            {/* Scrollable Description */}
            <div className="flex-1 p-4">
              <ScrollArea className="h-full">
                <p className="text-foreground leading-relaxed">
                  {project.description}
                </p>
              </ScrollArea>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t bg-muted/20">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-sm">{project.sec}</Badge>
                <Badge variant="secondary" className="text-sm">{project.cat}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwipeCard;
