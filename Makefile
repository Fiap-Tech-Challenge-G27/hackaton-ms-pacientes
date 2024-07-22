###
# Docker section
###
.PHONY: db-up ## up service db
db-up:
	@docker compose up -d mongo

.PHONY: app-up ## up all services
app-up:
	@docker compose run --service-ports app

.PHONY: dk-down ## down all services
down:
	@docker compose down app --remove-orphans
	@docker rmi ms-pacientes-app:latest