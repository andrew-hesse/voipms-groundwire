FROM node:alpine

ENV USERNAME=username
ENV PASSWORD=password
ENV CURRENCY=CAD
ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production
# If you are building your code for production
# RUN npm ci --only=production

RUN apk update
RUN apk add dumb-init

# Bundle app source
COPY . .

EXPOSE 3000

USER node

CMD [ "dumb-init", "node", "main.js" ]