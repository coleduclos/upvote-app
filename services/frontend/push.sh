#!/bin/sh

if [ -z "$ARTIFACT_S3_BUCKET" ]; then
    echo "Please set the ARTIFACT_S3_BUCKET environment variable."
    exit 1
fi

if [ -z "$ARTIFACT_S3_VERSION" ]; then
    ARTIFACT_S3_VERSION="test"
    echo "WARNING: ARTIFACT_S3_VERSION environment variable is not set. Using default: ${ARTIFACT_S3_VERSION}."
fi

SERVICE_NAME=$(basename $(pwd))
ARTIFACT_FILE_NAME="${SERVICE_NAME}.zip"
ARTIFACT_S3_KEY=artifacts/${ARTIFACT_S3_VERSION}/${ARTIFACT_FILE_NAME}

if [ ! -f $ARTIFACT_FILE_NAME ]; then
    echo "ERROR: Could not find ${ARTIFACT_FILE_NAME}. Exiting..."
    exit 1
fi

aws s3 cp ${ARTIFACT_FILE_NAME} s3://${ARTIFACT_S3_BUCKET}/${ARTIFACT_S3_KEY}

if [ ! "$?" -eq 0 ]; then
    echo "ERROR: Could not upload to S3. Exiting..."
    exit 1
fi