
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserResponses } from '@/hooks/useUserResponses';
import { Project } from '@/lib/database';

interface UseSwipeHandlersProps {
  groupCode: string;
  memberCode: string;
  filteredProjects: Project[];
}

export const useSwipeHandlers = ({ groupCode, memberCode, filteredProjects }: UseSwipeHandlersProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [passedProjects, setPassedProjects] = useState<string[]>([]);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const saveResponseMutation = useUserResponses();

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

  const resetSwiper = () => {
    setCurrentIndex(0);
    setLikedProjects([]);
    setPassedProjects([]);
  };

  return {
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
  };
};
