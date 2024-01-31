FROM nginx

RUN rm -rf /etc/nginx/conf.d

COPY conf /etc/nginx

COPY /src /usr/share/nginx/html

EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]