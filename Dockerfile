FROM node:22-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

RUN chown node:node /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node index.js knowledgeBase.js ./

USER node

CMD ["npm", "start"]
