FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application
COPY . .

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "dev"]
