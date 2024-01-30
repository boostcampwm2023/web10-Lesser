FROM nginx

RUN rm -rf /etc/nginx/conf.d

COPY conf /etc/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]