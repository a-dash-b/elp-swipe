
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PROJECT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

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

// Fetch all projects with error handling
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id');

  if (error) throw error;
  return data || [];
};

// Fetch unique sectors for filtering
export const fetchSectors = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('sec')
    .order('sec');

  if (error) throw error;
  
  // Extract unique sectors
  const uniqueSectors = [...new Set(data?.map(item => item.sec) || [])];
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
      .from('projects')
      .select('count')
      .limit(1);
    
    return !error;
  } catch {
    return false;
  }
};
