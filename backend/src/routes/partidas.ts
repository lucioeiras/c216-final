import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// 1. GET /partidas
router.get('/', async (req: Request, res: Response) => {
  try {
    const partidas = await prisma.partida.findMany({
      include: {
        equipes: {
          include: {
            equipe: true
          }
        }
      }
    });
    res.json(partidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar partidas' });
  }
});

// 2. GET /partidas/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const partida = await prisma.partida.findUnique({
      where: { id: Number(id) },
      include: {
        equipes: {
          include: {
            equipe: true
          }
        }
      }
    });

    if (!partida) {
      res.status(404).json({ error: 'Partida não encontrada' });
      return;
    }

    res.json(partida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar partida' });
  }
});

// 3. POST /partidas
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, equipeIds } = req.body;
    
    if (!data || !Array.isArray(equipeIds) || equipeIds.length !== 2) {
      res.status(400).json({ error: 'Os campos data e equipeIds (array com exatamente 2 IDs) são obrigatórios' });
      return;
    }

    const equipesCount = await prisma.equipe.count({
      where: { id: { in: [Number(equipeIds[0]), Number(equipeIds[1])] } }
    });

    if (equipesCount !== 2) {
      res.status(404).json({ error: 'Uma ou ambas as equipes fornecidas não existem' });
      return;
    }

    const novaPartida = await prisma.partida.create({
      data: { 
        data: new Date(data),
        equipes: {
          create: [
            { equipeId: Number(equipeIds[0]) },
            { equipeId: Number(equipeIds[1]) }
          ]
        }
      },
      include: {
        equipes: { include: { equipe: true } }
      }
    });

    res.status(201).json(novaPartida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar partida' });
  }
});

// 4. PUT /partidas/:id
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, equipeIds } = req.body;

    const partidaExistente = await prisma.partida.findUnique({
      where: { id: Number(id) }
    });

    if (!partidaExistente) {
      res.status(404).json({ error: 'Partida não encontrada' });
      return;
    }

    // Se enviou equipeIds, re-faz os vinculos
    if (equipeIds !== undefined) {
      if (!Array.isArray(equipeIds) || equipeIds.length !== 2) {
        res.status(400).json({ error: 'O campo equipeIds deve ser um array com exatamente 2 IDs' });
        return;
      }
      
      const equipesCount = await prisma.equipe.count({
        where: { id: { in: [Number(equipeIds[0]), Number(equipeIds[1])] } }
      });
      
      if (equipesCount !== 2) {
        res.status(404).json({ error: 'Uma ou ambas as novas equipes fornecidas não existem' });
        return;
      }

      // Remove vinculos antigos
      await prisma.equipe_Partida.deleteMany({
        where: { partidaId: Number(id) }
      });
      
      // Adiciona vinculos novos
      await prisma.equipe_Partida.createMany({
        data: [
          { partidaId: Number(id), equipeId: Number(equipeIds[0]) },
          { partidaId: Number(id), equipeId: Number(equipeIds[1]) }
        ]
      });
    }

    const partidaAtualizada = await prisma.partida.update({
      where: { id: Number(id) },
      data: { 
        data: data ? new Date(data) : partidaExistente.data
      },
      include: {
        equipes: { include: { equipe: true } }
      }
    });

    res.json(partidaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar partida' });
  }
});

// 5. DELETE /partidas/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const partidaExistente = await prisma.partida.findUnique({
      where: { id: Number(id) }
    });

    if (!partidaExistente) {
      res.status(404).json({ error: 'Partida não encontrada' });
      return;
    }

    await prisma.equipe_Partida.deleteMany({
      where: { partidaId: Number(id) }
    });

    await prisma.partida.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Partida deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar partida' });
  }
});

export default router;
