FROM node:alpine as BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
COPY ./src/config ./

EXPOSE 5001

CMD ["yarn", "start"]
