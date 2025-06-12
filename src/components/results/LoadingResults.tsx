
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingResults = () => {
  return (
    <div className="space-y-6">
      {/* Loading Header */}
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-purple-500" />
            <h3 className="text-lg font-semibold mb-2">Loading Results</h3>
            <p className="text-muted-foreground">
              Analyzing project evaluation data...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loading Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venn Diagram Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="h-96 bg-gray-100 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Reference Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoadingResults;
