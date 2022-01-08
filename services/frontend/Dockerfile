FROM node:16-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM nginx:1.17-alpine

COPY nginx.conf /etc/nginx/

COPY --from=build /app/build /data/www/

EXPOSE 80

