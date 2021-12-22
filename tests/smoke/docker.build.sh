#!/bin/sh

if [ -z "$DOCKER_IMAGE_TAG" ]; then
    DOCKER_IMAGE_TAG="test"
    echo "DOCKER_IMAGE_TAG environment variable is not set. Setting to default: $DOCKER_IMAGE_TAG"
fi

APPLICATION_NAME="upvote-smoke-tests"
DOCKER_IMAGE_NAME="${APPLICATION_NAME}:${DOCKER_IMAGE_TAG}"
echo "Building Docker image: ${DOCKER_IMAGE_NAME}"
docker build -t "${DOCKER_IMAGE_NAME}" ./