up:
	docker-compose -f devops/docker-compose.local.yml --project-name wehost up --build -d
down:
	docker-compose -f devops/docker-compose.local.yml --project-name wehost down