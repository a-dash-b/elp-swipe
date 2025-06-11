
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchSectors } from '@/lib/database';

// Sample data as fallback
const sampleProjects = [
  {
    id: 1,
    code: "PROJ001",
    description: "Develop an intelligent chatbot using natural language processing to handle customer inquiries and support tickets automatically. This system will integrate with existing CRM platforms and provide 24/7 customer support.",
    sec: "Technology",
    cat: "AI & Machine Learning"
  },
  {
    id: 2,
    code: "PROJ002", 
    description: "Create a blockchain-based platform to track and verify sustainable practices throughout the supply chain process. This will help companies ensure ethical sourcing and reduce environmental impact.",
    sec: "Technology",
    cat: "Blockchain"
  },
  {
    id: 3,
    code: "PROJ003",
    description: "Build a comprehensive analytics platform to track student engagement and performance in remote learning environments. The system will provide real-time insights for educators.",
    sec: "Education",
    cat: "Analytics"
  },
  {
    id: 4,
    code: "PROJ004",
    description: "Develop an interactive tool for healthcare professionals to visualize patient data and treatment outcomes. This will improve decision-making and patient care quality.",
    sec: "Healthcare",
    cat: "Data Visualization"
  },
  {
    id: 5,
    code: "PROJ005",
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
    // Use sample data as fallback on error
    onError: (error) => {
      console.error('Error fetching projects:', error);
    },
  });
};

export const useSectors = () => {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: fetchSectors,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    // Use sample sectors as fallback on error
    onError: (error) => {
      console.error('Error fetching sectors:', error);
    },
  });
};

// Hook to get projects with sample data fallback
export const useProjectsWithFallback = () => {
  const { data, error, isLoading, isError } = useProjects();
  
  // Return sample data if there's an error or no data
  const projects = isError || !data?.length ? sampleProjects : data;
  
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
  
  // Return sample sectors if there's an error or no data
  const sectors = isError || !data?.length ? sampleSectors : data;
  
  return {
    data: sectors,
    isLoading,
    isError,
    error
  };
};
