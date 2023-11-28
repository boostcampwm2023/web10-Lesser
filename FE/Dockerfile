# 1. Builder Stage
FROM node:20.9.0 as builder

ARG VITE_NEST_API_URL
ARG VITE_GITHUB_OAUTH_URL
ARG VITE_GITHUB_CLIENT_ID

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json

RUN npm install

COPY . /usr/src/app

RUN VITE_NEST_API_URL=$VITE_NEST_API_URL \
    VITE_GITHUB_OAUTH_URL=$VITE_GITHUB_OAUTH_URL \
    VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID \
    npm run build

# 2. Nginx Stage
FROM nginx

RUN rm -rf /etc/nginx/conf.d

COPY conf /etc/nginx

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]