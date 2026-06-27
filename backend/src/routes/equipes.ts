import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// 1. GET /equipes (Lista todas as equipes)
router.get('/', async (req: Request, res: Response) => {
  try {
    const equipes = await prisma.equipe.findMany();
    res.json(equipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar equipes' });
  }
});

// 2. GET /equipes/:id (Detalha uma equipe)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const equipe = await prisma.equipe.findUnique({
      where: { id: Number(id) },
      include: { jogadores: true } // Mostra os jogadores atrelados também
    });

    if (!equipe) {
      res.status(404).json({ error: 'Equipe não encontrada' });
      return;
    }

    res.json(equipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar equipe' });
  }
});

// 3. POST /equipes (Cria uma nova equipe)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    
    if (!nome) {
      res.status(400).json({ error: 'O campo nome é obrigatório' });
      return;
    }

    const novaEquipe = await prisma.equipe.create({
      data: { nome }
    });

    res.status(201).json(novaEquipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar equipe' });
  }
});

// 4. PUT /equipes/:id (Atualiza dados da equipe, ex: nome)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const equipeExistente = await prisma.equipe.findUnique({
      where: { id: Number(id) }
    });

    if (!equipeExistente) {
      res.status(404).json({ error: 'Equipe não encontrada' });
      return;
    }

    const equipeAtualizada = await prisma.equipe.update({
      where: { id: Number(id) },
      data: { nome }
    });

    res.json(equipeAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar equipe' });
  }
});

// 5. DELETE /equipes/:id (Deleta uma equipe)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const equipeExistente = await prisma.equipe.findUnique({
      where: { id: Number(id) }
    });

    if (!equipeExistente) {
      res.status(404).json({ error: 'Equipe não encontrada' });
      return;
    }

    // Deletar jogadores e relacoes de partidas primeiro (cascade simulado ou via schema)
    // No nosso schema não adicionamos onDelete: Cascade, então precisamos limpar manualmente
    await prisma.equipe_Partida.deleteMany({ where: { equipeId: Number(id) } });
    await prisma.jogador.deleteMany({ where: { equipeId: Number(id) } });

    await prisma.equipe.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Equipe deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar equipe' });
  }
});

export default router;
