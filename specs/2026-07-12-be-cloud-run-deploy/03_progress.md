# 진행 로그

> 작업하며 날짜별로 기록한다. 새 세션은 이 파일부터 읽는다.

## Reboot Check (세션 재개용 — 마지막 세션이 끝날 때 갱신)

1. 지금 뭐 하고 있었나: BE Cloud Run 첫 배포 — **완료**
2. 다음 할 일: (이 spec 범위 밖) FE↔BE 연동, 깃액션 자동 배포(브랜치 전략과 묶음)
3. 만진 파일: `backend/docker/Dockerfile`(코드 COPY+CMD), docs/infra.md, 이 spec 4파일
4. 내린 결정: 서비스명 `my-ai-server`(사용자), 서울 리전, 공개, min0/max2, sha 태그, 로컬 amd64 빌드
5. 미해결/막힌 것: 없음. 커밋만 대기(사용자 타이밍)

## 2026-07-12

- 한 일:
  - 배포용 Dockerfile 완성 — **앱 코드 COPY가 없었음을 발견**(로컬은 compose volume 마운트 의존) + `$PORT` 바인딩 CMD 추가.
  - 로컬 스모크: PORT=7777 주입해 컨테이너 기동 → /health OK.
  - Artifact Registry `my-ai-server`(서울) 생성 → 이미지 `backend:sha-e0b236f` push.
  - `gcloud run deploy my-ai-server` (min0/max2, 512Mi, 공개) → **https://my-ai-server-9242752760.asia-northeast3.run.app/health 200 확인. BE 라이브.**
- 결정 / 발견:
  - 공개(allUsers invoker) 설정이 PERMISSION_DENIED — **SA가 Owner가 아니라 Editor였음**(생성 때 착오). 사용자가 콘솔에서 Owner 부여 후 해결.
  - 이미지 태그 `sha-e0b236f`는 HEAD 기준인데 Dockerfile 변경분은 미커밋 상태로 빌드됨 — 다음부턴 커밋 후 빌드가 원칙.
- 다음: FE에서 BE URL 호출(연동), 자동 배포 액션(추후).
