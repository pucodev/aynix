FROM node:22.17.1-alpine3.22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY prod.env .env
EXPOSE 3000
RUN npm run build
CMD npm run migrate && npm run start
