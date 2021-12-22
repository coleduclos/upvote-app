#!/bin/sh

if [ -z "${DOCKER_IMAGE_TAG}" ]; then
    DOCKER_IMAGE_TAG="test"
    echo "DOCKER_IMAGE_TAG environment variable is not set. Setting to default: $DOCKER_IMAGE_TAG"
fi

APPLICATION_NAME="upvote-smoke-tests"
DOCKER_CONTAINER_NAME="${APPLICATION_NAME}_${DOCKER_IMAGE_TAG}"
DOCKER_IMAGE_NAME="${APPLICATION_NAME}:${DOCKER_IMAGE_TAG}"

# Stop and remove any running Docker containers with the same name
docker rm -f ${DOCKER_CONTAINER_NAME}

echo "Running Docker image: ${DOCKER_IMAGE_NAME}"
docker run \
    --env AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
    --env AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
    --env COGNITO_CLIENT_ID="${COGNITO_CLIENT_ID}" \
    --env COGNITO_USER_POOL_ID="${COGNITO_USER_POOL_ID}" \
    --env TEST_API_ENDPOINT="${TEST_API_ENDPOINT}" \
    --env TEST_USERNAME="${TEST_USERNAME}" \
    --env TEST_PASSWORD="${TEST_PASSWORD}" \
    ${DOCKER_IMAGE_NAME}

   