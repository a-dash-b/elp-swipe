
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LikedProject {
  code: string;
  title: string;
  description: string;
  sec: string;
  cat: string;
}

export interface MemberResult {
  memberCode: string;
  likedProjects: LikedProject[];
}

export interface IntersectionResult {
  memberCodes: string[];
  projects: LikedProject[];
  count: number;
}

export interface ResultsData {
  groupCode: string;
  memberResults: MemberResult[];
  allIntersections: LikedProject[];
  intersectionsByCount: { [key: number]: IntersectionResult[] };
}

const fetchResultsData = async (groupCode: string, memberCodes: string[]): Promise<ResultsData> => {
  console.log('Fetching results for:', { groupCode, memberCodes });

  // Fetch responses for the group and members
  const { data: responses, error: responsesError } = await supabase
    .from('responses')
    .select('member_code, project_code')
    .eq('group_code', groupCode)
    .in('member_code', memberCodes)
    .eq('response', 1);

  if (responsesError) throw responsesError;

  console.log('Responses fetched:', responses);

  if (!responses || responses.length === 0) {
    return {
      groupCode,
      memberResults: [],
      allIntersections: [],
      intersectionsByCount: {},
    };
  }

  // Get unique project codes
  const projectCodes = [...new Set(responses.map(r => r.project_code))];

  // Fetch project details
  const { data: projects, error: projectsError } = await supabase
    .from('proj2')
    .select('code, title, description, sec, cat')
    .in('code', projectCodes);

  if (projectsError) throw projectsError;

  console.log('Projects fetched:', projects);

  // Create project lookup
  const projectLookup = new Map(projects?.map(p => [p.code, p]) || []);

  // Group responses by member
  const memberResults: MemberResult[] = memberCodes.map(memberCode => {
    const memberResponses = responses.filter(r => r.member_code === memberCode);
    const likedProjects = memberResponses
      .map(r => projectLookup.get(r.project_code))
      .filter(Boolean)
      .map(p => ({
        code: p!.code!,
        title: p!.title || 'Untitled',
        description: p!.description || '',
        sec: p!.sec || '',
        cat: p!.cat || '',
      }));

    return {
      memberCode,
      likedProjects,
    };
  });

  // Calculate intersections
  const allProjectCodes = memberResults.flatMap(m => m.likedProjects.map(p => p.code));
  const projectCounts = new Map<string, number>();
  
  allProjectCodes.forEach(code => {
    projectCounts.set(code, (projectCounts.get(code) || 0) + 1);
  });

  // Find projects liked by all members
  const allIntersections = Array.from(projectCounts.entries())
    .filter(([, count]) => count === memberCodes.length)
    .map(([code]) => projectLookup.get(code))
    .filter(Boolean)
    .map(p => ({
      code: p!.code!,
      title: p!.title || 'Untitled',
      description: p!.description || '',
      sec: p!.sec || '',
      cat: p!.cat || '',
    }));

  // Group intersections by count
  const intersectionsByCount: { [key: number]: IntersectionResult[] } = {};
  
  for (let count = 2; count <= memberCodes.length; count++) {
    const projectsWithCount = Array.from(projectCounts.entries())
      .filter(([, c]) => c === count)
      .map(([code]) => projectLookup.get(code))
      .filter(Boolean)
      .map(p => ({
        code: p!.code!,
        title: p!.title || 'Untitled',
        description: p!.description || '',
        sec: p!.sec || '',
        cat: p!.cat || '',
      }));

    if (projectsWithCount.length > 0) {
      intersectionsByCount[count] = [{
        memberCodes: memberCodes.slice(0, count),
        projects: projectsWithCount,
        count: projectsWithCount.length,
      }];
    }
  }

  console.log('Final results data:', {
    groupCode,
    memberResults,
    allIntersections,
    intersectionsByCount,
  });

  return {
    groupCode,
    memberResults,
    allIntersections,
    intersectionsByCount,
  };
};

export const useResultsData = (groupCode: string, memberCodes: string[]) => {
  return useQuery({
    queryKey: ['results', groupCode, memberCodes],
    queryFn: () => fetchResultsData(groupCode, memberCodes),
    enabled: !!groupCode && memberCodes.length > 0,
  });
};
