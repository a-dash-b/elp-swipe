
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Zap } from 'lucide-react';
import StepIndicator from '@/components/steps/StepIndicator';
import GroupCodeStep from '@/components/steps/GroupCodeStep';
import MemberCodeStep from '@/components/steps/MemberCodeStep';
import SectorStep from '@/components/steps/SectorStep';
import SwipingStep from '@/components/steps/SwipingStep';
import { validateCode, handleCodeChange } from '@/utils/codeValidation';

type Step = 'home' | 'group-code' | 'member-code' | 'sector' | 'swiping';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('home');
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

  const handleStartSwipe = () => {
    setCurrentStep('group-code');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'home':
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Choose Your Journey</h2>
              <p className="text-muted-foreground text-lg">
                Discover projects, find teammates, or analyze team preferences
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {/* Swipe Button */}
              <Button
                size="lg"
                onClick={handleStartSwipe}
                className="h-32 flex flex-col gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Zap className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-bold text-xl">Swipe!</div>
                  <div className="text-sm opacity-90">Discover Projects</div>
                </div>
              </Button>

              {/* Team Finder Button */}
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-32 flex flex-col gap-3 border-2 hover:bg-blue-50"
              >
                <Link to="/team-finder" className="flex flex-col gap-3">
                  <Users className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-bold text-xl">Team Finder</div>
                    <div className="text-sm text-muted-foreground">Find Teammates</div>
                  </div>
                </Link>
              </Button>

              {/* Team Dashboard Button */}
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-32 flex flex-col gap-3 border-2 hover:bg-green-50"
              >
                <Link to="/results" className="flex flex-col gap-3">
                  <BarChart3 className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-bold text-xl">Team Dashboard</div>
                    <div className="text-sm text-muted-foreground">View Results</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        );
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
          <p className="text-muted-foreground mb-4">Discover and evaluate projects with a swipe</p>
        </div>

        {/* Step Indicator - only show when not on home */}
        {currentStep !== 'home' && <StepIndicator currentStep={currentStep} />}

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
