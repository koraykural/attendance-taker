FROM node:18 as development

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- desktop --skip-nx-cache

FROM node:18 as production
ENV NODE_ENV=production

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/desktop ./
COPY --from=development package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 3333

CMD ["npm", "run", "start", "--", "desktop"]
