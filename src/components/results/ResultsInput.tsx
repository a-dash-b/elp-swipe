
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Users } from 'lucide-react';
import { validateCode } from '@/utils/codeValidation';

interface ResultsInputProps {
  onProceed: (groupCode: string, memberCodes: string[]) => void;
}

const ResultsInput = ({ onProceed }: ResultsInputProps) => {
  const [groupCode, setGroupCode] = useState('');
  const [memberCodes, setMemberCodes] = useState<string[]>(['']);

  const handleGroupCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setGroupCode(numericValue);
  };

  const handleMemberCodeChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    const newMemberCodes = [...memberCodes];
    newMemberCodes[index] = numericValue;
    setMemberCodes(newMemberCodes);
  };

  const addMemberCode = () => {
    if (memberCodes.length < 5) {
      setMemberCodes([...memberCodes, '']);
    }
  };

  const removeMemberCode = (index: number) => {
    if (memberCodes.length > 1) {
      const newMemberCodes = memberCodes.filter((_, i) => i !== index);
      setMemberCodes(newMemberCodes);
    }
  };

  const isValid = () => {
    const validGroupCode = validateCode(groupCode);
    const validMemberCodes = memberCodes.filter(code => validateCode(code));
    return validGroupCode && validMemberCodes.length > 0;
  };

  const handleSubmit = () => {
    if (isValid()) {
      const validMemberCodes = memberCodes.filter(code => validateCode(code));
      onProceed(groupCode, validMemberCodes);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5" />
            Enter Group & Member Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Group Code */}
          <div className="space-y-2">
            <Label htmlFor="group-code">Group Code (Required)</Label>
            <Input
              id="group-code"
              placeholder="Enter 4-digit group code"
              value={groupCode}
              onChange={(e) => handleGroupCodeChange(e.target.value)}
              maxLength={4}
              className={`text-center text-lg ${
                groupCode && !validateCode(groupCode) ? 'border-red-300' : ''
              }`}
            />
            <p className="text-sm text-muted-foreground text-center">
              Don't have a group yet? Input <span className="font-mono font-semibold">0000</span>
            </p>
            {groupCode && !validateCode(groupCode) && (
              <p className="text-sm text-red-500">Please enter a valid 4-digit code</p>
            )}
          </div>

          {/* Member Codes */}
          <div className="space-y-3">
            <Label>Member Codes (At least one required)</Label>
            {memberCodes.map((code, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder={`Member ${index + 1} code`}
                  value={code}
                  onChange={(e) => handleMemberCodeChange(index, e.target.value)}
                  maxLength={4}
                  className={`text-center ${
                    code && !validateCode(code) ? 'border-red-300' : ''
                  }`}
                />
                {memberCodes.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeMemberCode(index)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {/* Add Member Button */}
            {memberCodes.length < 5 && (
              <Button
                variant="outline"
                onClick={addMemberCode}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Member
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground">
              You can add up to 5 members. Leave empty fields blank if not needed.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            className="w-full"
            size="lg"
          >
            View Results Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsInput;
