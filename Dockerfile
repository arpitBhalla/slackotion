FROM node:latest

COPY . . 

COPY .env .env

RUN yarn
RUN yarn add typescript
RUN npx tsc

ENV PORT=80

EXPOSE 80

CMD ["node","dist/index"]