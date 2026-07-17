# my-ai-server

AI 에이전트 개발 패턴을 정리하는 레퍼런스 프로젝트. BE/FE를 한 레포에 두는 모노레포.

> **이름 구분**: `my-ai-server` = 이 베이스 프로젝트 자체(레포·서버·인프라 전반) / `Abyssey` = 그 위에서 만드는 데모 서비스(작업물 — 예: 랜딩 페이지). 서버 몸통은 프로젝트명, 사용자에게 보이는 페이지·도메인은 서비스명을 쓴다.

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

### 4. 백엔드 의존성 설치

```bash
cd backend
uv sync
```

`backend/.venv` 가 생성되고 의존성이 설치된다.

### 5. Python 인터프리터 설정

1. `Cmd + Shift + P` → `Python: Select Interpreter`
2. `backend/.venv` 안의 `Python 3.12.x` 선택

### 6. 확인

```bash
which python3
# .../my-ai-server/backend/.venv/bin/python3 이면 정상
```

## 프로젝트 구조 (모노레포)

```
my-ai-server/
├── backend/              # FastAPI (Python)
│   ├── src/app/
│   │   ├── health        # 도메인 (router / schemas / service)
│   │   ├── core          # settings, logger
│   │   └── main_api.py   # 엔트리포인트
│   ├── tests/
│   ├── docker/
│   ├── docker-compose.yaml
│   ├── pyproject.toml     # 의존성 (uv)
│   └── AGENTS.md          # 백엔드 스택 규칙
├── frontend/             # React + TS + Vite (Abyssey 랜딩)
├── docs/                 # 개념·패턴 문서
├── specs/                # 작업 단위 스펙 문서 (SDD)
├── Makefile              # 명령 센터 (be-* / fe-*)
├── AGENTS.md             # 공통 규칙 (CLAUDE.md 는 @AGENTS.md)
└── README.md
```

## Tech Stack

- **백엔드**: Python 3.12 / [FastAPI](https://fastapi.tiangolo.com) / [Pydantic](https://docs.pydantic.dev) · pydantic-settings / [Loguru](https://github.com/Delgan/loguru) / [uv](https://docs.astral.sh/uv) / Docker
- **프론트**: React 19 / TypeScript / [Vite](https://vite.dev) / [Tailwind CSS](https://tailwindcss.com)
