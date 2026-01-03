FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["sh", "docker-entrypoint.sh"]
