# 노트 (결정·함정·왜)

> 시간순 로그는 `03_progress.md`. 여기는 다음 배포/수정 때 참고할 "왜/함정"만.

## 결정

- **빌드는 로컬 도커 → Artifact Registry push → `gcloud run deploy --image`.** `--source`(Cloud Build)는 Dockerfile 위치가 비표준(backend/docker/)이라 부적합. 로컬 도커가 이미 검증돼 있어 이 경로가 확실.
- **이미지 태그 = `sha-<커밋7자리>`** (회사 esign 원칙). latest 금지 — 롤백·추적용.
- **min-instances 0 / max 2** — idle $0 + 폭주 과금 상한. 콜드스타트(1~2초)는 감수.
- 설정은 전부 `--set-env-vars`(MY_*) — 이미지 하나로 환경만 바꿔 배포.

## 함정 (gotcha)

- **배포용 Dockerfile에 앱 코드 COPY가 없었다.** 로컬이 돌았던 건 compose가 `./src/app`을 volume 마운트해줬기 때문 — 이미지는 자기완결이 아니었음. Cloud Run은 volume 없으니 `COPY src/app` 필수. (compose 마운트가 COPY를 가리므로 로컬 개발 흐름은 그대로)
- **CMD는 shell form + `exec`** 이어야 한다: exec form(JSON)은 `${PORT}` 환경변수 확장이 안 되고, shell form만 쓰면 SIGTERM이 sh에 먹혀 graceful shutdown이 안 됨. `CMD exec fastapi run ... --port ${PORT:-8080}` 조합이 정답. (빌드 시 JSONArgs 경고는 의도된 것)
- **맥(ARM)에서 빌드 시 `--platform linux/amd64` 필수** — 안 붙이면 Cloud Run(amd64)에서 exec format error.
- **서비스 계정이 Editor면 배포는 되는데 공개(IAM) 설정에서 막힌다** (`run.services.setIamPolicy` 거부). 콘솔에서 사람이 Owner 부여해야 했음 — SA 권한은 IAM 변경 권한 포함 여부까지 확인할 것.
- gcloud 명령 인자(jq/format 필터)에 한글 키를 쓰면 파싱 에러 — 도구 인자는 ASCII로.
