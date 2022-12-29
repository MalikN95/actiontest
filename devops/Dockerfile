## Build application
FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN yarn --ignore-scripts
RUN yarn add -D handpick --ignore-scripts
RUN yarn run handpick --target=devDependencies --filter=lintDependencies --filter=testDependencies
RUN yarn --ignore-scripts run build

## Build production image
FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ ./
COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./
RUN yarn

EXPOSE 3000
CMD ["node", "dist/main.js"]