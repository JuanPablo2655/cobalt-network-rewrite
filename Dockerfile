FROM node:14

WORKDIR /cobalt

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN tsc

EXPOSE 3030

CMD ["yarn", "deploy"]