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
- **파라미터 재할당 금지**: 파라미터에 다시 대입하지 않는다. 원래 들어온 값이 무엇이었는지 추적이 끊겨, 디버깅할 때 로그의 값과 코드의 값이 안 맞는다.

  ```python
  # 금지 — 파라미터 재할당
  def send(recipients: list[str]) -> None:
      recipients = [r.strip() for r in recipients]

  # 이렇게 — 다른 이름의 새 변수
  def send(recipients: list[str]) -> None:
      cleaned = [r.strip() for r in recipients]
  ```

## API 설계

경로를 만들기 전에 **"이 API가 다루는 자원이 무엇인가"** 를 한 문장으로 정한다. 행위(다운로드·발송)가 아니라 자원(파일·문서)이 리소스다.

- 경로 세그먼트는 **kebab-case**, 컬렉션은 **복수형 명사** (`/signature-requests`)
- 쿼리 파라미터는 **camelCase** (`?userId=...`) — 경로와 표기가 다른 것은 프론트엔드 관행에 맞춘 의도적 선택이다
- 컬렉션 5패턴: `GET /items` · `GET /items/{id}` · `POST /items` · `PATCH /items/{id}` · `DELETE /items/{id}`
- **`PUT` 과 `PATCH` 는 의미대로 나눠 쓴다** — 전체 교체는 `PUT`, 부분 수정은 `PATCH`, 애매하면 `PATCH`. (회사 표준은 `PATCH` 로 통일하지만 여기서는 나눈다. 근거: `docs/standards-adoption.md`)
- 목록으로 접근하는 것이 불가능한 자원은 처음부터 **단수형** — 세션이 대표 사례다 (`POST /session` 로그인 / `GET /session` 확인 / `DELETE /session` 로그아웃)
- 행위 동사 세그먼트 금지 — `/download`, `/send` 대신 HTTP 메서드로 표현한다
- 응답은 **스키마 객체 하나**를 반환한다. 리스트를 그대로 반환하면 페이지네이션 같은 메타데이터를 실을 자리가 없다
- 상태 코드는 `status_code=` 로 표현하고, 오류는 예외를 던져 표현한다

## 시간

| 자리 | 표준 |
|---|---|
| 코드 | **timezone-aware `datetime`** (UTC) |
| 저장 | UTC. DB 컬럼은 `timestamp with time zone` |
| 응답(JSON) | **ISO 8601** (`2026-08-08T13:04:25+00:00`) |

- **naive datetime 금지.** `datetime.now()` 가 아니라 `datetime.now(timezone.utc)` 를 쓴다. naive 값은 어느 지역 시간인지 정보가 없어서, 저장·비교·직렬화 어디서든 조용히 틀린다.
- Pydantic 은 `datetime` 을 ISO 8601 로 직렬화한다. 문자열로 직접 포맷하지 않는다.

## 식별자

Entity 의 식별자는 자동 증가 숫자가 아니라 **UUIDv7** 을 쓴다.

- 시간순으로 정렬되고 인덱스 지역성이 좋다 (랜덤 UUIDv4 의 단점을 없앤 것).
- **ULID 가 아니라 UUIDv7 이다.** 회사 표준은 ULID 지만, UUIDv7 은 RFC 9562 표준 UUID 라서 UUID 를 지원하는 모든 것(DB 타입·ORM·검증기)이 그대로 지원한다. ULID 는 26자 문자열로 저장하고 타입·검증기를 직접 붙여야 한다. (근거: `docs/standards-adoption.md`)
- 표준 라이브러리 `uuid.uuid7()` 은 **Python 3.14 부터**다. 이 프로젝트는 3.12 이므로 도입 시점에 `uuid-utils` 같은 패키지를 추가한다.
- ⚠️ 아직 DB·엔티티가 없어서 **적용된 코드는 없다.** 규칙만 세워 둔 상태다.

## 환경변수

| 변수 | 기본값 | 용도 |
|---|---|---|
| `MY_STAGE` | local | 실행 환경 (local/dev/prod) |
| `MY_NAME` | my-ai-server | 서비스명 |
| `MY_VERSION` | 0.1.0 | 버전 |
| `MY_LOG` | DEBUG | 로그 레벨 |
