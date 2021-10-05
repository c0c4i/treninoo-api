Remove-Item -Recurse -Force ./build
yarn build
cd build
cp ../.env ./.env
yarn install --production
node server.js
