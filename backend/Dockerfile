FROM node:20.9.0-alpine

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]