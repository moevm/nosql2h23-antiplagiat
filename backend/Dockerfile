FROM node:20

ARG ANTIPLAGIAT_DIR

WORKDIR "${ANTIPLAGIAT_DIR}/backend"
COPY . .

# packages needed to install git plugin to node.js
RUN apt-get update
RUN apt-get -y install git make g++ libkrb5-dev libssl-dev
RUN npm config set update-notifier false
RUN npm install --loglevel=error --no-fund --no-audit

# cosmetic
RUN git config --global advice.detachedHead false

CMD [ "npm", "run", "backend" ]
