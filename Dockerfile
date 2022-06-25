FROM node:16 as base

WORKDIR /cobalt

ENV HUSKY=0

COPY yarn.lock ./
COPY package.json ./

RUN sed -i 's/"prepare": "husky install"/"prepare": ""/' ./package.json

FROM base as builder

COPY tsconfig.base.json ./tsconfig.base.json
COPY src/ src/

RUN yarn install --immutable
RUN yarn run build

FROM builder as runner

ENV NODE_OPTIONS="--enable-source-maps"

COPY .env ./.env

EXPOSE 3030

CMD ["yarn", "run", "start"]