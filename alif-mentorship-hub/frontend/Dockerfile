# Stage 1: Build the React app
FROM node:20-alpine as build

WORKDIR /app

# Copy package files first for better caching
# If package.json doesn't change, npm install layer is reused
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
# Multi-stage build keeps final image small
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config needed for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

