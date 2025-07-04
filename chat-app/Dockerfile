# Use an official Node.js runtime as the base image
FROM node:22.1

WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies (including nodemon)
RUN npm install

# Copy the rest of your app source code
COPY . .

# Install nodemon globally (optional, but helpful)
RUN npm install -g nodemon

# Expose your app port
EXPOSE 3000

# Start the app with nodemon and watch your source files
CMD ["nodemon", "--watch", "src", "--exec", "ts-node", "src/main.ts"]
