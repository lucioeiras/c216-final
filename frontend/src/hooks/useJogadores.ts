import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import type { Equipe } from '../types';

export const useEquipe = (id: string | undefined) => {
  return useQuery({
    queryKey: ['equipe', id],
    queryFn: async (): Promise<Equipe> => {
      const response = await apiClient.get(`/equipes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateJogador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { nome: string; equipeId: number }) => {
      const response = await apiClient.post('/jogadores', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipe', String(variables.equipeId)] });
    }
  });
};

export const useUpdateJogador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; nome: string; equipeId: number }) => {
      const response = await apiClient.put(`/jogadores/${data.id}`, { nome: data.nome, equipeId: data.equipeId });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipe', String(variables.equipeId)] });
    }
  });
};

export const useDeleteJogador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; equipeId: number }) => {
      const response = await apiClient.delete(`/jogadores/${data.id}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipe', String(variables.equipeId)] });
    }
  });
};
