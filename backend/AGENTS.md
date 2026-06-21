# backend — my-ai-server

> 백엔드(FastAPI) 스택 규칙. 공통 규칙(에이전트 행동·작업 관리·Git·한국어)은 루트 `AGENTS.md` 를 따른다.

## 기술 스택

- Python 3.12 / FastAPI / uv
- Pydantic + pydantic-settings (설정) · Loguru (로깅)
- Docker / Docker Compose (로컬 실행)

## 프로젝트 구조

```
backend/
  src/app/
    main_api.py            # FastAPI 엔트리포인트 (app 객체명: my_fastapi)
    health/                # 도메인 폴더
      router.py            # 엔드포인트
      schemas.py           # 요청/응답 모델
      service.py           # 비즈니스 로직
    core/                  # settings(MY_* 환경변수) / logger(loguru)
  tests/                   # pytest
  docker/                  # Dockerfile(base) / Dockerfile.local
  docker-compose.yaml
  Makefile                 # 빌드·실행 명령
  pyproject.toml / uv.lock
```

## 코드 컨벤션

- **구조 (domain-first)**: 도메인별 폴더. 한 도메인 = `router` / `schemas` / `service` (+ DB 도메인은 `repository` / `models`)
  - `router` — 엔드포인트 (HTTP 입출력 + service 위임)
  - `schemas` — 요청/응답 Pydantic 모델
  - `service` — 비즈니스 로직
  - `repository` — 데이터 접근 (DB 도메인만)
  - `models` — DB 테이블 모델 (DB 도메인만)
  - 흐름: `router → service → repository → models`
- **비동기 우선**: HTTP/IO/LLM 호출은 async/await
- **설정**: pydantic-settings `BaseSettings` (`MY_` 접두, `.env`)
- **네이밍**: snake_case. 도메인 폴더 안에서는 파일명에 도메인 접두를 붙이지 않는다 (`router.py`, `schemas.py`)
- **FastAPI 앱 객체명**: `my_fastapi`
- **일반 원칙**: 함수는 한 가지 일만, 길면 분리. early-return 으로 중첩 줄이기. 매직값은 상수/설정으로.

## 환경변수

| 변수 | 기본값 | 용도 |
|---|---|---|
| `MY_STAGE` | local | 실행 환경 (local/dev/prod) |
| `MY_NAME` | my-ai-server | 서비스명 |
| `MY_VERSION` | 0.1.0 | 버전 |
| `MY_LOG` | DEBUG | 로그 레벨 |
