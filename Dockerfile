FROM node:16
WORKDIR /cobalt
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN npx tsc
EXPOSE 3030
CMD ["yarn", "start"]