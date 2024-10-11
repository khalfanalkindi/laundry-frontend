FROM node:14

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
