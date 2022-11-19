FROM node:16.14-bullseye-slim

# Create app directory
WORKDIR /usr/src/client

# COPY package.json .

COPY . .

RUN npm install -g prisma

# Install app dependencies
RUN npm i

# Generate prisma client
RUN prisma generate --schema=./src/prisma/schema.prisma

# Build the app
RUN npm run build

RUN npm uninstall -g prisma

EXPOSE 3000

# Start Node server
CMD [ "node", "bin" ]