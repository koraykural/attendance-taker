FROM node:18 as development

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- api --skip-nx-cache

EXPOSE 3333

CMD ["node", "dist/apps/api/main.js"]
