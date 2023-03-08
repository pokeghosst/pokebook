FROM node:12 AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./
RUN yarn run build

FROM nginx:1.19-alpine
COPY --from=build /app/public /usr/share/nginx/html