FROM node:20.9.0 as builder

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./app/package.json ./
COPY ./app/tsconfig.json ./

RUN npm install

COPY . /usr/src/app

EXPOSE 8000

CMD ["npm", "run", "start"]
