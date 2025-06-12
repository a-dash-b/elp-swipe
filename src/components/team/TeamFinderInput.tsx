
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowRight } from 'lucide-react';
import { validateCode } from '@/utils/codeValidation';

interface TeamFinderInputProps {
  onProceed: (groupCode: string, memberCode: string) => void;
}

const TeamFinderInput = ({ onProceed }: TeamFinderInputProps) => {
  const [step, setStep] = useState<'group' | 'member'>('group');
  const [groupCode, setGroupCode] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [errors, setErrors] = useState<{ group?: string; member?: string }>({});

  const handleGroupNext = () => {
    if (!validateCode(groupCode)) {
      setErrors({ group: 'Group ID must be exactly 4 alphanumeric characters' });
      return;
    }
    setErrors({});
    setStep('member');
  };

  const handleMemberSubmit = () => {
    if (!validateCode(memberCode)) {
      setErrors({ member: 'Member ID must be exactly 4 alphanumeric characters' });
      return;
    }
    setErrors({});
    onProceed(groupCode, memberCode);
  };

  const handleGroupCodeChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    setGroupCode(formatted);
    if (errors.group) setErrors({ ...errors, group: undefined });
  };

  const handleMemberCodeChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    setMemberCode(formatted);
    if (errors.member) setErrors({ ...errors, member: undefined });
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Users className="h-6 w-6" />
            Team Finder
          </CardTitle>
          <p className="text-muted-foreground">
            {step === 'group' 
              ? 'Enter your Group ID to find teammates'
              : 'Enter your Member ID to continue'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'group' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-code">Group ID</Label>
                <Input
                  id="group-code"
                  value={groupCode}
                  onChange={(e) => handleGroupCodeChange(e.target.value)}
                  placeholder="e.g., ABC1"
                  className={`text-center text-lg font-mono ${errors.group ? 'border-red-500' : ''}`}
                  maxLength={4}
                  autoFocus
                />
                {errors.group && (
                  <p className="text-sm text-red-500">{errors.group}</p>
                )}
              </div>
              
              <Button 
                onClick={handleGroupNext}
                className="w-full"
                disabled={!groupCode}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Group ID</Label>
                <div className="p-2 bg-muted rounded text-center font-mono text-lg">
                  {groupCode}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="member-code">Your Member ID</Label>
                <Input
                  id="member-code"
                  value={memberCode}
                  onChange={(e) => handleMemberCodeChange(e.target.value)}
                  placeholder="e.g., M001"
                  className={`text-center text-lg font-mono ${errors.member ? 'border-red-500' : ''}`}
                  maxLength={4}
                  autoFocus
                />
                {errors.member && (
                  <p className="text-sm text-red-500">{errors.member}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setStep('group')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleMemberSubmit}
                  className="flex-1"
                  disabled={!memberCode}
                >
                  Find Teammates
                  <Users className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamFinderInput;
