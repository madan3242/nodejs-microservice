FROM node:20.15.1-alpine3.20

WORKDIR /app/products

ADD package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD [ "npm", "start" ]