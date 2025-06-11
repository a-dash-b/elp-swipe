
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Hash } from 'lucide-react';

interface MemberCodeStepProps {
  memberCode: string;
  onCodeChange: (value: string) => void;
  onNext: () => void;
  validateCode: (code: string) => boolean;
}

const MemberCodeStep = ({ memberCode, onCodeChange, onNext, validateCode }: MemberCodeStepProps) => {
  return (
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
              onChange={(e) => onCodeChange(e.target.value)}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={4}
            />
            {memberCode && !validateCode(memberCode) && (
              <p className="text-sm text-destructive">Must be exactly 4 digits</p>
            )}
          </div>
          
          <Button 
            onClick={onNext}
            disabled={!validateCode(memberCode)}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCodeStep;
