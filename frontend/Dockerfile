# 1. Builder Stage
FROM node:20.9.0-alpine as builder

WORKDIR /usr/src/app

COPY package* .

RUN npm install

COPY . .

RUN npm run build

# 2. Nginx Stage
FROM nginx

RUN rm -rf /etc/nginx/conf.d

COPY conf /etc/nginx

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]