FROM node:12.18.3

WORKDIR /code

COPY ./package.json .

RUN yarn

COPY . .

RUN yarn tsc

EXPOSE 4500

CMD ["yarn", "start"]