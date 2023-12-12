#! /bin/bash
# Launch antiplagiat on host (not in Docker)
# mongod must be started, must be executed from test directory

cd ../backend
npm install
export ANTIPLAGIAT_DB_HOST=127.0.0.1:27017
export ANTIPLAGIAT_FRONTEND_HOST=127.0.0.1:8080
export ANTIPLAGIAT_BACKEND_PORT=8088
export ANTIPLAGIAT_DB_NAME=antiplagiat
export ANTIPLAGIAT_DIR="$(pwd)"
export ANTIPLAGIAT_REPOS_DIR="${ANTIPLAGIAT_DIR}/repos"

npm run backend &

cd ../frontend
npm install
export ANTIPLAGIAT_BACKEND_HOST=127.0.0.1:8088
export ANTIPLAGIAT_FRONTEND_PORT=8080

npm run serve
