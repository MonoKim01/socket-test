FROM node:16

WORKDIR /usr/src/app

COPY ./ ./

RUN npm i

EXPOSE 3000

CMD ["node", "server.js"]