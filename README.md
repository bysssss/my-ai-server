# my-ai-server

AI 에이전트 개발 패턴을 정리하는 레퍼런스 프로젝트.

## 초기 환경 세팅

빈 컴퓨터에서 이 레포를 클론한 뒤 아래 순서대로 세팅한다.

### 1. 사전 준비

- **IDE**: [Cursor](https://cursor.com/) 설치
- **Python**: 3.12 이상
- **uv**: Python 패키지 매니저 ([설치 가이드](https://docs.astral.sh/uv/getting-started/installation/))
- **Docker** + **Docker Compose**

### 2. 레포 클론

```bash
git clone git@github.com:bysssss/my-ai-server.git
cd my-ai-server
```

### 3. Cursor 익스텐션 설치

Cursor 실행 후 `Cmd + Shift + X` (Extensions) 에서 아래 설치:

- **Python** (ms-python) — Python 언어 지원
- **Claude** — AI 어시스턴트

### 4. 의존성 설치

```bash
uv sync
```

`.venv` 가 생성되고 의존성이 설치된다.

### 5. Python 인터프리터 설정

1. `Cmd + Shift + P` → `Python: Select Interpreter`
2. `.venv` 안의 `Python 3.12.x` 선택

### 6. 확인

```bash
which python3
# /Users/<user>/Codes/my-ai-server/.venv/bin/python3 이면 정상
```

## 프로젝트 구조

```
root
├── src
│   └── app
│       ├── api               # 엔드포인트 (router → spec → api)
│       │   └── health
│       ├── core              # settings(설정), logger(로깅)
│       └── main_api.py       # FastAPI 엔트리포인트
├── tests
├── docker                    # Dockerfile (base) / Dockerfile.local
├── docker-compose.yaml
├── Makefile
├── pyproject.toml            # 의존성 (uv)
├── .env.example              # 환경변수 예시 (MY_* 접두)
├── CLAUDE.md                 # AI 작업용 규칙 문서
└── README.md
```

## Tech Stack

- Python 3.12, Docker, Docker Compose
- [FastAPI](https://fastapi.tiangolo.com) — async 웹 프레임워크
- [Pydantic](https://docs.pydantic.dev) / pydantic-settings — 데이터 검증 + 설정 관리
- [Loguru](https://github.com/Delgan/loguru) — 로깅
- [uv](https://docs.astral.sh/uv) — 패키지 매니저
- [pytest](https://docs.pytest.org) — 테스트
