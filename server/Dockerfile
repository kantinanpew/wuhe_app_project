FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Remove the line that copies firebase-admin-key.json

EXPOSE 3000

CMD ["npm", "start"]