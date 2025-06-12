
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Results = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 flex flex-col">
      <div className="max-w-4xl mx-auto py-8 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ELP Results Dashboard
          </h1>
          <p className="text-muted-foreground">Analyze your project evaluation results</p>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Coming Soon Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-purple-500" />
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                The Results Dashboard is currently under development. This will allow you to:
              </p>
              <ul className="text-left text-muted-foreground space-y-2 mb-6">
                <li>• View interactive Venn diagrams of team preferences</li>
                <li>• See projects liked by all members vs individual choices</li>
                <li>• Analyze preference patterns and consensus</li>
                <li>• Export results and generate reports</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Check back soon for the full analytics experience!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-muted-foreground">
        Made with ❤️ by Akhil using Lovable
      </div>
    </div>
  );
};

export default Results;
