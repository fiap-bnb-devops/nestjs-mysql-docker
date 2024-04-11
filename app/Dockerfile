FROM node:20 AS builder

USER node

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY --chown=node:node . .

RUN npm run prisma:gen \
  && npm run build

EXPOSE 3000

CMD ["node", "dist/main"]


