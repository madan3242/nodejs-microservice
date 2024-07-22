FROM node:20.15.1-alpine3.20

WORKDIR /app/shopping

ADD package.json .

RUN npm install

COPY . .

EXPOSE 8003

CMD [ "npm", "start" ]