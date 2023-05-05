# Build AdonisJS
FROM node:16-alpine as builder
# Set directory for all files
WORKDIR /home/node/app
# Copy over package.json files
COPY package*.json ./
# Install all packages
RUN npm install
# Copy over source code
COPY . .
# Build AdonisJS for production
RUN npm run build --production

# Build final runtime container
FROM node:16-alpine
# Set environment variables
ENV NODE_ENV=production
# Set home dir
WORKDIR /home/node/app
# Copy over built files
COPY --from=builder /home/node/app/build .
# Install only required packages
RUN yarn install --production
# Expose port to outside world
EXPOSE 3333
# Start server up
CMD [ "node", "server.js" ]