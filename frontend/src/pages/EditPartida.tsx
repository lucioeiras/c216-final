import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEquipes, usePartidas, useUpdatePartida } from '../hooks/useDashboardData';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function EditPartida() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: equipes, isLoading: isLoadingEquipes } = useEquipes();
  const { data: partidas } = usePartidas();
  const updatePartida = useUpdatePartida();

  const [equipeA, setEquipeA] = useState<string>('');
  const [equipeB, setEquipeB] = useState<string>('');
  const [dataPartida, setDataPartida] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (partidas && id) {
      const partida = partidas.find(p => p.id === Number(id));
      if (partida) {
        setEquipeA(partida.equipes[0]?.equipeId.toString() || '');
        setEquipeB(partida.equipes[1]?.equipeId.toString() || '');
        
        // Format ISO date string for datetime-local input
        const dateObj = new Date(partida.data);
        // timezone offset adjustment to local
        dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
        setDataPartida(dateObj.toISOString().slice(0, 16));
      }
    }
  }, [partidas, id]);

  const handleSubmit = () => {
    if (!equipeA || !equipeB || !dataPartida) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (equipeA === equipeB) {
      setError('Uma equipe não pode jogar contra ela mesma.');
      return;
    }

    const isoDate = new Date(dataPartida).toISOString();

    updatePartida.mutate(
      {
        id: Number(id),
        data: isoDate,
        equipeIds: [Number(equipeA), Number(equipeB)],
      },
      {
        onSuccess: () => navigate('/'),
        onError: () => setError('Ocorreu um erro ao atualizar a partida.')
      }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        
        <Button variant="ghost" className="w-fit pl-0 mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Editar Partida</CardTitle>
            <CardDescription>Modifique os times e a data desta partida.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Equipe A (Mandante)</Label>
              <Select value={equipeA} onValueChange={setEquipeA} disabled={isLoadingEquipes}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a primeira equipe" />
                </SelectTrigger>
                <SelectContent>
                  {equipes?.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id.toString()}>{eq.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <span className="text-muted-foreground font-bold italic bg-muted px-4 py-1 rounded-full text-sm">VS</span>
            </div>

            <div className="space-y-2">
              <Label>Equipe B (Visitante)</Label>
              <Select value={equipeB} onValueChange={setEquipeB} disabled={isLoadingEquipes}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a segunda equipe" />
                </SelectTrigger>
                <SelectContent>
                  {equipes?.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id.toString()}>{eq.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="data">Data e Horário</Label>
              <Input 
                id="data" 
                type="datetime-local" 
                value={dataPartida}
                onChange={(e) => setDataPartida(e.target.value)}
              />
            </div>

          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSubmit} 
              disabled={updatePartida.isPending}
            >
              {updatePartida.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
