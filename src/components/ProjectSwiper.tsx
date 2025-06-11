
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import SwipeCard from '@/components/swiper/SwipeCard';
import SwipeActions from '@/components/swiper/SwipeActions';
import ProgressIndicator from '@/components/swiper/ProgressIndicator';
import CompletionScreen from '@/components/swiper/CompletionScreen';
import LoadingScreen from '@/components/swiper/LoadingScreen';
import ErrorScreen from '@/components/swiper/ErrorScreen';
import { useSwipeHandlers } from '@/components/swiper/useSwipeHandlers';

interface ProjectSwiperProps {
  selectedSectors: string[];
  groupCode: string;
  memberCode: string;
  onBackToSectors?: () => void;
}

const ProjectSwiper = ({ selectedSectors, groupCode, memberCode, onBackToSectors }: ProjectSwiperProps) => {
  const { data: projects = [], isLoading, error } = useProjects();

  const filteredProjects = selectedSectors.length > 0 
    ? projects.filter(project => selectedSectors.includes(project.sec))
    : projects;

  const {
    currentIndex,
    isAnimating,
    likedProjects,
    passedProjects,
    dragOffset,
    isDragging,
    cardRef,
    currentProject,
    nextProject,
    handleSwipe,
    handleUndo,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetSwiper
  } = useSwipeHandlers({ groupCode, memberCode, filteredProjects });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  if (currentIndex >= filteredProjects.length) {
    return (
      <CompletionScreen
        likedProjects={likedProjects}
        passedProjects={passedProjects}
        onBackToSectors={onBackToSectors}
        onStartOver={resetSwiper}
      />
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

  return (
    <div className="space-y-4">
      {/* Back to Sectors Button */}
      {onBackToSectors && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToSectors}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sectors
          </Button>
        </div>
      )}

      {/* Card Stack Container */}
      <SwipeCard
        ref={cardRef}
        project={currentProject}
        nextProject={nextProject}
        dragOffset={dragOffset}
        isDragging={isDragging}
        isAnimating={isAnimating}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Action Buttons */}
      <SwipeActions
        isAnimating={isAnimating}
        currentIndex={currentIndex}
        onSwipe={handleSwipe}
        onUndo={handleUndo}
      />

      {/* Progress */}
      <ProgressIndicator
        currentIndex={currentIndex}
        totalProjects={filteredProjects.length}
      />
    </div>
  );
};

export default ProjectSwiper;
