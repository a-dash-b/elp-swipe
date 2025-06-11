
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// Fetch all projects with error handling and retry logic
export const fetchProjects = async (retryCount = 0): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    
    // Retry logic with exponential backoff (max 3 retries)
    if (retryCount < 3) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return fetchProjects(retryCount + 1);
    }
    
    // Return empty array on final failure - component will use sample data
    throw error;
  }
};

// Fetch unique sectors for filtering
export const fetchSectors = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('sec')
      .order('sec');

    if (error) throw error;
    
    // Extract unique sectors
    const uniqueSectors = [...new Set(data?.map(item => item.sec) || [])];
    return uniqueSectors;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

// Save user response
export const saveUserResponse = async (response: Omit<UserResponse, 'id' | 'created_at'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_responses')
      .insert([response]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving user response:', error);
    throw error;
  }
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
