FROM node:20

ARG ANTIPLAGIAT_DIR

WORKDIR "${ANTIPLAGIAT_DIR}/frontend"
COPY . .

RUN npm config set update-notifier false
RUN npm install --loglevel=error --no-fund --no-audit

CMD [ "npm", "run", "serve" ]
