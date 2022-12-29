up:
	docker-compose -f devops/docker-compose.local.yml --project-name gitactiontest up --build -d
down:
	docker-compose -f devops/docker-compose.local.yml --project-name gitactiontest down