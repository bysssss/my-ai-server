# BE Cloud Run 첫 배포

> backend(FastAPI)를 GCP Cloud Run에 처음으로 올린다. AI가 gcloud로 직접 수동 배포 — 깃액션 자동화는 다음 단계.

## 목적 / 배경

- FE는 이미 라이브(my-ai-server.pages.dev)인데 BE는 로컬 도커뿐 — 인프라 양쪽을 완성한다.
- "AI가 인프라를 직접 제어"의 첫 실전: 빌드→푸시→배포→검증을 전부 gcloud/도커 명령으로 AI가 수행.
- 회사(esign-service) DevOps 조사에서 가져온 원칙 적용: **이미지 태그 = 커밋 SHA**, 시크릿/설정은 배포 파라미터로, 헬스체크 확인.

## 범위

- 포함:
  - 배포용 `backend/docker/Dockerfile` 완성 (실행 CMD — Cloud Run `$PORT` 바인딩)
  - GCP Artifact Registry 저장소 생성 (이미지 보관)
  - Cloud Run 서비스 생성·배포 → 인터넷에서 `/health` 응답 확인
  - `docs/infra.md` 배포 상태 갱신
- 제외 (다음 단계):
  - 깃허브 워크플로(자동 배포) — 브랜치 전략과 묶어 추후
  - DB·시크릿 매니저 연동 (아직 쓸 데 없음)
  - stg/prod 환경 분리 (단일 환경으로 시작 — esign도 dev만 실가동)
  - FE↔BE 연동 (다음 작업)
