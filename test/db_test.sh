#! /bin/bash
# Fill database with test data
# @param $1 PORT port to connect to mongodb, default is 27017

PORT="${1:-27017}"
mongosh --port "${PORT}" < db_test_commands.txt