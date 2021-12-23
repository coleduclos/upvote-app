#!/bin/sh

if [ -z "${AWS_ACCESS_KEY_ID}" ]; then
    echo "Please set the AWS_ACCESS_KEY_ID environment variable."
    # exit 1
fi

if [ -z "${AWS_SECRET_ACCESS_KEY}" ]; then
    echo "Please set the AWS_SECRET_ACCESS_KEY environment variable."
    # exit 1
fi

if [ -z "${COGNITO_CLIENT_ID}" ]; then
    echo "ERROR! Please set the COGNITO_CLIENT_ID environment variable."
    exit 1
fi

if [ -z "${COGNITO_USER_POOL_ID}" ]; then
    echo "ERROR! Please set the COGNITO_USER_POOL_ID environment variable."
    exit 1
fi

if [ -z "${TEST_API_ENDPOINT}" ]; then
    echo "ERROR! Please set the TEST_API_ENDPOINT environment variable."
    exit 1
fi

if [ -z "${TEST_USERNAME}" ]; then
    echo "ERROR! Please set the TEST_USERNAME environment variable."
    exit 1
fi

if [ -z "${TEST_PASSWORD}" ]; then
    echo "ERROR! Please set the TEST_PASSWORD environment variable."
    exit 1
fi

npm test