# 🏆 Gerenciador da Copa 2026

Projeto fullstack construído como parte da disciplina C216 (Inatel), desenhado para o gerenciamento de seleções, escalações de jogadores e chaveamento de partidas da Copa do Mundo.

O sistema adota uma arquitetura moderna dividida entre uma API RESTful robusta e um cliente React de alta reatividade.

---

## 🚀 Tecnologias e Stack

### Backend (API)
- **Node.js + Express:** Servidor web rápido e minimalista.
- **Prisma (v7+):** ORM tipado para interação com o banco de dados.
- **PostgreSQL:** Banco de dados relacional (rodando via Docker).
- **TypeScript:** Tipagem estática para garantir a segurança e previsibilidade do código.

### Frontend (Interface)
- **React + Vite:** Construção ultrarrápida com Hot Module Replacement (HMR).
- **Tailwind CSS v4:** Motor de estilos focado em CSS moderno (`@theme`).
- **Shadcn UI:** Coleção de componentes acessíveis baseados em Radix UI (Cards, Dialogs, Select, ScrollArea).
- **TanStack Query (React Query):** Gerenciamento de estado assíncrono, garantindo cache, revalidações e mutações fluídas sem recarregamentos da página.
- **Axios:** Cliente HTTP para comunicação com a API.
- **React Router:** Navegação e roteamento Client-Side (SPA).

---

## ⚙️ Como Executar o Projeto

O projeto foi totalmente dockerizado para garantir que o ambiente seja idêntico e consistente para todos os desenvolvedores.

### 1. Pré-requisitos
- Ter o **Docker** e o **Docker Compose** instalados na sua máquina.
- **Node.js** (Opcional, mas recomendado caso queira instalar bibliotecas e rodar scripts isoladamente).

### 2. Subindo os contêineres
Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:

```bash
docker-compose up -d
```
> Isso irá baixar as imagens necessárias e subir os 3 serviços em segundo plano: O banco de dados PostgreSQL, a API (Backend) e a Interface (Frontend).

### 3. Acessando a Aplicação
Após o Docker sinalizar que os contêineres estão rodando, acesse no seu navegador:

- **Frontend (Painel de Controle):** [http://localhost:5173](http://localhost:5173)
- **Backend (API):** [http://localhost:3000](http://localhost:3000)

### 4. Populando o Banco (Opcional)
Se precisar reiniciar o banco ou aplicar as migrações mais recentes do Prisma (caso desenvolva localmente):
```bash
cd backend
npx prisma db push
```

---

## 🏗️ Boas Práticas Adotadas

Durante o desenvolvimento deste sistema, focamos em manter o código limpo, escalável e seguro. Algumas das práticas adotadas incluem:

1. **Separação de Responsabilidades (Frontend):**
   - **Hooks Customizados (`src/hooks/`):** Toda a lógica de comunicação com a API e manipulação de cache do React Query foi isolada. Os componentes de visualização (`Dashboard`, `EquipeDetails`) não conhecem o Axios, apenas interagem com os hooks (`useEquipes`, `useCreatePartida`, etc).
   - **Componentes Reutilizáveis:** Toda a base visual está em `src/components/ui`, centralizando a identidade visual (Shadcn UI).

2. **Tipagem e Interfaces (End-to-end):**
   - A criação do arquivo genérico `types.ts` no frontend garante que as interfaces consumidas reflitam exatamente os modelos gerados pelo Prisma no backend. Isso anula erros de referências nulas e "Undefined".

3. **Arquitetura REST (Backend):**
   - As rotas express estão divididas por contexto semântico (`/routes/equipes.ts`, `/routes/jogadores.ts`, `/routes/partidas.ts`).
   - Todos os retornos obedecem status codes padronizados (200 para sucesso, 201 para criações, 404 para não encontrados e 500 para erros no servidor).

4. **Tratamento de CORS e Segurança:**
   - O backend possui middleware nativo `cors()` para gerenciar requisições da mesma origem, prevenindo bloqueios indesejados durante as trocas de porta `5173` <-> `3000`.

5. **Design System Moderno:**
   - Adotamos a abordagem utilitária (Tailwind CSS).
   - O modo noturno (`dark mode`) é utilizado como primário para manter o foco nos dados. Skeleton Loaders substituem tradicionais "spinners" de carregamento, oferecendo percepção de velocidade (Performance Percebida).

---

## 🛠️ Comandos Úteis de Manutenção

- Para desligar todos os contêineres:
  ```bash
  docker-compose down
  ```
- Para adicionar um novo componente Shadcn no Frontend:
  ```bash
  cd frontend
  npx shadcn@latest add <nome_do_componente>
  ```
- Para sincronizar novos modelos do Prisma:
  ```bash
  cd backend
  npx prisma generate
  ```
