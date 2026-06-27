import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const realSquads: Record<string, string[]> = {
  "Brasil": [
    "Alisson", "Ederson", "Bento", "Danilo", "Yan Couto", "Marquinhos", "Éder Militão",
    "Beraldo", "Gabriel Magalhães", "Guilherme Arana", "Wendell", "Bruno Guimarães",
    "João Gomes", "Douglas Luiz", "Lucas Paquetá", "Andreas Pereira", "Ederson (Atalanta)",
    "Vinícius Júnior", "Rodrygo", "Endrick", "Raphinha", "Savinho", "Gabriel Martinelli",
    "Evanilson", "Pepê", "Bremer"
  ],
  "Marrocos": [
    "Yassine Bounou", "Munir El Kajoui", "Achraf Hakimi", "Nayef Aguerd", "Romain Saïss",
    "Noussair Mazraoui", "Sofyan Amrabat", "Azzedine Ounahi", "Hakim Ziyech", "Youssef En-Nesyri",
    "Sofiane Boufal", "Amine Harit", "Brahim Díaz", "Abde Ezzalzouli", "Ayoub El Kaabi"
  ],
  "Escócia": [
    "Angus Gunn", "Andrew Robertson", "Kieran Tierney", "Scott McTominay", "John McGinn",
    "Billy Gilmour", "Che Adams", "Callum McGregor", "Ryan Christie", "Jack Hendry",
    "Grant Hanley", "Scott McKenna", "Stuart Armstrong", "Lyndon Dykes", "Lawrence Shankland"
  ],
  "Haiti": [
    "Johny Placide", "Ricardo Adé", "Frantzdy Pierrot", "Duckens Nazon", "Carlens Arcus",
    "Alex Christian", "Bryan Alceus", "Wilde-Donald Guerrier", "Derrick Etienne",
    "Steeven Saba", "Kevin Lafrance", "Meshack Jérôme", "Garven Metusala", "Danley Jean Jacques", "Carnejy Antoine"
  ],
  "França": [
    "Mike Maignan", "Jules Koundé", "Dayot Upamecano", "William Saliba", "Théo Hernandez",
    "Aurélien Tchouaméni", "Eduardo Camavinga", "N'Golo Kanté", "Antoine Griezmann",
    "Kylian Mbappé", "Ousmane Dembélé", "Marcus Thuram", "Bradley Barcola", "Kingsley Coman", "Adrien Rabiot"
  ],
  "Espanha": [
    "Unai Simón", "Dani Carvajal", "Robin Le Normand", "Aymeric Laporte", "Marc Cucurella",
    "Rodri", "Fabián Ruiz", "Pedri", "Lamine Yamal", "Álvaro Morata", "Nico Williams",
    "Dani Olmo", "Mikel Merino", "Ferran Torres", "Mikel Oyarzabal"
  ]
};

// 42 seleções restantes para totalizar 48
const otherTeams = [
  "Argentina", "Alemanha", "Inglaterra", "Portugal", "Itália", "Holanda", "Croácia", "Bélgica",
  "Uruguai", "Colômbia", "Equador", "Senegal", "Japão", "EUA", "México", "Canadá", "Coreia do Sul",
  "Austrália", "Irã", "Arábia Saudita", "Camarões", "Nigéria", "Egito", "Argélia", "Costa do Marfim",
  "Costa Rica", "Panamá", "Jamaica", "Gales", "Sérvia", "Suíça", "Dinamarca", "Suécia", "Polônia",
  "Peru", "Chile", "Paraguai", "Venezuela", "Bolívia", "Nova Zelândia", "Catar", "Emirados Árabes Unidos"
];

async function main() {
  console.log("Limpando banco de dados...");
  await prisma.equipe_Partida.deleteMany();
  await prisma.partida.deleteMany();
  await prisma.jogador.deleteMany();
  await prisma.equipe.deleteMany();

  console.log("Inserindo equipes e jogadores...");

  const allTeamsData = [
    "Brasil", "Marrocos", "Escócia", "Haiti",
    "França", "Espanha", ...otherTeams
  ];

  const dbEquipes = [];

  for (const teamName of allTeamsData) {
    let jogadores = [];
    
    if (realSquads[teamName]) {
      jogadores = realSquads[teamName].map(nome => ({ nome }));
    } else {
      // 11 jogadores genéricos
      for (let i = 1; i <= 11; i++) {
        jogadores.push({ nome: `Jogador ${i} - ${teamName}` });
      }
    }

    const equipe = await prisma.equipe.create({
      data: {
        nome: teamName,
        jogadores: {
          create: jogadores
        }
      }
    });

    dbEquipes.push(equipe);
  }

  console.log(`Criadas ${dbEquipes.length} equipes!`);

  console.log("Gerando partidas da fase de grupos...");
  
  // Dividir em 12 grupos de 4
  // O grupo A já será os primeiros 4: Brasil, Marrocos, Escócia, Haiti
  const groups = [];
  for (let i = 0; i < 12; i++) {
    groups.push(dbEquipes.slice(i * 4, (i + 1) * 4));
  }

  let partidasCriadas = 0;
  let dataInicial = new Date("2026-06-11T12:00:00Z"); // Data de início fictícia/real da copa

  // Gerar confrontos de todos contra todos dentro do grupo (6 partidas por grupo)
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    
    // Possibilidades de confronto para 4 times: (0,1), (0,2), (0,3), (1,2), (1,3), (2,3)
    const confrontos = [
      [group[0], group[1]],
      [group[2], group[3]],
      [group[0], group[2]],
      [group[1], group[3]],
      [group[0], group[3]],
      [group[1], group[2]],
    ];

    for (const confronto of confrontos) {
      const partida = await prisma.partida.create({
        data: {
          data: new Date(dataInicial),
          equipes: {
            create: [
              { equipeId: confronto[0].id },
              { equipeId: confronto[1].id }
            ]
          }
        }
      });
      partidasCriadas++;
      // Incrementar data/hora para a próxima partida não ser ao mesmo tempo
      dataInicial.setHours(dataInicial.getHours() + 4);
    }
  }

  console.log(`Criadas ${partidasCriadas} partidas na fase de grupos!`);
  console.log("Seed concluído com sucesso!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
