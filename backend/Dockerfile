FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera os artefatos do Prisma (Cliente)
RUN npx prisma generate

# Expõe a porta onde o Express vai rodar
EXPOSE 3000

# Comando para iniciar o servidor em modo dev
CMD ["npm", "run", "dev"]
