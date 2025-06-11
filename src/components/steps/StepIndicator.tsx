
interface StepIndicatorProps {
  currentStep: 'group-code' | 'member-code' | 'sector' | 'swiping';
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = ['group-code', 'member-code', 'sector', 'swiping'];
  const currentIndex = steps.indexOf(currentStep);
  
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index <= currentIndex 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600' 
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
