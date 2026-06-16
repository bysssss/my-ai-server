# my-ai-server

> 이 문서는 AI가 코딩 및 작업 시 참조하는 핵심 규칙 문서다. 장황한 설명 없이 규칙과 맥락만 기술한다.

AI 에이전트 개발 패턴을 정리·시연하는 레퍼런스 서버. 동시에 새 작업에 가져다 쓰는 베이스 템플릿.
현재는 로컬에서 뜨는 최소 FastAPI 뼈대 단계이며, 패턴 콘텐츠는 점진적으로 추가한다.

## 기술 스택

- Python 3.12 / FastAPI / uv
- Pydantic + pydantic-settings (설정)
- Loguru (로깅)
- Docker / Docker Compose (로컬 실행)

## 프로젝트 구조

```
src/app/
  main_api.py            # FastAPI 엔트리포인트 (app 객체명: my_fastapi)
  api/                   # 엔드포인트 (router → spec → api)
    health/
      health_router.py   # 라우팅
      health_spec.py     # Pydantic 요청/응답 모델
      health_api.py      # 컨트롤러
  core/                  # 공통 기반
    settings.py          # pydantic-settings (MY_* 환경변수)
    logger.py            # loguru 설정
tests/                   # pytest
docker/                  # Dockerfile(base) / Dockerfile.local
```

## 코드 컨벤션

- **레이어 패턴**: router(라우팅) → spec(Pydantic 모델) → api(컨트롤러) → (이후 service → data 확장)
- **비동기 우선**: HTTP/IO/LLM 호출은 async/await
- **설정**: pydantic-settings `BaseSettings` 로 환경변수 관리 (`MY_` 접두, `.env`)
- **네이밍**: snake_case (파일·변수·함수), 디렉토리는 도메인/기능 단위로 분리
- **파일 분리**: 한 도메인은 `{name}_router.py` / `{name}_spec.py` / `{name}_api.py` 로 역할 분리
- **FastAPI 앱 객체명**: `my_fastapi` (Docker CMD `--app my_fastapi` 와 일치)

## 환경변수

| 변수 | 기본값 | 용도 |
|---|---|---|
| `MY_STAGE` | local | 실행 환경 (local/dev/prod) |
| `MY_NAME` | my-ai-server | 서비스명 |
| `MY_VERSION` | 0.1.0 | 버전 |
| `MY_LOG` | DEBUG | 로그 레벨 |

## 참고 문서

- 에이전틱 개발: `docs/agentic.md` — 개발 시간(에이전트로 개발) + 런타임(앱 적용 패턴) 두 층위 정리

## 향후 방향 (TBD)

- LLM 제공자 연동 (제공자 선택 미정)
- 에이전트 개발 패턴 콘텐츠 (Building Blocks / Workflow / Agent 패턴)
- 에이전틱 개발 셋업 (`.claude/` — subagents, skills)
