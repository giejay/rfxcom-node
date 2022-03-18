FROM node:12.22.10

WORKDIR /app

COPY package.json /app
COPY rfxcom.js /app 

RUN npm install

CMD node rfxcom.js