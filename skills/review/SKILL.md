---
name: review
description: my-ai-server의 팀 규칙(AGENTS.md)과 보안 관점으로 변경 코드를 리뷰한다. "리뷰해줘", "코드 리뷰", "이거 괜찮아?", "보안 검토" 요청 시 사용.
allowed-tools: Read, Glob, Grep, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git show:*), Bash(cd backend && uv run pytest:*), Bash(cd backend && uv run ruff:*), Bash(cd frontend && npm run:*)
metadata:
  version: 2026.08.0
  role: my-ai-server 코드 리뷰 (팀 규칙 + 보안)
  applies-to: backend(FastAPI) · frontend(React/TS) 변경 코드 리뷰
---

# review — 규칙·보안 리뷰

변경된 코드를 **팀 규칙 준수**와 **보안** 두 관점으로 본다. 규칙의 출처는 [`AGENTS.md`](../../AGENTS.md) 와 스택별 AGENTS.md 다. 일반적인 버그 탐색이 목적이 아니다.

## 활성화 시점

- "리뷰해줘", "코드 리뷰", "코드 검토", "이거 괜찮아?", "확인해줘"
- "보안 검토", "security review"
- 커밋·PR 전 검증 단계

## 절차

### 1. 리뷰 대상 확정

```bash
git status --porcelain
git diff --stat                  # 작업 트리 변경
git diff main...HEAD --stat      # 브랜치 전체 변경 (PR 리뷰 시)
```

범위(작업 트리 vs 브랜치 전체)를 사용자에게 확인한다. 대상 파일은 diff 뿐 아니라 **전체 내용**을 읽는다 — AGENTS.md 4장 Code Reading Protocol 대로 호출된 함수는 끝까지 읽고 판단한다.

### 2. 보안 체크 (🔴 반드시 통과)

1. **비밀정보 하드코딩 금지** — 키·토큰·비밀번호가 코드·설정에 없는지. 환경변수(`MY_*`)로만 주입하는지
2. **`secrets/` 노출 금지** — 키 파일이 커밋 대상에 들어갔는지, 경로가 로그·응답에 찍히는지
3. **개인정보·비밀정보 로깅 금지** — 요청 바디 전체나 토큰을 그대로 로그에 남기지 않는지
4. **입력 검증** — 외부 입력이 Pydantic 스키마로 검증되는지. 검증 없이 통과하는 경로가 있는지
5. **오류 메시지 과다 노출 금지** — 스택트레이스·내부 경로·쿼리가 응답으로 나가지 않는지
6. **CORS·공개 범위** — 엔드포인트가 의도보다 넓게 열려 있지 않은지 (Cloud Run 은 공개 서비스다)
7. **의존성** — 새로 추가된 패키지가 실제로 필요한지, 출처가 분명한지

### 3. 팀 규칙 체크

| 항목 | 규칙 출처 |
|---|---|
| 구버전 문법 (Pydantic v1, Tailwind v3 설정 등) | 1장 |
| lint warning 0 / 검증 명령 통과 | 2·7장 |
| 호출 함수 끝까지 읽고 판단했는지 | 4장 |
| 실제로 호출되는 경로에 구현했는지 (Active Path) | 4장 |
| 요청하지 않은 모듈·엔드포인트 / 미래 요구 미리 반영 | 4장 |
| 문서 제목·머리말에 날짜 | 8장 |
| 설정 파일에 "왜" 주석이 있는지 | 8장 |
| 예시에 실제 클래스명·로직 복사 | 8장 |
| 커밋 메시지가 "왜" 중심인지 | 10장 |
| 도메인 폴더 구조 (`router`/`schemas`/`service`) | backend |
| 경로 kebab-case·복수형, 쿼리 camelCase, 행위 동사 금지 | backend |
| `PUT`/`PATCH` 의미대로 나눠 썼는지 | backend |
| naive datetime 사용 | backend |
| 파라미터 재할당 | backend |
| 컴포넌트 1파일 1개, 색·폰트 하드코딩 금지 | frontend |

### 4. 자동 검증 실행

변경 영역만 돌린다.

```bash
cd backend && uv run ruff check . && uv run pytest -q
cd frontend && npm run lint && npm run build
```

### 5. 결과 출력 (한국어)

```markdown
## 리뷰 결과

### 요약
<변경의 목적과 전반 평가 1~3줄>

### 발견 사항
| 심각도 | 위치 | 내용 | 근거 |
|---|---|---|---|
| 🔴 보안 | `path:line` | <내용> | 보안 체크 N |
| 🟠 규칙 위반 | `path:line` | <내용> | AGENTS.md N장 |
| 🟡 개선 제안 | `path:line` | <내용> | <이유> |

### 자동 검증
- lint / test / build 결과

### 결론
<머지 가능 여부와 필수 수정 항목>
```

발견 사항이 없으면 표 대신 "발견 사항 없음"으로 간결하게 보고한다. 심각도는 🔴(반드시 수정) → 🟠(머지 전 수정) → 🟡(선택) 순으로 정렬한다.

## 금지

- **리뷰 중 코드를 고치는 것** — 이 스킬은 읽기 전용이다. 수정은 사용자 지시를 받고 별도로 한다.
- **diff 만 보고 판단하는 것** — 변경된 함수가 호출하는 코드까지 읽고 판단한다.
- 규칙 근거 없이 취향을 규칙 위반으로 보고하는 것 — 근거가 없으면 🟡 개선 제안이다.

## 참고

- [`AGENTS.md`](../../AGENTS.md) — 공통 규칙 (장 번호로 인용)
- [`backend/AGENTS.md`](../../backend/AGENTS.md) · [`frontend/AGENTS.md`](../../frontend/AGENTS.md) — 스택 규칙
- [commit 스킬](../commit/SKILL.md) · [create-pr 스킬](../create-pr/SKILL.md)
