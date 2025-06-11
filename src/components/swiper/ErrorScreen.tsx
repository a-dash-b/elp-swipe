
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const ErrorScreen = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Connection Issue</h3>
        <p className="text-muted-foreground mb-4">
          Using sample data. Please check your connection.
        </p>
      </CardContent>
    </Card>
  );
};

export default ErrorScreen;
