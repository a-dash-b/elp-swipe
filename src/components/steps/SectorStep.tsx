
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, Heart, Loader2, AlertCircle } from 'lucide-react';
import { useSectorsWithFallback } from '@/hooks/useProjects';
import { checkConnection } from '@/lib/database';
import { useEffect, useState } from 'react';

interface SectorStepProps {
  selectedSectors: string[];
  onSectorToggle: (sector: string) => void;
  onNext: () => void;
}

const SectorStep = ({ selectedSectors, onSectorToggle, onNext }: SectorStepProps) => {
  const { data: sectors = [], isLoading: sectorsLoading, error } = useSectorsWithFallback();
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);

  useEffect(() => {
    // Test connection on component mount
    const testConnection = async () => {
      const isConnected = await checkConnection();
      setConnectionStatus(isConnected);
    };
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-8">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Select Sectors</h2>
          <p className="text-muted-foreground">Choose sectors to filter projects (optional)</p>
          
          {/* Connection Status Indicator */}
          {connectionStatus !== null && (
            <div className="mt-2 flex items-center justify-center gap-2 text-sm">
              {connectionStatus ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">Database connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-600">Using offline data</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {sectorsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading sectors...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
              {sectors.map((sector) => (
                <div key={sector} className="flex items-center space-x-2">
                  <Checkbox
                    id={sector}
                    checked={selectedSectors.includes(sector)}
                    onCheckedChange={() => onSectorToggle(sector)}
                  />
                  <Label htmlFor={sector} className="text-sm font-normal cursor-pointer">
                    {sector}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {selectedSectors.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Selected: {selectedSectors.length} sector{selectedSectors.length !== 1 ? 's' : ''}
            </div>
          )}
          
          <Button 
            onClick={onNext}
            disabled={sectorsLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Start Swiping <Heart className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorStep;
