FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app . 

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "index.js"]
