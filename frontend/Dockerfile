FROM node:18-alpine AS build

WORKDIR /app

# Accept build argument
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./

RUN npm install

COPY . .

# Build with the environment variable
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy the built files from stage 1 into nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]