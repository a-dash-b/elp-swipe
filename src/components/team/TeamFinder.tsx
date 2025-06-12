
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Heart, ArrowLeft, UserCheck, UserX } from 'lucide-react';
import { 
  findSimilarUsers, 
  getTeamInfo, 
  getSimilarUserSectors, 
  getUserLikedProjects, 
  getTeamInfoForUsers, 
  getStudentName,
  getStudentNames,
  SimilarUser, 
  TeamInfo 
} from '@/lib/database';

interface TeamFinderProps {
  memberCode: string;
  groupCode: string;
  onBack: () => void;
}

const TeamFinder = ({ memberCode, groupCode, onBack }: TeamFinderProps) => {
  const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([]);
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [userSectors, setUserSectors] = useState<Record<string, string[]>>({});
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [similarUsersTeamInfo, setSimilarUsersTeamInfo] = useState<Record<string, TeamInfo>>({});
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [similarUserNames, setSimilarUserNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeamFinderData = async () => {
      setIsLoading(true);
      try {
        // Load all data in parallel
        const [similar, team, projects, userName] = await Promise.all([
          findSimilarUsers(memberCode, 10),
          getTeamInfo(groupCode),
          getUserLikedProjects(memberCode),
          getStudentName(memberCode)
        ]);

        setSimilarUsers(similar);
        setTeamInfo(team);
        setUserProjects(projects);
        setCurrentUserName(userName);

        // Get sectors, team info, and names for similar users
        if (similar.length > 0) {
          const memberCodes = similar.map(u => u.similar_member_code);
          const [sectors, teamInfoForUsers, names] = await Promise.all([
            getSimilarUserSectors(memberCodes),
            getTeamInfoForUsers(memberCodes),
            getStudentNames(memberCodes)
          ]);
          setUserSectors(sectors);
          setSimilarUsersTeamInfo(teamInfoForUsers);
          setSimilarUserNames(names);
        }
      } catch (error) {
        console.error('Error loading team finder data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamFinderData();
  }, [memberCode, groupCode]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Users className="h-8 w-8 mx-auto mb-4 animate-pulse text-purple-500" />
          <h3 className="text-lg font-semibold mb-2">Finding Your Potential Team Members</h3>
          <p className="text-muted-foreground">Analyzing project preferences...</p>
        </CardContent>
      </Card>
    );
  }

  const userLikedSectors = [...new Set(userProjects.map(p => p.sec).filter(Boolean))];

  const renderTeamStatusBadge = (memberCode: string) => {
    const userTeamInfo = similarUsersTeamInfo[memberCode];
    if (!userTeamInfo) return null;

    if (userTeamInfo.is_lone_wolf) {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
          <UserX className="h-3 w-3 mr-1" />
          Lone Wolf
        </Badge>
      );
    } else {
      const vacancies = userTeamInfo.team_vacancies || 0;
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <Users className="h-3 w-3 mr-1" />
          {vacancies} {vacancies === 1 ? 'vacancy' : 'vacancies'}
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Team Finder
          </h2>
          <p className="text-muted-foreground">Find members with similar project interests</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Input
        </Button>
      </div>

      {/* Your Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Your Profile ({currentUserName})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Your Liked Projects: {userProjects.length}</p>
            <div className="flex flex-wrap gap-1">
              {userProjects.slice(0, 8).map((project) => (
                <Badge key={project.code} variant="secondary" className="text-xs">
                  {project.code}
                </Badge>
              ))}
              {userProjects.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{userProjects.length - 8} more
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Your Focus Sectors:</p>
            <div className="flex flex-wrap gap-1">
              {userLikedSectors.map((sector) => (
                <Badge key={sector} className="text-xs bg-blue-100 text-blue-800">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {teamInfo?.is_lone_wolf ? <UserX className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            Team Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamInfo?.is_lone_wolf ? (
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="font-medium text-amber-800">🐺 Lone Wolf</p>
              <p className="text-sm text-amber-600 mt-1">
                You're exploring projects individually (Team ID: 0000)
              </p>
            </div>
          ) : (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">👥 Team Member</p>
              <p className="text-sm text-green-600 mt-1">
                Team {groupCode} has {teamInfo?.member_count} active members
              </p>
              {teamInfo?.team_vacancies && teamInfo.team_vacancies > 0 && (
                <p className="text-sm text-green-600">
                  {teamInfo.team_vacancies} possible team {teamInfo.team_vacancies === 1 ? 'vacancy' : 'vacancies'}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Similar Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Most Compatible Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {similarUsers.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No similar users found yet.</p>
              <p className="text-sm">As more people use the app, you'll see potential teammates here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {similarUsers.map((user, index) => (
                <div key={user.similar_member_code} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{similarUserNames[user.similar_member_code] || user.similar_member_code}</span>
                      <Badge variant="secondary">
                        {user.common_projects_count} common project{user.common_projects_count !== 1 ? 's' : ''}
                      </Badge>
                      {renderTeamStatusBadge(user.similar_member_code)}
                    </div>
                    <span className="text-sm text-muted-foreground">#{index + 1} match</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Common Projects:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.common_project_codes.slice(0, 6).map((code) => (
                          <Badge key={code} variant="outline" className="text-xs bg-green-50 border-green-200">
                            {code}
                          </Badge>
                        ))}
                        {user.common_project_codes.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.common_project_codes.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {userSectors[user.similar_member_code] && (
                      <div>
                        <p className="text-sm font-medium mb-1">Their Focus Sectors:</p>
                        <div className="flex flex-wrap gap-1">
                          {userSectors[user.similar_member_code].slice(0, 4).map((sector) => (
                            <Badge key={sector} className="text-xs bg-purple-100 text-purple-800">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamFinder;
