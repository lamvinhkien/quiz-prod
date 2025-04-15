FROM node:19-alpine
WORKDIR /usr/backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-src
RUN rm -rf src
EXPOSE 8000
CMD ["node", "build/server.js"]
