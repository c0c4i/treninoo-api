# We'll use the Node slim image as a base cos it's light and nice
FROM node:14

WORKDIR /api/treninoo

COPY ./build .

COPY .env .env

RUN npm ci --production
RUN npm install --no-optional

EXPOSE 3333

CMD node server.js