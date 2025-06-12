
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { ResultsData, LikedProject } from '@/hooks/useResultsData';

interface QuickReferenceProps {
  data: ResultsData;
}

interface ProjectCardProps {
  project: LikedProject;
  expanded?: boolean;
}

const ProjectCard = ({ project, expanded = false }: ProjectCardProps) => (
  <div className="p-3 bg-gray-50 rounded border">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{project.code}</div>
        <div className="text-xs text-muted-foreground truncate" title={project.title}>
          {project.title}
        </div>
        {expanded && project.description && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {project.description}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        {project.sec && (
          <Badge variant="outline" className="text-xs">
            {project.sec}
          </Badge>
        )}
        {project.cat && (
          <Badge variant="secondary" className="text-xs">
            {project.cat}
          </Badge>
        )}
      </div>
    </div>
  </div>
);

const QuickReference = ({ data }: QuickReferenceProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['all']));
  const { memberResults, allIntersections, intersectionsByCount } = data;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionData = () => {
    const sections = [];

    // All members section
    if (allIntersections.length > 0) {
      sections.push({
        id: 'all',
        title: `Liked by All Members (${allIntersections.length})`,
        projects: allIntersections,
        priority: 1,
      });
    }

    // Intersection sections
    Object.entries(intersectionsByCount)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .forEach(([count, intersections]) => {
        if (parseInt(count) < memberResults.length) {
          intersections.forEach((intersection, idx) => {
            sections.push({
              id: `${count}-${idx}`,
              title: `Liked by ${count}+ Members (${intersection.projects.length})`,
              projects: intersection.projects,
              priority: parseInt(count),
            });
          });
        }
      });

    return sections;
  };

  const sections = getSectionData();

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Quick Reference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No common preferences found.</p>
            <p className="text-sm mt-1">Each member has individual project preferences.</p>
          </div>
        ) : (
          sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const displayProjects = isExpanded 
              ? section.projects 
              : section.projects.slice(0, 3);

            return (
              <div key={section.id} className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="font-medium text-sm">{section.title}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                <div className="space-y-2">
                  {displayProjects.map((project) => (
                    <ProjectCard 
                      key={project.code} 
                      project={project} 
                      expanded={isExpanded}
                    />
                  ))}
                  
                  {!isExpanded && section.projects.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => toggleSection(section.id)}
                    >
                      Show {section.projects.length - 3} more
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Individual Members Summary */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-sm">Individual Summaries</h4>
          {memberResults.map((member) => (
            <div key={member.memberCode} className="text-xs text-muted-foreground">
              <span className="font-medium">Member {member.memberCode}:</span> {' '}
              {member.likedProjects.length} projects, {' '}
              {new Set(member.likedProjects.map(p => p.sec)).size} sectors
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickReference;
