FROM node:20.9.0

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY . /usr/src/app

EXPOSE 8000

CMD ["npm", "run", "start"]
