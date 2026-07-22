# ---- Stage 1: Build ----
FROM node:20-slim AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2: Serve com Nginx ----
FROM nginx:alpine

RUN apk add --no-cache gettext

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/30-envsubst.sh

RUN chmod +x /docker-entrypoint.d/30-envsubst.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]