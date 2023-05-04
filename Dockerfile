# We'll use the Node slim image as a base cos it's light and nice
FROM node:14

WORKDIR /api/treninoo

COPY . .

RUN yarn install

RUN yarn build

WORKDIR /api/treninoo/build

RUN yarn install --production

COPY .env .env

EXPOSE 3333

CMD node server.js