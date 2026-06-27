import { useQuery } from '@tanstack/react-query';
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
