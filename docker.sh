#!/usr/bin/env bash

USAGE="Usage: $0 [dev|prod] [up|down|restart|rebuild]"

export $(cat ./.dev.env | xargs)
case "$1" in
dev)
	file="./docker-compose.dev.yaml"
	;;
prod)
	file="./docker-compose.yaml"
	;;
*)
	echo "$USAGE"
	exit 1
	;;
esac

shift

case "$1" in
up)
	docker compose -f "$file" up -d
	;;
down)
	docker compose -f "$file" down
	;;
restart)
	docker compose -f "$file" down
	docker compose -f "$file" up -d
	;;
rebuild)
	docker compose -f "$file" down
	docker compose -f "$file" up -d --build
	;;
*)
	echo "Usage: $0 {up|down|restart}"
	exit 1
	;;
esac
