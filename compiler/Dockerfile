FROM node:22-alpine
WORKDIR /app

RUN apk update && apk add --no-cache g++ openjdk17-jdk python3 py3-pip

COPY . .

COPY package*.json ./
RUN npm install

EXPOSE 8000

CMD ["node", "index.js"]