# Build and push new container to DockerHub repository
docker buildx build --push --platform linux/amd64,linux/arm64 -t c0c4i/treninoo-api:$1 .
