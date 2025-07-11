import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchSectors, checkUserCompletion } from '@/lib/database';

// Sample data as fallback
const sampleProjects = [
  {
    id: 1,
    code: "PROJ001",
    title: "AI Customer Support Chatbot",
    description: "Develop an intelligent chatbot using natural language processing to handle customer inquiries and support tickets automatically. This system will integrate with existing CRM platforms and provide 24/7 customer support.",
    sec: "Technology",
    cat: "AI & Machine Learning"
  },
  {
    id: 2,
    code: "PROJ002",
    title: "Blockchain Supply Chain Tracker", 
    description: "Create a blockchain-based platform to track and verify sustainable practices throughout the supply chain process. This will help companies ensure ethical sourcing and reduce environmental impact.",
    sec: "Technology",
    cat: "Blockchain"
  },
  {
    id: 3,
    code: "PROJ003",
    title: "Student Engagement Analytics Platform",
    description: "Build a comprehensive analytics platform to track student engagement and performance in remote learning environments. The system will provide real-time insights for educators.",
    sec: "Education",
    cat: "Analytics"
  },
  {
    id: 4,
    code: "PROJ004",
    title: "Healthcare Data Visualization Tool",
    description: "Develop an interactive tool for healthcare professionals to visualize patient data and treatment outcomes. This will improve decision-making and patient care quality.",
    sec: "Healthcare",
    cat: "Data Visualization"
  },
  {
    id: 5,
    code: "PROJ005",
    title: "Smart City Traffic Optimization",
    description: "Create an IoT-based system to optimize traffic flow and reduce congestion in urban areas using real-time data from sensors and cameras throughout the city.",
    sec: "Transportation",
    cat: "IoT & Smart City"
  }
];

const sampleSectors = ["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Energy", "Transportation", "Real Estate", "Media & Entertainment"];

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useSectors = () => {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: fetchSectors,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('useSectors query failed:', error);
      }
    }
  });
};

// Hook to get projects with sample data fallback
export const useProjectsWithFallback = () => {
  const { data, error, isLoading, isError } = useProjects();
  
  console.log('useProjectsWithFallback:', { 
    dataLength: data?.length, 
    isError, 
    error: error?.message,
    isLoading 
  });
  
  // Only use sample data if there's a genuine connection error, not just empty results
  const shouldUseSampleData = isError && error?.message?.toLowerCase().includes('fetch');
  const projects = shouldUseSampleData ? sampleProjects : (data || []);
  
  if (shouldUseSampleData) {
    console.log('Using sample projects due to connection error');
  }
  
  return {
    data: projects,
    isLoading,
    isError,
    error
  };
};

// Hook to get sectors with sample data fallback
export const useSectorsWithFallback = () => {
  const { data, error, isLoading, isError } = useSectors();
  
  console.log('useSectorsWithFallback:', { 
    dataLength: data?.length, 
    isError, 
    error: error?.message,
    isLoading 
  });
  
  // Only use sample data if there's a genuine connection error, not just empty results
  const shouldUseSampleData = isError && error?.message?.toLowerCase().includes('fetch');
  const sectors = shouldUseSampleData ? sampleSectors : (data || []);
  
  if (shouldUseSampleData) {
    console.log('Using sample sectors due to connection error');
  } else if (data && data.length > 0) {
    console.log('Using real sectors from database:', data);
  } else if (!isLoading) {
    console.log('No sectors found in database, showing empty list');
  }
  
  return {
    data: sectors,
    isLoading,
    isError,
    error
  };
};

// Hook to check if user has completed selections
export const useUserCompletion = (groupCode: string, memberCode: string) => {
  return useQuery({
    queryKey: ['userCompletion', groupCode, memberCode],
    queryFn: () => checkUserCompletion(groupCode, memberCode),
    enabled: !!(groupCode && memberCode), // Only run if both codes are provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
