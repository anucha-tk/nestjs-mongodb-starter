# dev mode
start-dev:
	docker compose --env-file .env up -d
start-mongo-dev:
	docker compose --env-file .env up -d mongodb mongodb-test
stop-dev:
	docker compose stop
down-dev:
	docker compose down
restart-dev:
	docker compose restart
log-nestjs:
	docker container logs -f nestjs
