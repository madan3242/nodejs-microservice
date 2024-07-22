FROM node:20.15.1-alpine3.20

WORKDIR /app/customers

ADD package.json .

RUN npm install

COPY . .

EXPOSE 8002

CMD [ "npm", "start" ]