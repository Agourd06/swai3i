FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Display current directory structure before build
RUN echo "Before build:" && ls -la

# Clean and build
RUN npm run build

# Display directory structure after build
RUN echo "After build:" && ls -la && echo "Dist directory:" && ls -la dist/

# Set development environment
ENV NODE_ENV=development
ENV DATABASE_URL=mongodb://mongodb:27017/swai3i

EXPOSE 3000

# Use start:dev instead of start:prod
CMD ["npm", "run", "start:dev"] 