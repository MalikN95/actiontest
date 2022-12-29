up:
	docker-compose -f devops/docker-compose.local.yml --project-name action up --build -d
down:
	docker-compose -f devops/docker-compose.local.yml --project-name action down