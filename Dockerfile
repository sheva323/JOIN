# Use an official Node.js runtime as the base image
FROM node:18-alpine
 
# Set the working directory in the container
WORKDIR /app
 
# Copy the package.json and package-lock.json files to the container
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the app's source code to the container
COPY . .
 
# Build the Next.js app
RUN npm run build
 
# Expose the port that Next.js runs on
EXPOSE 3000
 
# Run the Next.js app
CMD ["npm", "start"]