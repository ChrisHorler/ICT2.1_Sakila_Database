.PHONY: up down logs ps reset adminer

up:
	docker compose -f deploy.dev.yml up -d

down:
	docker compose -f deploy.dev.yml down

logs:
	docker compose -f deploy.dev.yml logs -f --tail=100

ps:
	docker compose -f deploy.dev.yml ps

reset:
	docker compose -f deploy.dev.yml down -v
	docker compose -f deploy.dev.yml up -d

adminer:
	@echo "Open Adminer: http://localhost:$(ADMINER_PORT)"
