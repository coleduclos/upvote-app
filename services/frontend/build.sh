#!/bin/sh

BUILD_DIR=./build
SERVICE_NAME=$(basename $(pwd))
ZIP_FILE_NAME="${SERVICE_NAME}.zip"

echo "Installing Node.js dependencies..."
npm install
echo "Building Node.js app..."
npm run build

echo "Zipping app to $ZIP_FILE_NAME..."
zip -r $ZIP_FILE_NAME ${BUILD_DIR}/*