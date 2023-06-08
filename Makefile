include .env

.PHONY: run
run:
	docker-compose up -d

.PHONY: connect
connect:
	docker exec -it $(PROJECT_NAME)-web /bin/bash