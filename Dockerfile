FROM node:20-slim

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN npm i

COPY . .
CMD [ "npm", "run", "prod" ]