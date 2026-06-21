.PHONY: be-build be-up be-down be-logs be-ps

IMAGE_NAME = my-ai-server
VERSION = 1.0.0
BE = backend

# ── Backend ──

# 이미지 빌드 (base → local)
be-build:
	@docker build $(BE) -t $(IMAGE_NAME):$(VERSION) -f $(BE)/docker/Dockerfile
	@docker build $(BE) -t $(IMAGE_NAME):$(VERSION)-local -f $(BE)/docker/Dockerfile.local

# 컨테이너 실행 (→ localhost:5555)
be-up:
	@docker compose -f $(BE)/docker-compose.yaml up -d

# 컨테이너 종료
be-down:
	@docker compose -f $(BE)/docker-compose.yaml down

# 컨테이너 로그
be-logs:
	@docker compose -f $(BE)/docker-compose.yaml logs -f app

# 컨테이너 상태
be-ps:
	@docker compose -f $(BE)/docker-compose.yaml ps

# ── Frontend ── (frontend 생기면 활성화)
# fe-dev:
# 	@cd frontend && npm run dev
# fe-build:
# 	@cd frontend && npm run build

# ── Deploy ── (배포 타깃 정해지면)
# be-deploy:
# 	...
# fe-deploy:
# 	...
