
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
  
  const { data, error } = await supabase
    .from('proj2')
    .select('sec')
    .not('sec', 'is', null)
    .neq('sec', '')
    .order('sec');

  console.log('Sectors query result:', { data, error });

  if (error) {
    console.error('Error fetching sectors:', error);
    throw error;
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
    const { error } = await supabase
      .from('proj2')
      .select('count')
      .limit(1);
    
    return !error;
  } catch {
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
