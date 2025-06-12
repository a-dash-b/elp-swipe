
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResultsInput from '@/components/results/ResultsInput';
import ResultsDashboard from '@/components/results/ResultsDashboard';

const Results = () => {
  const [step, setStep] = useState<'input' | 'dashboard'>('input');
  const [groupCode, setGroupCode] = useState('');
  const [memberCodes, setMemberCodes] = useState<string[]>([]);

  const handleProceedToDashboard = (group: string, members: string[]) => {
    setGroupCode(group);
    setMemberCodes(members);
    setStep('dashboard');
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
            ELP Results Dashboard
          </h1>
          <p className="text-muted-foreground">Analyze your project evaluation results</p>
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
          <ResultsInput onProceed={handleProceedToDashboard} />
        ) : (
          <ResultsDashboard
            groupCode={groupCode}
            memberCodes={memberCodes}
            onBackToInput={handleBackToInput}
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

export default Results;
