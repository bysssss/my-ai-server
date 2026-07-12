# 계획

## 내가(AI) 정한 기본값 — 승인 대상

| 항목 | 값 | 왜 |
|---|---|---|
| 리전 | `asia-northeast3` (서울) | 가장 가까움 |
| 서비스명 | `my-ai-server` | 사용자 지정 (FE Cloudflare 프로젝트명과 통일) |
| 이미지 태그 | `sha-<커밋7자리>` | 회사 원칙 이식 — 불변·커밋 추적·롤백 즉시 |
| 인증 | 공개(allow-unauthenticated) | 랜딩 API라 공개가 맞음. 지금은 /health뿐이라 리스크 0 |
| 스케일 | min 0 / **max 2** | min 0 = idle $0(핵심), max 2 = 폭주해도 과금 상한 |
| 리소스 | 512Mi / 1 CPU | FastAPI 뼈대엔 충분 |
| env | `MY_STAGE=dev` 등 (compose와 동일 계열) | 설정은 코드가 아니라 배포 파라미터로 |

## 접근

- **빌드는 로컬 도커로** (`--platform linux/amd64` — 맥 ARM이라 필수) → Artifact Registry push → `gcloud run deploy --image`.
  - `--source`(Cloud Build) 방식은 Dockerfile이 표준 위치가 아니라(backend/docker/) 안 맞고, 로컬 도커가 이미 검증돼 있어 이쪽이 확실.
- Dockerfile CMD는 Cloud Run이 주는 `$PORT`(기본 8080)에 바인딩. 로컬 compose(5555→8080)와 충돌 없음.

## 단계

- [x] 1. 배포용 `backend/docker/Dockerfile` 완성 — 코드 COPY + `$PORT` CMD 추가, 로컬 스모크(PORT=7777 주입) 통과
- [x] 2. Artifact Registry 저장소 `my-ai-server` 생성 + 도커 인증 설정
- [x] 3. 이미지 빌드(amd64, `sha-e0b236f`) → push
- [x] 4. `gcloud run deploy my-ai-server` → https://my-ai-server-9242752760.asia-northeast3.run.app
- [x] 5. 검증: `/health` 인터넷에서 200 + 정상 JSON
- [x] 6. `docs/infra.md` 갱신, progress/notes 기록

## 검증

- 인터넷에서 `https://<run-url>/health` 가 200 + 정상 JSON.
- idle 시 인스턴스 0으로 내려가는지(비용 $0) 콘솔/명령으로 확인.
