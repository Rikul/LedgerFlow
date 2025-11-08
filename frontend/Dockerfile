# STAGE 1: Build the Angular app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all other source code and build the app
COPY . .
# Make sure your build script in package.json is named 'build'
RUN npm run build

# STAGE 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output from the 'builder' stage
COPY --from=builder /app/dist/ledgerflow/browser /usr/share/nginx/html


# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80