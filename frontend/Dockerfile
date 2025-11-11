FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the production-ready static files
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy the built files from stage 1 into nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom nginx configuration (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]