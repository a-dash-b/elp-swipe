
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id?: number;
  code: string;
  description: string;
  sec: string;
  cat: string;
}

export interface UserResponse {
  id?: number;
  group_code: string;
  member_code: string;
  project_code: string;
  response: number; // 1 for like, 0 for pass
  created_at?: string;
}

// Fetch all projects from the new proj table
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('proj')
    .select('*')
    .order('id');

  if (error) throw error;
  return data || [];
};

// Fetch unique sectors from the new proj table
export const fetchSectors = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('proj')
    .select('sec')
    .not('sec', 'is', null)
    .neq('sec', '')
    .order('sec');

  if (error) throw error;
  
  console.log('Raw sectors data from proj table:', data);
  
  // Extract unique sectors and filter out any null/undefined/empty values
  const uniqueSectors = [...new Set(
    data?.map(item => item.sec)
      .filter(sec => sec && sec.trim().length > 0) || []
  )];
  
  console.log('Processed unique sectors:', uniqueSectors);
  
  return uniqueSectors;
};

// Save user response
export const saveUserResponse = async (response: Omit<UserResponse, 'id' | 'created_at'>): Promise<void> => {
  const { error } = await supabase
    .from('user_responses')
    .insert([response]);

  if (error) throw error;
};

// Check database connection
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('proj')
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
    .from('proj')
    .insert(projects);

  if (error) throw error;
};
