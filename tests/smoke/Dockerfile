FROM node:alpine3.12

WORKDIR /workspace/

COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY upvoteApiClient.js ./
COPY __tests__ ./

ENTRYPOINT ["./entrypoint.sh"]