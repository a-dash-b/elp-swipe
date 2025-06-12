
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import TeamFinderInput from '@/components/team/TeamFinderInput';
import TeamFinder from '@/components/team/TeamFinder';

const TeamFinderPage = () => {
  const [step, setStep] = useState<'input' | 'finder'>('input');
  const [groupCode, setGroupCode] = useState('');
  const [memberCode, setMemberCode] = useState('');

  const handleProceedToFinder = (group: string, member: string) => {
    setGroupCode(group);
    setMemberCode(member);
    setStep('finder');
  };

  const handleBackToInput = () => {
    setStep('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 flex flex-col">
      <div className="max-w-6xl mx-auto py-8 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ELP Team Finder
          </h1>
          <p className="text-muted-foreground">Find your perfect project teammates</p>
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Content */}
        {step === 'input' ? (
          <TeamFinderInput onProceed={handleProceedToFinder} />
        ) : (
          <TeamFinder
            groupCode={groupCode}
            memberCode={memberCode}
            onBack={handleBackToInput}
          />
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-muted-foreground">
        Made with ❤️ by Akhil using Lovable
      </div>
    </div>
  );
};

export default TeamFinderPage;
