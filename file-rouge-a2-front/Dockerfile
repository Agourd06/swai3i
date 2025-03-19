FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Simple build command without flags
RUN npm run build

EXPOSE 5173

# Use --host flag to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 