FROM node:20.9.0-alpine

WORKDIR /usr/src/app

COPY package* .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]