FROM node:18-alpine as dev
RUN apk --update add nodejs npm

WORKDIR /usr/src/app
# ENV PATH="${PATH}:/usr/local/bin"

# Will check if we have yarn installed, if not, will install it
# RUN sh -c "if ! command -v yarn &> /dev/null; then echo 'Yarn not found in the container, using npm to install it'; npm i --global yarn; fi"
COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./
# ignore-scripts is used to avoid husky and lint-staged, also to avoid
# docker postinstall scripts that are used only locally
# RUN yarn --ignore-scripts --dev

# build steps
RUN yarn --ignore-scripts
# Only install dev dependencies necessary in order to build
RUN yarn add -D handpick --ignore-scripts
# Handpick will only pick the dev dependencies because this is a builder
# TODO: pass --manager=yarn and make it work with handpick
RUN yarn run handpick --target=devDependencies --filter=lintDependencies --filter=testDependencies
# To install bcrypt, because it's compiled from source
# Use this as example to install any node-gyp package
# RUN apk add --update make gcc g++ python2 && \
#   npm rebuild bcrypt --build-from-source && \
#   apk del make gcc g++ python2

COPY . .

RUN yarn --ignore-scripts run build

FROM node:18-alpine as prod
RUN apk --update add nodejs npm

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app
# ENV PATH="${PATH}:/usr/local/bin"

COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./

# Will check if we have yarn installed, if not, will install it
#RUN sh -c "if ! command -v yarn &> /dev/null; then echo 'Yarn not found in the container, using npm to install it'; npm i --global yarn; fi"
# COPY . .
RUN yarn
COPY .env ./
RUN yarn add bcrypt --save

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
