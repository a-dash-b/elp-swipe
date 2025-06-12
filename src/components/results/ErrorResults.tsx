
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface ErrorResultsProps {
  onRetry: () => void;
  onBackToInput: () => void;
}

const ErrorResults = ({ onRetry, onBackToInput }: ErrorResultsProps) => {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Results</h3>
          <p className="text-muted-foreground mb-6">
            We encountered an issue while loading your results. This could be due to:
          </p>
          <ul className="text-left text-muted-foreground space-y-1 mb-6 max-w-md mx-auto">
            <li>• Network connectivity issues</li>
            <li>• Invalid group or member codes</li>
            <li>• Database connection problems</li>
          </ul>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onBackToInput}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Input
            </Button>
            <Button onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorResults;
