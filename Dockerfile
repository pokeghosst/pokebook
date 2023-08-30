FROM node:12 AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./
RUN yarn run static

FROM nginx:1.25.2-alpine
COPY --from=build /app/public /usr/share/nginx/html