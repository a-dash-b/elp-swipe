
interface ProgressIndicatorProps {
  currentIndex: number;
  totalProjects: number;
}

const ProgressIndicator = ({ currentIndex, totalProjects }: ProgressIndicatorProps) => {
  return (
    <div className="text-center">
      <div className="text-sm text-muted-foreground mb-2">
        {currentIndex + 1} of {totalProjects} projects
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalProjects) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
