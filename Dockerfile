# Build AdonisJS
FROM node:21-alpine as builder

# Set directory for all files
WORKDIR /home/node/app

# Copy over source code
COPY . .

# Install all packages
RUN npm install

# Build AdonisJS for production
RUN node ace build --production
RUN cp package*.json ./build
RUN cd build && npm ci --omit=dev

# Build final runtime container
FROM node:21-alpine
# Set environment variables
ENV NODE_ENV=production

# Set timezone
ENV TZ=Europe/Rome

# Set home dir
WORKDIR /home/node/app
# Copy over built files
COPY --from=builder /home/node/app/build .

# Expose port to outside world
EXPOSE 3333
# Start server up
CMD [ "node", "server.js" ]
