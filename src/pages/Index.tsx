import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Users, Hash, Building, Heart } from 'lucide-react';
import ProjectSwiper from '@/components/ProjectSwiper';

type Step = 'group-code' | 'member-code' | 'sector' | 'swiping';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('group-code');
  const [groupCode, setGroupCode] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  // Sample sectors - in real app, these would come from database
  const sectors = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Energy',
    'Transportation',
    'Real Estate',
    'Media & Entertainment'
  ];

  const validateCode = (code: string) => {
    return /^\d{4}$/.test(code);
  };

  const handleCodeChange = (value: string, setter: (value: string) => void) => {
    // Only allow numeric input and limit to 4 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setter(numericValue);
  };

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

  const renderStepIndicator = () => {
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

  const renderGroupCodeStep = () => (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Enter Group Code</h2>
          <p className="text-muted-foreground">4-digit sum of last 4 digits of all group members' PGIDs</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-code">Group Code</Label>
            <Input
              id="group-code"
              placeholder="0000"
              value={groupCode}
              onChange={(e) => handleCodeChange(e.target.value, setGroupCode)}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={4}
            />
            {groupCode && !validateCode(groupCode) && (
              <p className="text-sm text-destructive">Must be exactly 4 digits</p>
            )}
          </div>
          
          <Button 
            onClick={handleNextStep}
            disabled={!validateCode(groupCode)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMemberCodeStep = () => (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Enter Member Code</h2>
          <p className="text-muted-foreground">Last 4 digits of your PGID</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-code">Member Code</Label>
            <Input
              id="member-code"
              placeholder="0000"
              value={memberCode}
              onChange={(e) => handleCodeChange(e.target.value, setMemberCode)}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={4}
            />
            {memberCode && !validateCode(memberCode) && (
              <p className="text-sm text-destructive">Must be exactly 4 digits</p>
            )}
          </div>
          
          <Button 
            onClick={handleNextStep}
            disabled={!validateCode(memberCode)}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSectorStep = () => (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-8">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Select Sectors</h2>
          <p className="text-muted-foreground">Choose sectors to filter projects (optional)</p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
            {sectors.map((sector) => (
              <div key={sector} className="flex items-center space-x-2">
                <Checkbox
                  id={sector}
                  checked={selectedSectors.includes(sector)}
                  onCheckedChange={() => handleSectorToggle(sector)}
                />
                <Label htmlFor={sector} className="text-sm font-normal cursor-pointer">
                  {sector}
                </Label>
              </div>
            ))}
          </div>

          {selectedSectors.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Selected: {selectedSectors.length} sector{selectedSectors.length !== 1 ? 's' : ''}
            </div>
          )}
          
          <Button 
            onClick={handleNextStep}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Start Swiping <Heart className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSwipingStep = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Project Evaluation</h2>
        <p className="text-muted-foreground">Swipe right to like, left to pass</p>
      </div>
      <ProjectSwiper selectedSectors={selectedSectors} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ELP Swipe
          </h1>
          <p className="text-muted-foreground">Discover and evaluate projects with a swipe</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Current Step Content */}
        <div className="flex justify-center">
          {currentStep === 'group-code' && renderGroupCodeStep()}
          {currentStep === 'member-code' && renderMemberCodeStep()}
          {currentStep === 'sector' && renderSectorStep()}
          {currentStep === 'swiping' && renderSwipingStep()}
        </div>
      </div>
    </div>
  );
};

export default Index;
