FROM node:20.9-alpine3.18

ARG ANTIPLAGIAT_PORT=8088

WORKDIR /opt/antiplaigat_backend
COPY . .

RUN npm install

EXPOSE ${ANTIPLAGIAT_PORT}
ENTRYPOINT [ "npm", "run" ]
