FROM node:20 AS builder

USER node

WORKDIR /app

COPY package*.json .
COPY ./.env.production ./.env

RUN npm ci --ignore-scripts

COPY --chown=node:node . .

RUN npm run prisma:push \
  && npm run build

EXPOSE 3000

CMD ["node", "dist/main"]


