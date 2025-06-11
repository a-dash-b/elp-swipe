
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, RotateCcw, Star, Calendar, DollarSign, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  title: string;
  description: string;
  sector: string;
  budget: string;
  timeline: string;
  teamSize: number;
  rating: number;
  tags: string[];
  image: string;
}

const sampleProjects: Project[] = [
  {
    id: 1,
    title: "AI-Powered Customer Service Bot",
    description: "Develop an intelligent chatbot using natural language processing to handle customer inquiries and support tickets automatically.",
    sector: "Technology",
    budget: "$50,000 - $75,000",
    timeline: "3-4 months",
    teamSize: 5,
    rating: 4.8,
    tags: ["AI", "NLP", "Customer Service", "Automation"],
    image: "photo-1486312338219-ce68d2c6f44d"
  },
  {
    id: 2,
    title: "Sustainable Supply Chain Platform",
    description: "Create a blockchain-based platform to track and verify sustainable practices throughout the supply chain process.",
    sector: "Technology",
    budget: "$100,000 - $150,000",
    timeline: "6-8 months",
    teamSize: 8,
    rating: 4.6,
    tags: ["Blockchain", "Sustainability", "Supply Chain", "Tracking"],
    image: "photo-1581091226825-a6a2a5aee158"
  },
  {
    id: 3,
    title: "Remote Learning Analytics Dashboard",
    description: "Build a comprehensive analytics platform to track student engagement and performance in remote learning environments.",
    sector: "Education",
    budget: "$75,000 - $100,000",
    timeline: "4-5 months",
    teamSize: 6,
    rating: 4.7,
    tags: ["Education", "Analytics", "Remote Learning", "Dashboard"],
    image: "photo-1649972904349-6e44c42644a7"
  },
  {
    id: 4,
    title: "Healthcare Data Visualization Tool",
    description: "Develop an interactive tool for healthcare professionals to visualize patient data and treatment outcomes.",
    sector: "Healthcare",
    budget: "$80,000 - $120,000",
    timeline: "5-6 months",
    teamSize: 7,
    rating: 4.9,
    tags: ["Healthcare", "Data Viz", "Patient Care", "Analytics"],
    image: "photo-1605810230434-7631ac76ec81"
  },
  {
    id: 5,
    title: "Smart City Traffic Management",
    description: "Create an IoT-based system to optimize traffic flow and reduce congestion in urban areas using real-time data.",
    sector: "Transportation",
    budget: "$200,000 - $300,000",
    timeline: "8-12 months",
    teamSize: 12,
    rating: 4.5,
    tags: ["IoT", "Smart City", "Traffic", "Real-time"],
    image: "photo-1519389950473-47ba0277781c"
  }
];

interface ProjectSwiperProps {
  sector: string;
}

const ProjectSwiper = ({ sector }: ProjectSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedProjects, setLikedProjects] = useState<number[]>([]);
  const [passedProjects, setPassedProjects] = useState<number[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const filteredProjects = sampleProjects.filter(
    project => project.sector === sector || sector === ''
  );

  const currentProject = filteredProjects[currentIndex];

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (isAnimating || !currentProject) return;

    setIsAnimating(true);

    if (direction === 'like') {
      setLikedProjects(prev => [...prev, currentProject.id]);
      toast({
        title: "Project Liked! ❤️",
        description: `You liked "${currentProject.title}"`,
      });
    } else {
      setPassedProjects(prev => [...prev, currentProject.id]);
      toast({
        title: "Project Passed",
        description: `You passed on "${currentProject.title}"`,
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
      setLikedProjects(prev => prev.filter(id => id !== previousProject.id));
      setPassedProjects(prev => prev.filter(id => id !== previousProject.id));
      
      toast({
        title: "Action Undone",
        description: "Your last swipe has been undone",
      });
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
              You've reviewed all projects in the {sector} sector.
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
          <p className="text-muted-foreground">No projects found for the selected sector.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Project Card */}
      <div className="relative">
        <Card 
          ref={cardRef}
          className="w-full max-w-md mx-auto transition-all duration-300 ease-out hover:scale-105 shadow-lg"
        >
          <CardContent className="p-0">
            {/* Project Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-t-lg overflow-hidden">
              <img
                src={`https://images.unsplash.com/${currentProject.image}?w=400&h=200&fit=crop`}
                alt={currentProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90 text-foreground">
                  {currentProject.sector}
                </Badge>
              </div>
              <div className="absolute top-4 left-4 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium">{currentProject.rating}</span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">{currentProject.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {currentProject.description}
              </p>

              {/* Project Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>{currentProject.budget}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{currentProject.timeline}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{currentProject.teamSize} team members</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {currentProject.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
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
      <div className="text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {filteredProjects.length} projects
      </div>
    </div>
  );
};

export default ProjectSwiper;
