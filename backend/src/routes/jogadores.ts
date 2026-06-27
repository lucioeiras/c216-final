import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// 1. GET /jogadores (Lista todos os jogadores)
router.get('/', async (req: Request, res: Response) => {
  try {
    const jogadores = await prisma.jogador.findMany({
      include: { equipe: true }
    });
    res.json(jogadores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
});

// 2. GET /jogadores/:id (Detalha um jogador)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const jogador = await prisma.jogador.findUnique({
      where: { id: Number(id) },
      include: { equipe: true }
    });

    if (!jogador) {
      res.status(404).json({ error: 'Jogador não encontrado' });
      return;
    }

    res.json(jogador);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar jogador' });
  }
});

// 3. POST /jogadores (Cria um novo jogador)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, equipeId } = req.body;
    
    if (!nome || !equipeId) {
      res.status(400).json({ error: 'Os campos nome e equipeId são obrigatórios' });
      return;
    }

    const equipeExistente = await prisma.equipe.findUnique({
      where: { id: Number(equipeId) }
    });

    if (!equipeExistente) {
      res.status(404).json({ error: 'Equipe fornecida não encontrada' });
      return;
    }

    const novoJogador = await prisma.jogador.create({
      data: { 
        nome,
        equipeId: Number(equipeId)
      },
      include: { equipe: true }
    });

    res.status(201).json(novoJogador);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar jogador' });
  }
});

// 4. PUT /jogadores/:id (Atualiza dados do jogador)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, equipeId } = req.body;

    const jogadorExistente = await prisma.jogador.findUnique({
      where: { id: Number(id) }
    });

    if (!jogadorExistente) {
      res.status(404).json({ error: 'Jogador não encontrado' });
      return;
    }

    if (equipeId) {
      const equipeExistente = await prisma.equipe.findUnique({
        where: { id: Number(equipeId) }
      });
      if (!equipeExistente) {
        res.status(404).json({ error: 'Nova equipe fornecida não encontrada' });
        return;
      }
    }

    const jogadorAtualizado = await prisma.jogador.update({
      where: { id: Number(id) },
      data: { 
        nome: nome !== undefined ? nome : jogadorExistente.nome,
        equipeId: equipeId !== undefined ? Number(equipeId) : jogadorExistente.equipeId
      },
      include: { equipe: true }
    });

    res.json(jogadorAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar jogador' });
  }
});

// 5. DELETE /jogadores/:id (Deleta um jogador)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const jogadorExistente = await prisma.jogador.findUnique({
      where: { id: Number(id) }
    });

    if (!jogadorExistente) {
      res.status(404).json({ error: 'Jogador não encontrado' });
      return;
    }

    await prisma.jogador.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Jogador deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar jogador' });
  }
});

export default router;
