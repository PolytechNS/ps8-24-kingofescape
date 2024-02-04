FROM node:18

WORKDIR /app

COPY package*.json ./

COPY back/ back
COPY front/ front


RUN npm install

COPY --chown=node:node . .

EXPOSE 8000

ENV HOST=0.0.0.0 PORT=8000

CMD ["npm", "start"]