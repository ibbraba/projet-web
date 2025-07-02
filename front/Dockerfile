# ---------- Stage 1: Build React app ----------
FROM node:22.1 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:stable-alpine

# Copy the built React app to Nginx's default HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
