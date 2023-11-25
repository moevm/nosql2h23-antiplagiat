FROM ubuntu:focal

ARG ANTIPLAGIAT_PORT=8088

WORKDIR /opt/antiplagiat_backend
COPY . .

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone

# packages needed to install git plugin to node.js
RUN apt-get update
RUN apt-get -y install curl gnupg make g++ libkrb5-dev libssl-dev
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
    | tee /etc/apt/sources.list.d/nodesource.list
# need second apt-get update to process new package sources
RUN apt-get update
RUN apt-get install -y nodejs
RUN curl -qL https://www.npmjs.com/install.sh | sh

RUN npm install --loglevel=error --no-fund --no-audit

EXPOSE ${ANTIPLAGIAT_PORT}
ENTRYPOINT [ "npm", "run" ]
