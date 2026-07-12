# my-ai-server

> AI 에이전트가 작업 시 참조하는 **공통 규칙**이다. 어떤 AI든 이 문서를 따른다. 스택별(백엔드·프론트엔드) 규칙은 각 폴더의 AGENTS.md를 따른다.

AI 에이전트 개발 패턴을 정리·시연하는 레퍼런스 겸 새 작업용 베이스 템플릿. BE/FE를 한 레포에 두는 **모노레포**.

## 모노레포 구조

```
backend/    # FastAPI (Python). 스택 규칙: backend/AGENTS.md
frontend/   # React + TS + Vite (Abyssey 랜딩). 스택 규칙: frontend/AGENTS.md
docs/       # 개념·패턴 문서
specs/      # 작업 단위 스펙 문서 (SDD)
skills/     # 반복 절차 스킬 (.claude/skills 가 심볼릭 링크)
```

## 에이전트 행동 원칙

### 사용자 우선 (User Authority)

- 사용자가 틀렸다고 하면 즉시 수용하고 바로 고친다. 변명·반박·"하지만/원래" 금지.
- 불확실하면 멈추고 확인한다. 추측·가정으로 진행하지 않는다.
- 범위 제한 지시("조사만", "구현하지 마")는 명시적으로 해제하기 전까지 유효하다.

### 구현 전 절차

- 요청받자마자 코딩하지 않는다.
- 범위를 가장 작은 단위로 좁힌다.
- 요청하지 않은 모듈·클래스·엔드포인트를 만들지 않는다. 기존 것으로 해결 가능한지 먼저 본다.
- 작업은 `specs/` 문서로 먼저 정리하고 사용자 승인을 받은 뒤 구현한다 (아래 "작업 관리").

### 코드 읽기 (Code Reading Protocol)

- 호출하는 함수/메서드가 있으면 **그 본문을 끝까지 읽기 전에 동작을 단정하지 않는다.** 일부 분기만 보고 결론 내리지 않는다.
- 응답·토큰을 아끼려고 코드 추적을 생략하지 않는다. 광범위 탐색은 서브에이전트에 위임한다.

### 커밋·푸시

- `git commit` / `git push` 는 사용자가 명시적으로 요청할 때만 실행한다. 작업이 끝나도 자동 커밋하지 않는다.

### 메모리

- 에이전트 메모리를 사용한다 (세션을 넘는 맥락·결정·선호 기록). 이 레포는 에이전틱 패턴 레퍼런스라 메모리도 시연 대상이다.

## 작업 관리 (specs/)

- 새 작업(기능·수정)은 `specs/YYYY-MM-DD-<슬러그>/` 폴더 단위로 관리한다 (날짜 prefix로 정렬·추적). **코딩 전 문서 작성은 필수다.**
  (폴더명은 업계 SDD(spec-driven development) 관례를 따라 `specs/` — 구 `tasks/`)
- 시작 전 `specs/_template/` 를 복사해 `01_README`(목적·범위)·`02_plan`(접근·단계)을 채우고 사용자 승인을 받는다.
- 폴더는 번호 순서의 4파일, 각자 의미 하나: `01_README`(목적·범위) / `02_plan`(계획·단계) / `03_progress`(시간순 로그) / `04_notes`(결정·함정·왜).
- 작업이 진행되면 **요청 없이도** `03_progress.md` 와 `02_plan.md` 체크리스트를 즉시 갱신한다 (한 단위 완료 → 문서 갱신). 세션이 끝날 땐 `03_progress.md` 의 **Reboot Check**(하던 일/다음/만진 파일/결정/미해결)를 갱신한다.
- `04_notes.md` 에는 결정·함정(gotcha)·"왜 이렇게 했나" 를 누적한다. 코드엔 결과만 남고 이유는 안 남으므로, 다음 수정 때 같은 삽질을 막는 용도다.
- 코드베이스 탐색이 필요하면 `Explore`/`Plan` 서브에이전트에 위임한다 (메인 컨텍스트 절약).
- 형식은 템플릿을 따른다. 형식 자체를 이 문서에 중복 기술하지 않는다.

## 스킬 (skills/)

- 반복 절차는 루트 `skills/<이름>/SKILL.md` 로 정의한다. `.claude/skills` 는 `skills/` 를 가리키는 심볼릭 링크 — 도구 중립 위치와 Claude Code 인식을 동시에 충족한다.
- 현재: `commit`(팀 규칙 커밋), `create-pr`(PR 생성 — 브랜치 전략 도입 후 사용).
- 위험 명령이 필요한 스킬은 SKILL.md 안에서 허용 범위(명령·대상·조건)를 명시하고 그 범위에서만 쓴다.

## 인프라 / 배포

- 배포: **BE = Cloud Run (GCP 프로젝트 `abyssey`)**, **FE = Cloudflare Pages**. (best-of-breed, 무료 → 종량)
- **AI가 인프라를 직접 제어한다.** GCP는 `secrets/gcp-sa.json`(서비스 계정 키, gitignore)로 gcloud 인증해 운영한다:

  ```
  gcloud auth activate-service-account --key-file=secrets/gcp-sa.json
  gcloud config set project abyssey
  ```

- GitHub 작업(이슈·PR·레포 관리)은 `secrets/github-token.txt`(PAT)로 한다:
  `GH_TOKEN=$(cat secrets/github-token.txt) gh <명령>` (git push/pull 은 머신 SSH 그대로)
- **시크릿 라우팅**: 작업 대상에 맞는 키를 `secrets/`에서 골라 쓴다. 머신 전역 로그인에 기대지 않는다.
- 결정 배경·최초 셋업·배포 방법은 `docs/infra.md`, 키·시크릿 규칙은 `secrets/README.md` 참조.
- ⚠️ `secrets/` 의 키는 절대 커밋·공유 금지.

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

## 참고 문서

- 에이전틱 개발: `docs/agentic.md` — 개발 시간(에이전트로 개발) + 런타임(앱 적용 패턴) 두 층위 정리
- 인프라/배포: `docs/infra.md` — BE=Cloud Run / FE=Cloudflare 결정·최초 셋업·AI 제어법

## 향후 방향 (TBD)

- 깃 브랜치 전략 + AI 리뷰(CodeRabbit 등)·CI 게이트·PR 루프 (현재 `main` 직접 커밋·배포 = 최소 형태, 묶어서 정리)
- `.claude/settings.json` 권한 allowlist·훅 — lint/test를 하네스가 기계적으로 강제 (회사 레포에도 없는 확장 지점)
- DDD / TDD 도입 여부 (별도 논의)
- LLM 제공자 연동 · 런타임 패턴 콘텐츠
