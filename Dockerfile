FROM node:14.15.5

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . ./

CMD [ "node", "server/index.js" ]
