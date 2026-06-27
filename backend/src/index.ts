import express, { Request, Response } from "express";
import { prisma } from "./db";
import equipesRouter from "./routes/equipes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("O Backend está rodando!");
});

app.use("/equipes", equipesRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port} 🔥`);
});
