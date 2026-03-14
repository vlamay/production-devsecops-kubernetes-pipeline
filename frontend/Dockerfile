# STAGE 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2: Production Server
# ... (after the build stage)
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
# This MUST be exactly this path:
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
