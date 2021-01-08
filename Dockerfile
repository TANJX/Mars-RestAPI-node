FROM node:10
COPY . /home/node/app
FROM node:10-alpine
WORKDIR /home/node/app
RUN npm install
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
COPY . .
CMD npm run-script run
