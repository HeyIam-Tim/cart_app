#!/usr/bin/env bash

BASE_DIR="$(dirname ${0})"
CONTAINER="postgresgz"
DOCKER_PATH="/home/db.sql"

echo "copy start"
sudo docker cp dumps/db.sql postgresgz:$DOCKER_PATH
echo "copy end"

echo "Restore dump"
cat dumps/db.sql | docker exec -i $CONTAINER  psql -U gz
