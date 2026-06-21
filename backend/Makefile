.PHONY: build build-local up down logs ps

IMAGE_NAME = my-ai-server
VERSION = 1.0.0

# 베이스 이미지 빌드
build:
	@docker build . -t $(IMAGE_NAME):$(VERSION) -f ./docker/Dockerfile

# 로컬 실행 이미지 빌드 (base 먼저 빌드됨)
build-local: build
	@docker build . -t $(IMAGE_NAME):$(VERSION)-local -f ./docker/Dockerfile.local

# 컨테이너 실행 (→ localhost:5555)
up:
	@docker compose -f docker-compose.yaml up -d

# 컨테이너 종료
down:
	@docker compose -f docker-compose.yaml down

# 컨테이너 로그
logs:
	@docker compose logs -f app

# 컨테이너 상태
ps:
	@docker compose ps
