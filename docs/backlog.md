# 백로그 — 해야 할 일과 해온 일

해야 할 일을 **이 문서 한곳**에서 관리한다. 그동안 할 일이 세 군데(AGENTS.md 15장 / 지난 spec 진행 로그 / standards-adoption.md 보류)에 흩어져 있어 전체가 한눈에 안 보였다.

**쓰는 법**

- 작업을 시작하면 `specs/YYYY-MM-DD-<슬러그>/` 폴더를 만들고(승인 게이트 포함 — AGENTS.md 5장), 여기 항목은 그 폴더 링크로 바꾼다.
- 작업이 끝나면 항목을 맨 아래 **「완료」 표로 옮긴다** — 한 줄 요약 + 기록 위치만. 상세(과정·결정·함정)는 specs 폴더가 갖는다.
- 새 할 일이 생기면 어디 적을지 고민하지 않는다. 여기다.

---

## 바로 할 수 있는 것

| 항목 | 내용 | 참고 |
|---|---|---|
| **LLM 제공자 연동** | backend 에 첫 LLM 호출 도메인을 만든다. 이 프로젝트 본체의 시작점 | `docs/agentic.md` 2장 |
| **런타임 패턴 예제 채우기** | `agentic.md` 2장의 패턴 목록(Prompt Chaining, Routing, ReAct …)을 "언제 쓰고 언제 안 쓰는가" 기준 + 실행 예제로 하나씩 채운다. LLM 연동이 선행 조건 | `docs/agentic.md` 2장 |
| **FE↔BE 연동** | Abyssey 랜딩이 BE API 를 호출하게 한다. FE 에 `VITE_API_URL` 주입 + BE CORS 설정 | `docs/infra.md` 배포 방법 절 |
| **BE 자동 배포** | `main` 머지 시 Cloud Run 에 자동 배포하는 워크플로. 검사(`ci.yml`)와는 파일 분리 유지, 이미지 태그 = 커밋 SHA | `docs/infra.md` · 배포 함정: `specs/2026-07-12-be-cloud-run-deploy/04_notes.md` |

## 조건이 갖춰지면

| 항목 | 조건 | 참고 |
|---|---|---|
| **커버리지 게이트** | 테스트가 쌓인 뒤. 측정하고 기준은 측정값보다 낮게 잡는다 — 기준을 낮춰 통과시키는 습관을 막기 위해 | `docs/standards-adoption.md` 보류 절 |
| **AI 리뷰 도구 연동** (CodeRabbit 등) | PR 루프 규칙(AGENTS.md 10장)은 이미 있다. 도구만 붙이면 된다. PR 이 늘어나 수동 리뷰가 부담될 때 | — |

## 결정이 필요한 것

| 항목 | 결정할 것 |
|---|---|
| **TDD 명문화** | esign 처럼 Outside-in TDD 를 의무화할지, 지금처럼 자율로 둘지 |
| **DDD 도입 여부** | 도메인이 생기기 전이라 판단 재료가 없다. LLM 도메인이 몇 개 쌓이면 재검토 |

---

## 완료

> 히스토리 파악용 한 줄 색인 — 시간순(과거 → 최신). 상세는 「기록」 열의 위치에 있다.

| 작업 | 결과 | 기록 |
|---|---|---|
| Abyssey 랜딩 첫 페이지 | FE 라이브 — my-ai-server.pages.dev | `specs/2026-06-27-abyssey-landing/` |
| 인프라 결정·셋업 (GCP·Cloudflare) | BE=Cloud Run / FE=Pages 확정, AI 가 gcloud·gh 로 직접 제어 | `docs/infra.md` |
| 회사 표준 1차 반영 | AGENTS.md+심링크 · 스킬 체계 · specs 템플릿 · 하네스(권한 allowlist+lint 훅) | `docs/standards-adoption.md` |
| BE Cloud Run 첫 배포 | BE 라이브 — `/health` 200 | `specs/2026-07-12-be-cloud-run-deploy/` |
| 회사 표준 2차 반영 | AGENTS.md 15장 체계 · review 스킬 · 첫 CI · 표준 추적 문서 · 첫 PR 루프 실전 | `specs/2026-08-08-company-standards-adoption/` |
| 백로그 문서 신설 | 할 일 단일 목록 (이 문서) | — (spec 없이 진행한 문서 작업) |
