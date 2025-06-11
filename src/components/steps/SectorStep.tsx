
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, Heart, Loader2 } from 'lucide-react';
import { useSectorsWithFallback } from '@/hooks/useProjects';

interface SectorStepProps {
  selectedSectors: string[];
  onSectorToggle: (sector: string) => void;
  onNext: () => void;
}

const SectorStep = ({ selectedSectors, onSectorToggle, onNext }: SectorStepProps) => {
  const { data: sectors = [], isLoading: sectorsLoading } = useSectorsWithFallback();

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-8">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Select Sectors</h2>
          <p className="text-muted-foreground">Choose sectors to filter projects (optional)</p>
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
