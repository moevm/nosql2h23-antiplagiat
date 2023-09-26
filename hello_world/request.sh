#!/bin/bash

declare -r SERVER_URL='http://localhost:8088'

# main

case "${1}" in
  post)
    curl -X POST -H 'Content-Type: application/json' -d "${2}" "${SERVER_URL}/api/users"
    echo $''
  ;;
  put)
    curl -X PUT -H 'Content-Type: application/json' -d "${2}" "${SERVER_URL}/api/users"
    echo $''
  ;;
  get)
    curl -X GET -H 'Content-Type: application/json' "${SERVER_URL}/api/users/${2}"
    echo $''
  ;;
  delete)
    curl -X DELETE -H 'Content-Type: application/json' "${SERVER_URL}/api/users/${2}"
    echo $''
  ;;
  *)
    echo "Usage: ${0} {{post,put} <JSON> | {delete,get} <ID>}"
    exit 1
  ;;
esac
