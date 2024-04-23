FROM node:18-slim

WORKDIR /app

COPY ./package*.json /app/

RUN npm install
RUN npm install mongodb@6.3

COPY ./back back
COPY ./kof kof

EXPOSE 8000

ENV DB_USER=koe
ENV DB_PASSWORD=ps8koeps8
ENV ADRESS=db_mongo
ENV PORT=27017

CMD ["npm", "start"]