
import ProjectSwiper from '@/components/ProjectSwiper';

interface SwipingStepProps {
  selectedSectors: string[];
  groupCode: string;
  memberCode: string;
  onBackToSectors: () => void;
}

const SwipingStep = ({ selectedSectors, groupCode, memberCode, onBackToSectors }: SwipingStepProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Project Evaluation</h2>
        <p className="text-muted-foreground">Swipe right to like, left to pass</p>
      </div>
      <ProjectSwiper 
        selectedSectors={selectedSectors} 
        groupCode={groupCode}
        memberCode={memberCode}
        onBackToSectors={onBackToSectors}
      />
    </div>
  );
};

export default SwipingStep;
