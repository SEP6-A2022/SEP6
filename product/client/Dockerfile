FROM node:alpine

# Create app directory
WORKDIR /usr/src/client

# COPY package.json .

COPY . .
RUN ls -la

# Install app dependencies
RUN npm install

# Build the app
RUN npm run build

EXPOSE 3000

# Start Node server
CMD [ "node", "bin" ]