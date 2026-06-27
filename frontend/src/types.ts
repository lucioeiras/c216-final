export interface Jogador {
  id: number;
  nome: string;
  equipeId: number;
}

export interface Equipe {
  id: number;
  nome: string;
  jogadores?: Jogador[];
}

export interface EquipePartida {
  equipeId: number;
  partidaId: number;
  equipe: Equipe;
}

export interface Partida {
  id: number;
  data: string;
  equipes: EquipePartida[];
}
