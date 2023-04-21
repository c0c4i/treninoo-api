# Build and tag containers
docker build --platform linux/amd64 -t treninoo-api:$1 .
docker tag treninoo-api:$1 c0c4i/treninoo-api:$1

# Push new container to DockerHub repository
# docker push c0c4i/treninoo-api:$1