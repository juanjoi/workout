# Dockerfile
# Use an official Nginx runtime as a base image
FROM nginx:latest

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Remove the default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the frontend app files into the container
COPY ./dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]