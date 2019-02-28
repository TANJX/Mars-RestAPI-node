FROM node:10
COPY . /home/node/app
WORKDIR /home/node/app
RUN npm install
CMD npm run-script run
