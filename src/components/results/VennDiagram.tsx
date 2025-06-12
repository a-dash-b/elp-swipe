
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResultsData } from '@/hooks/useResultsData';

interface VennDiagramProps {
  data: ResultsData;
}

const MEMBER_COLORS = [
  'bg-pink-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
];

const VennDiagram = ({ data }: VennDiagramProps) => {
  const { memberResults, allIntersections } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Member Preferences Visualization
          <Badge variant="outline">{memberResults.length} Members</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Member Legend */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Members</h4>
          <div className="flex flex-wrap gap-2">
            {memberResults.map((member, index) => (
              <div key={member.memberCode} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${MEMBER_COLORS[index]}`} />
                <span className="text-sm font-medium">
                  {member.memberCode} ({member.likedProjects.length} likes)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Simplified Venn Representation */}
        <div className="space-y-4">
          {/* Common Projects (All Members) */}
          {allIntersections.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border">
              <h4 className="font-medium mb-2 text-purple-700">
                Liked by All Members ({allIntersections.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {allIntersections.slice(0, 10).map((project) => (
                  <Badge key={project.code} variant="secondary" className="text-xs">
                    {project.code}
                  </Badge>
                ))}
                {allIntersections.length > 10 && (
                  <Badge variant="outline" className="text-xs">
                    +{allIntersections.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Individual Member Circles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberResults.map((member, index) => (
              <div
                key={member.memberCode}
                className="p-4 rounded-lg border bg-white"
                style={{
                  borderColor: MEMBER_COLORS[index].replace('bg-', '').replace('-500', '-200'),
                }}
              >
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${MEMBER_COLORS[index]}`} />
                  Member {member.memberCode}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {member.likedProjects.length} projects liked
                </p>
                
                {/* Individual projects (excluding common ones) */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Individual Preferences:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.likedProjects
                      .filter(p => !allIntersections.some(common => common.code === p.code))
                      .slice(0, 8)
                      .map((project) => (
                        <Badge key={project.code} variant="outline" className="text-xs">
                          {project.code}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Sectors */}
                <div className="mt-3 pt-2 border-t">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Top Sectors:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(member.likedProjects.map(p => p.sec))]
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((sector) => (
                        <Badge key={sector} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VennDiagram;
