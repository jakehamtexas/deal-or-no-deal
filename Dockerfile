FROM node:22-alpine

COPY package-lock.json package.json tsconfig.json /app/
COPY public/ /app/public

WORKDIR /app
RUN npm ci

COPY app/ /app/app
COPY db/ /app/db
COPY .dev.env /app/

RUN npm run build \
  && npm prune --production \
  && npm cache clean --force \
  && rm -rf /root/.npm \
  && rm -rf /root/.node-gyp \
  && rm -rf /root/.cache \
  && rm -rf /root/.config \
  && rm -rf /root/.local \
  && rm -rf /tmp/* \
  && rm -rf /var/cache/apk/*

ENTRYPOINT [ "npm", "start" ]
