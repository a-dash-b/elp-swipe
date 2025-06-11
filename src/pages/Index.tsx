
import { useState } from 'react';
import StepIndicator from '@/components/steps/StepIndicator';
import GroupCodeStep from '@/components/steps/GroupCodeStep';
import MemberCodeStep from '@/components/steps/MemberCodeStep';
import SectorStep from '@/components/steps/SectorStep';
import SwipingStep from '@/components/steps/SwipingStep';
import { validateCode, handleCodeChange } from '@/utils/codeValidation';

type Step = 'group-code' | 'member-code' | 'sector' | 'swiping';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('group-code');
  const [groupCode, setGroupCode] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'group-code':
        if (validateCode(groupCode)) setCurrentStep('member-code');
        break;
      case 'member-code':
        if (validateCode(memberCode)) setCurrentStep('sector');
        break;
      case 'sector':
        setCurrentStep('swiping');
        break;
    }
  };

  const handleBackToSectors = () => {
    setCurrentStep('sector');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'group-code':
        return (
          <GroupCodeStep
            groupCode={groupCode}
            onCodeChange={(value) => handleCodeChange(value, setGroupCode)}
            onNext={handleNextStep}
            validateCode={validateCode}
          />
        );
      case 'member-code':
        return (
          <MemberCodeStep
            memberCode={memberCode}
            onCodeChange={(value) => handleCodeChange(value, setMemberCode)}
            onNext={handleNextStep}
            validateCode={validateCode}
          />
        );
      case 'sector':
        return (
          <SectorStep
            selectedSectors={selectedSectors}
            onSectorToggle={handleSectorToggle}
            onNext={handleNextStep}
          />
        );
      case 'swiping':
        return (
          <SwipingStep
            selectedSectors={selectedSectors}
            groupCode={groupCode}
            memberCode={memberCode}
            onBackToSectors={handleBackToSectors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 flex flex-col">
      <div className="max-w-4xl mx-auto py-8 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ELP Swipe
          </h1>
          <p className="text-muted-foreground">Discover and evaluate projects with a swipe</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Current Step Content */}
        <div className="flex justify-center">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-muted-foreground">
        Made with ❤️ by Akhil using Lovable
      </div>
    </div>
  );
};

export default Index;
