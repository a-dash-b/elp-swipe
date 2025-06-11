
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading projects...</p>
      </CardContent>
    </Card>
  );
};

export default LoadingScreen;
