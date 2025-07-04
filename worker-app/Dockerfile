FROM node:22.16-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm prisma migrate dev --name init 
RUN npm run build


CMD ["npm", "run", "start:prod"]

