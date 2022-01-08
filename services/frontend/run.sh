#!/bin/sh

DOCKER_CONTAINER_NAME=upvote-frontend
DOCKER_IMAGE_NAME=coleduclos/upvote-frontend:test

print_usage () {
    echo "Usage:"
    echo "./run.sh -i <docker image name> <docker args>"
}

while getopts ":hi:" opt; do
    case "${opt}" in
        h)
            print_usage
            exit 0
            ;;
        i)
            DOCKER_IMAGE_NAME=${OPTARG}
            ;;
        \? )
            echo "Invalid Option: -$OPTARG" 1>&2
            print_usage
            exit 1
            ;;
    esac
done

shift "$((OPTIND-1))"

# Stop and remove any running Docker containers with the same name
docker kill ${DOCKER_CONTAINER_NAME}
docker rm ${DOCKER_CONTAINER_NAME}

CONTAINER_PORT=80
HOST_PORT=80

docker run -d -p ${CONTAINER_PORT}:${HOST_PORT} \
    --name "${DOCKER_CONTAINER_NAME}" \
    $DOCKER_IMAGE_NAME \
    $@