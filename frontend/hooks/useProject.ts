import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createProject, getProjectById } from '@/services/projectServices';

export const useCreateProject = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; domain: string; orgId: string }) => {
      const token = await getToken();
      return createProject(data, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });
};

export const useGetProjectById = (id: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const token = await getToken();
      return getProjectById(id, token!);
    },
    enabled: !!id,
  });
};