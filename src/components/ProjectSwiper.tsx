
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  code: string;
  description: string;
  sec: string;
  cat: string;
}

const sampleProjects: Project[] = [
  {
    id: 1,
    code: "PROJ001",
    description: "Develop an intelligent chatbot using natural language processing to handle customer inquiries and support tickets automatically. This system will integrate with existing CRM platforms and provide 24/7 customer support.",
    sec: "Technology",
    cat: "AI & Machine Learning"
  },
  {
    id: 2,
    code: "PROJ002", 
    description: "Create a blockchain-based platform to track and verify sustainable practices throughout the supply chain process. This will help companies ensure ethical sourcing and reduce environmental impact.",
    sec: "Technology",
    cat: "Blockchain"
  },
  {
    id: 3,
    code: "PROJ003",
    description: "Build a comprehensive analytics platform to track student engagement and performance in remote learning environments. The system will provide real-time insights for educators.",
    sec: "Education",
    cat: "Analytics"
  },
  {
    id: 4,
    code: "PROJ004",
    description: "Develop an interactive tool for healthcare professionals to visualize patient data and treatment outcomes. This will improve decision-making and patient care quality.",
    sec: "Healthcare",
    cat: "Data Visualization"
  },
  {
    id: 5,
    code: "PROJ005",
    description: "Create an IoT-based system to optimize traffic flow and reduce congestion in urban areas using real-time data from sensors and cameras throughout the city.",
    sec: "Transportation",
    cat: "IoT & Smart City"
  }
];

interface ProjectSwiperProps {
  selectedSectors: string[];
}

const ProjectSwiper = ({ selectedSectors }: ProjectSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [passedProjects, setPassedProjects] = useState<string[]>([]);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const filteredProjects = selectedSectors.length > 0 
    ? sampleProjects.filter(project => selectedSectors.includes(project.sec))
    : sampleProjects;

  const currentProject = filteredProjects[currentIndex];
  const nextProject = filteredProjects[currentIndex + 1];

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (isAnimating || !currentProject) return;

    setIsAnimating(true);

    if (direction === 'like') {
      setLikedProjects(prev => [...prev, currentProject.code]);
      toast({
        title: "Project Liked! ❤️",
        description: `You liked "${currentProject.code}"`,
      });
    } else {
      setPassedProjects(prev => [...prev, currentProject.code]);
      toast({
        title: "Project Passed",
        description: `You passed on "${currentProject.code}"`,
      });
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

  if (currentIndex >= filteredProjects.length) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">All Done!</h3>
            <p className="text-muted-foreground mb-4">
              You've reviewed all projects in the selected sectors.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-green-600 font-medium">❤️ Liked: {likedProjects.length} projects</p>
              <p className="text-red-600 font-medium">✖️ Passed: {passedProjects.length} projects</p>
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
      <Card className="w-full max-w-md mx-auto">
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
      <div className="relative h-96">
        {/* Next Card (Background) */}
        {nextProject && (
          <Card className="absolute inset-0 transform scale-95 opacity-50 shadow-md">
            <CardContent className="p-0 h-full">
              <div className="h-full flex flex-col">
                {/* Project Code Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center">
                  <h3 className="text-lg font-bold">{nextProject.code}</h3>
                </div>
                
                {/* Description */}
                <div className="flex-1 p-4 flex items-center">
                  <p className="text-muted-foreground text-sm line-clamp-6">
                    {nextProject.description}
                  </p>
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
              {/* Project Code Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
                <h3 className="text-xl font-bold">{currentProject.code}</h3>
              </div>
              
              {/* Description */}
              <div className="flex-1 p-6 flex items-center">
                <p className="text-foreground leading-relaxed">
                  {currentProject.description}
                </p>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t bg-muted/20">
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
