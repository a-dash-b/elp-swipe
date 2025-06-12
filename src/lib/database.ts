import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id?: number;
  code: string;
  description: string;
  sec: string;
  cat: string;
  title: string;
}

export interface UserResponse {
  id?: number;
  group_code: string;
  member_code: string;
  project_code: string;
  response: number; // 1 for like, 0 for pass
  created_at?: string;
}

export interface SimilarUser {
  similar_member_code: string;
  common_projects_count: number;
  common_project_codes: string[];
}

export interface TeamInfo {
  member_count: number;
  is_lone_wolf: boolean;
  team_vacancies?: number;
}

// Fetch all projects from the new proj2 table
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('proj2')
    .select('*')
    .order('id');

  if (error) throw error;
  return data || [];
};

// Fetch unique sectors from the new proj2 table
export const fetchSectors = async (): Promise<string[]> => {
  console.log('Fetching sectors from proj2 table...');
  
  try {
    // First test basic connection
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('proj2')
      .select('count')
      .limit(1);
    
    console.log('Connection test result:', { testData, testError });
    
    // If basic connection fails, throw early
    if (testError) {
      console.error('Basic connection failed:', testError);
      throw new Error(`Connection failed: ${testError.message}`);
    }
    
    // Now try the actual sectors query
    console.log('Connection successful, fetching sectors...');
    const { data, error } = await supabase
      .from('proj2')
      .select('sec')
      .not('sec', 'is', null)
      .neq('sec', '')
      .order('sec');

    console.log('Sectors query result:', { data, error });

    if (error) {
      console.error('Error fetching sectors:', error);
      throw new Error(`Sectors query failed: ${error.message}`);
    }
    
    if (!data) {
      console.log('No data returned from sectors query');
      return [];
    }
    
    console.log('Raw sectors data from proj2 table:', data);
    
    // Extract unique sectors and filter out any null/undefined/empty values
    const uniqueSectors = [...new Set(
      data.map(item => item.sec)
        .filter(sec => sec && typeof sec === 'string' && sec.trim().length > 0)
        .map(sec => sec.trim())
    )];
    
    console.log('Processed unique sectors:', uniqueSectors);
    console.log('Total unique sectors found:', uniqueSectors.length);
    
    return uniqueSectors;
  } catch (error) {
    console.error('fetchSectors error:', error);
    throw error;
  }
};

// Save user response to the responses table
export const saveUserResponse = async (response: Omit<UserResponse, 'id' | 'created_at'>): Promise<void> => {
  const { error } = await supabase
    .from('responses')
    .insert([response]);

  if (error) throw error;
};

// Check database connection
export const checkConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking database connection...');
    const { data, error } = await supabase
      .from('proj2')
      .select('count')
      .limit(1);
    
    console.log('Connection check result:', { data, error, success: !error });
    return !error;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
};

// Bulk insert projects from CSV data
export const insertProjectsFromCSV = async (projects: Omit<Project, 'id'>[]): Promise<void> => {
  const { error } = await supabase
    .from('proj2')
    .insert(projects);

  if (error) throw error;
};

// Check if user has completed their selections
export const checkUserCompletion = async (groupCode: string, memberCode: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('user_has_completed_selections', {
      p_group_code: groupCode,
      p_member_code: memberCode
    });

    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error checking user completion:', error);
    return false;
  }
};

// Get user's liked projects for Team Finder
export const getUserLikedProjects = async (memberCode: string): Promise<Project[]> => {
  try {
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('project_code')
      .eq('member_code', memberCode)
      .eq('response', 1);

    if (responsesError) throw responsesError;

    if (!responses || responses.length === 0) return [];

    const projectCodes = responses.map(r => r.project_code);
    
    const { data: projects, error: projectsError } = await supabase
      .from('proj2')
      .select('*')
      .in('code', projectCodes);

    if (projectsError) throw projectsError;
    return projects || [];
  } catch (error) {
    console.error('Error fetching user liked projects:', error);
    return [];
  }
};

// Find similar users based on common project preferences
export const findSimilarUsers = async (memberCode: string, limit: number = 10): Promise<SimilarUser[]> => {
  try {
    const { data, error } = await supabase.rpc('find_similar_users', {
      p_member_code: memberCode,
      p_limit: limit
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error finding similar users:', error);
    return [];
  }
};

// Get team information
export const getTeamInfo = async (groupCode: string): Promise<TeamInfo> => {
  try {
    const isLoneWolf = groupCode === '0000';
    
    if (isLoneWolf) {
      return {
        member_count: 1,
        is_lone_wolf: true
      };
    }

    const { data, error } = await supabase.rpc('get_team_member_count', {
      p_group_code: groupCode
    });

    if (error) throw error;
    
    const memberCount = data || 0;
    const maxTeamSize = 4; // Assuming max team size is 4
    const teamVacancies = Math.max(0, maxTeamSize - memberCount);

    return {
      member_count: memberCount,
      is_lone_wolf: false,
      team_vacancies: teamVacancies
    };
  } catch (error) {
    console.error('Error getting team info:', error);
    return {
      member_count: 0,
      is_lone_wolf: false,
      team_vacancies: 0
    };
  }
};

// Get sectors for similar users
export const getSimilarUserSectors = async (memberCodes: string[]): Promise<Record<string, string[]>> => {
  try {
    if (memberCodes.length === 0) return {};

    const { data, error } = await supabase
      .from('responses')
      .select(`
        member_code,
        proj2!inner(sec)
      `)
      .in('member_code', memberCodes)
      .eq('response', 1);

    if (error) throw error;

    const sectorsByUser: Record<string, string[]> = {};
    
    data?.forEach((response: any) => {
      const memberCode = response.member_code;
      const sector = response.proj2?.sec;
      
      if (sector) {
        if (!sectorsByUser[memberCode]) {
          sectorsByUser[memberCode] = [];
        }
        if (!sectorsByUser[memberCode].includes(sector)) {
          sectorsByUser[memberCode].push(sector);
        }
      }
    });

    return sectorsByUser;
  } catch (error) {
    console.error('Error getting similar user sectors:', error);
    return {};
  }
};
