FROM node:22-alpine as base

RUN npm i -g @nestjs/cli

RUN npm i -g npm@latest

USER node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

FROM base as app

ENTRYPOINT ["npm", "run", "start:dev"]