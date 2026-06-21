# my-ai-server

> 이 문서는 AI 에이전트가 코딩·작업 시 참조하는 핵심 규칙 문서다. 어떤 AI든 이 문서를 따른다. 장황한 설명 없이 규칙과 맥락만 기술한다.

AI 에이전트 개발 패턴을 정리·시연하는 레퍼런스 서버. 동시에 새 작업에 가져다 쓰는 베이스 템플릿.
현재는 로컬에서 뜨는 최소 FastAPI 뼈대 단계이며, 패턴 콘텐츠는 점진적으로 추가한다.

## 에이전트 행동 원칙

### 사용자 우선 (User Authority)

- 사용자가 틀렸다고 하면 즉시 수용하고 바로 고친다. 변명·반박·"하지만/원래" 금지.
- 불확실하면 멈추고 확인한다. 추측·가정으로 진행하지 않는다.
- 범위 제한 지시("조사만", "구현하지 마")는 명시적으로 해제하기 전까지 유효하다.

### 구현 전 절차

- 요청받자마자 코딩하지 않는다.
- 범위를 가장 작은 단위로 좁힌다.
- 요청하지 않은 모듈·클래스·엔드포인트를 만들지 않는다. 기존 것으로 해결 가능한지 먼저 본다.
- 작업은 `tasks/` 문서로 먼저 정리하고 사용자 승인을 받은 뒤 구현한다 (아래 "작업 관리").

### 커밋·푸시

- `git commit` / `git push` 는 사용자가 명시적으로 요청할 때만 실행한다. 작업이 끝나도 자동 커밋하지 않는다.

### 메모리

- 에이전트 메모리를 사용한다 (세션을 넘는 맥락·결정·선호 기록). 이 레포는 에이전틱 패턴 레퍼런스라 메모리도 시연 대상이다.

## 작업 관리 (tasks/)

- 새 작업(기능·수정)은 `tasks/<작업-이름>/` 폴더 단위로 관리한다. **코딩 전 문서 작성은 필수다.**
- 시작 전 `tasks/_template/` 를 복사해 `README`(목적·범위)·`plan`(접근·단계)을 채우고 사용자 승인을 받는다.
- 작업이 진행되면 **요청 없이도** `progress.md` 와 `plan.md` 체크리스트를 즉시 갱신한다 (한 단위 완료 → 문서 갱신).
- 코드베이스 탐색이 필요하면 `Explore`/`Plan` 서브에이전트에 위임한다 (메인 컨텍스트 절약).
- 형식은 템플릿을 따른다. 형식 자체를 이 문서에 중복 기술하지 않는다.

## Git

### 커밋 메시지

- 한국어 현재형, 요약 50자 이내.
- 본문은 "무엇을"이 아니라 **"왜"** 를 쓴다 (diff 보면 아는 내용은 생략). 작성 전 `git diff --staged` 로 실제 변경을 확인한다.

### 금지 명령

- `git commit --amend` / `rebase -i` / `reset --hard` / `push --force` / `add -A`·`add .` 금지. 스테이지된 것만 커밋한다.

### 브랜치

- 영어 소문자 + 하이픈, 간결하게 (예: `health-endpoint`, `llm-chat`). `feat-`/`feature-` prefix·슬래시 지양.

### PR

- 제목에 `feat:`/`fix:` 같은 conventional prefix 금지. 변경 의도를 드러내는 간결한 한국어 제목.
- 본문은 변경 의도 중심, 존댓말.

## 한국어 의사소통

- 별도 지시 없으면 한국어 존댓말.
- "~할 시/경우" → "~하면/때", "~를 수행합니다" → "~합니다". 번역투 지양.
- 기술 용어는 한국어·영어 병기 가능 (예: 웹소켓(WebSocket)).

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

## 기술 스택

- Python 3.12 / FastAPI / uv
- Pydantic + pydantic-settings (설정) · Loguru (로깅)
- Docker / Docker Compose (로컬 실행)

## 프로젝트 구조

```
src/app/
  main_api.py            # FastAPI 엔트리포인트 (app 객체명: my_fastapi)
  health/                # 도메인 폴더
    router.py            # 엔드포인트
    schemas.py           # 요청/응답 모델
    service.py           # 비즈니스 로직
  core/                  # settings(MY_* 환경변수) / logger(loguru)
tests/                   # pytest
docker/                  # Dockerfile(base) / Dockerfile.local
tasks/                   # 작업 단위 문서 (작업 관리 참조)
docs/                    # 개념·패턴 문서
```

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

- DDD / TDD 도입 여부 (별도 논의)
- `.claude/` 스킬 (필요 시 — 첫 후보: commit-recommend, branch-name)
- LLM 제공자 연동 · 런타임 패턴 콘텐츠
