FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set dynamic backend proxy environment variable
ENV BACKEND_URL=http://backend:8000

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
