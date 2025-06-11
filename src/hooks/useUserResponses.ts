
import { useMutation } from '@tanstack/react-query';
import { saveUserResponse, UserResponse } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export const useUserResponses = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (response: Omit<UserResponse, 'id' | 'created_at'>) => 
      saveUserResponse(response),
    onError: (error) => {
      console.error('Failed to save response:', error);
      toast({
        title: "Connection Issue",
        description: "Your response was not saved. Please check your connection.",
        variant: "destructive",
      });
    },
  });
};
