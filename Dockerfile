# Use Node.js LTS version as the base image
FROM node:20.17.0
# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY . .
# Run tests using npm script
CMD ["npm", "test"]