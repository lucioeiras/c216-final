import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import type { Equipe, Partida } from '../types';

export const useEquipes = () => {
  return useQuery({
    queryKey: ['equipes'],
    queryFn: async (): Promise<Equipe[]> => {
      const response = await apiClient.get('/equipes');
      return response.data;
    },
  });
};

export const usePartidas = () => {
  return useQuery({
    queryKey: ['partidas'],
    queryFn: async (): Promise<Partida[]> => {
      const response = await apiClient.get('/partidas');
      return response.data;
    },
  });
};

export const useCreatePartida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { data: string; equipeIds: number[] }) => {
      const response = await apiClient.post('/partidas', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
    }
  });
};

export const useUpdatePartida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; data: string; equipeIds: number[] }) => {
      const response = await apiClient.put(`/partidas/${data.id}`, { data: data.data, equipeIds: data.equipeIds });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
    }
  });
};

export const useDeletePartida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/partidas/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
    }
  });
};
