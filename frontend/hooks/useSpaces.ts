import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { spacesApi } from '@/lib/api';
import { CreateSpaceDTO, Space, UpdateSpaceDTO } from '@/types/space';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';


export const SPACES_QUERY_KEY = ['spaces'] as const;

export function useSpaces() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  const accessToken = session?.accessToken ?? '';

  const query = useQuery<Space[],Error>({
    queryKey: SPACES_QUERY_KEY,
    queryFn: async () => {
      const data = await spacesApi.getSpaces(
        accessToken, 
        session?.user?.userId ?? '', 
        session?.user?.email ?? ''
      );
      return data;
    },
    enabled: !!accessToken,
  });
  

  const createMutation = useMutation({
    mutationFn: (newSpace: CreateSpaceDTO) => 
      spacesApi.createSpace(newSpace, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY });
      toast.success('Space created successfully');
    },
    onError: (error) => {
        toast.error('Failed to create space ! Try Again');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ spaceId, updates }: { spaceId: string; updates: UpdateSpaceDTO }) =>
      spacesApi.updateSpace(spaceId, updates, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY });
      toast.success('Space updated !');
    },
    onError: (error) => {
        toast.error('Failed to update space ! Try Again');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (spaceId: string) => 
      spacesApi.deleteSpace(spaceId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY });
      toast.success('Deleted Space !');
    },
    onError: (error) => {
        toast.error('Failed to delete space ! Try Again');
    },
  });

  return {
    spaces: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createSpace: createMutation.mutate,
    updateSpace: updateMutation.mutate,
    deleteSpace: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
