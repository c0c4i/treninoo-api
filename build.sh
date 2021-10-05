rm -rf ./build
yarn build
cd build
cp ../.env ./.env
yarn install --production
node server.js
