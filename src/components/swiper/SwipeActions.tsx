
import { Button } from '@/components/ui/button';
import { Heart, X, RotateCcw } from 'lucide-react';

interface SwipeActionsProps {
  isAnimating: boolean;
  currentIndex: number;
  onSwipe: (direction: 'like' | 'pass') => void;
  onUndo: () => void;
}

const SwipeActions = ({ isAnimating, currentIndex, onSwipe, onUndo }: SwipeActionsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      <Button
        onClick={() => onSwipe('pass')}
        disabled={isAnimating}
        size="lg"
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-400 hover:bg-red-50"
      >
        <X className="w-6 h-6 text-red-500" />
      </Button>

      <Button
        onClick={onUndo}
        disabled={isAnimating || currentIndex === 0}
        size="lg"
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
      >
        <RotateCcw className="w-6 h-6 text-gray-500" />
      </Button>

      <Button
        onClick={() => onSwipe('like')}
        disabled={isAnimating}
        size="lg"
        className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
      >
        <Heart className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};

export default SwipeActions;
