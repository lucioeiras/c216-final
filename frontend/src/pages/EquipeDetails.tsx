import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import { useEquipe, useCreateJogador, useUpdateJogador, useDeleteJogador } from '../hooks/useJogadores';
import type { Jogador } from '../types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export function EquipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: equipe, isLoading } = useEquipe(id);
  
  const createJogador = useCreateJogador();
  const updateJogador = useUpdateJogador();
  const deleteJogador = useDeleteJogador();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJogador, setEditingJogador] = useState<Jogador | null>(null);
  const [nomeInput, setNomeInput] = useState('');

  const openCreateModal = () => {
    setEditingJogador(null);
    setNomeInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (jogador: Jogador) => {
    setEditingJogador(jogador);
    setNomeInput(jogador.nome);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!nomeInput.trim() || !id) return;

    if (editingJogador) {
      updateJogador.mutate(
        { id: editingJogador.id, nome: nomeInput, equipeId: Number(id) },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createJogador.mutate(
        { nome: nomeInput, equipeId: Number(id) },
        { onSuccess: () => setIsModalOpen(false) }
      );
    }
  };

  const handleDelete = (jogadorId: number) => {
    if (confirm('Tem certeza que deseja remover este jogador?')) {
      deleteJogador.mutate({ id: jogadorId, equipeId: Number(id) });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-12 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!equipe) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Equipe não encontrada</h2>
        <Button onClick={() => navigate('/')}>Voltar para o Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <Button variant="ghost" className="w-fit pl-0" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">{equipe.nome.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">{equipe.nome}</h1>
                <p className="text-muted-foreground mt-1">
                  {equipe.jogadores?.length || 0} jogadores escalados
                </p>
              </div>
            </div>
            
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Jogador
            </Button>
          </div>
        </div>

        {/* Players Table */}
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome do Jogador</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipe.jogadores && equipe.jogadores.length > 0 ? (
                equipe.jogadores.map((jogador) => (
                  <TableRow key={jogador.id}>
                    <TableCell className="font-medium text-muted-foreground">#{jogador.id}</TableCell>
                    <TableCell className="font-semibold">{jogador.nome}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(jogador)}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(jogador.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Nenhum jogador cadastrado nesta equipe.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingJogador ? 'Editar Jogador' : 'Novo Jogador'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={nomeInput}
                onChange={(e) => setNomeInput(e.target.value)}
                placeholder="Ex: Vinícius Júnior"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleSave} 
              disabled={createJogador.isPending || updateJogador.isPending || !nomeInput.trim()}
            >
              {(createJogador.isPending || updateJogador.isPending) ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
