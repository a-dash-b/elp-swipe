
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Users } from 'lucide-react';

interface GroupCodeStepProps {
  groupCode: string;
  onCodeChange: (value: string) => void;
  onNext: () => void;
  validateCode: (code: string) => boolean;
}

const GroupCodeStep = ({ groupCode, onCodeChange, onNext, validateCode }: GroupCodeStepProps) => {
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Enter Group Code</h2>
          <p className="text-muted-foreground">4-digit sum of last 4 digits of all group members' PGIDs</p>
          <p className="text-sm text-muted-foreground mt-2">
            Don't have a group yet? Input <span className="font-mono font-semibold">0000</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-code">Group Code</Label>
            <Input
              id="group-code"
              placeholder="0000"
              value={groupCode}
              onChange={(e) => onCodeChange(e.target.value)}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={4}
            />
            {groupCode && !validateCode(groupCode) && (
              <p className="text-sm text-destructive">Must be exactly 4 digits</p>
            )}
          </div>
          
          <Button 
            onClick={onNext}
            disabled={!validateCode(groupCode)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCodeStep;
