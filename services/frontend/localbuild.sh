#!/bin/sh

DOCKER_IMAGE_NAME=coleduclos/upvote-frontend:test

print_usage () {
    echo "Usage:"
    echo "./localbuild.sh -i <docker image name>"
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

echo "Executing build.sh..."

echo "Building Docker image: ${DOCKER_IMAGE_NAME}"
docker build -t "${DOCKER_IMAGE_NAME}" .