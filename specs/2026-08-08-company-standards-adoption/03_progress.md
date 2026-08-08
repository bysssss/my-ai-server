# 진행 로그

> 작업하며 날짜별로 기록한다. 새 세션은 이 파일부터 읽는다.

## Reboot Check (세션 재개용 — 마지막 세션이 끝날 때 갱신)

1. 지금 뭐 하고 있었나: **0~7단계 구현 완료.** 체크박스 35개 전부 처리. 커밋은 안 함 (사용자 요청 대기)
2. 다음 할 일: 커밋 → (원하면) PR. 그 뒤로는 이 spec 범위 밖 — `docs/agentic.md` 2장 런타임 패턴이 다음 본 작업
3. 만진 파일: `AGENTS.md`(전면 재편 15장) · `backend/AGENTS.md` · `frontend/AGENTS.md`(신설) · `.editorconfig`(신설) · `specs/README.md`(신설) · `specs/_template/` 4파일 · `skills/review/`(신설) · `skills/commit`·`create-pr` · `docs/standards-adoption.md`(신설) · `docs/agentic.md` · `docs/infra.md` · `.github/workflows/ci.yml`(신설)
4. 내린 결정: 회사 코드는 참고 대상 아님(Java) — 규칙·절차·게이트 층만. 메모리 금지는 반대로. `PATCH` 통일 안 함. 식별자는 ULID 아니라 **UUIDv7**. 문서 위생은 한 줄만. 표준 분리 구조는 버림. **CI 는 보류에서 빼고 7단계로 실행**
5. 미해결/막힌 것: 없음. 보류는 커버리지 게이트(테스트 쌓인 뒤) · TDD 명문화(결정 대기)뿐

## 2026-08-08

- 한 일:
  - 세 레포 조사 — my-ai-server 현 상태, esign-service(AGENTS.md 709줄 13장·스킬 3종·워크플로 6종·specs 6문서), team-pulse(전사 개발표준·문서 위생·architecture as code).
  - my-ai-server 현 상태 확인: 커밋 14개, 마지막 작업 2026-07-12. BE·FE 둘 다 라이브 확인(`/health` 200 `stage=dev`, Pages 200). BE 는 `health` 도메인 하나, FE 는 랜딩 1장, 테스트 2개.
  - `01_README`·`02_plan` 작성.
- 결정 / 발견:
  - **1차 조사가 이미 있었다** — `docs/agentic.md` "회사 표준과의 관계 (2026-07-12)". 이번은 2차이므로 그 섹션과 중복되지 않게 쓴다.
  - **1차의 "보류" 3건 중 CI 게이트·PR 루프를 회사가 그 뒤 실제로 구축했다** (커버리지 게이트 8-07, `ci.yml` 8-08). 베낄 실물이 생겼다.
  - **결함 발견**: 루트 AGENTS.md 가 `frontend/AGENTS.md` 를 참조하는데 파일이 없다.
- 다음: 사용자 피드백 → 승인 → 0단계부터 구현.

### team-pulse 항목 검토 (사용자와 하나씩)

| 항목 | 결과 |
|---|---|
| API 설계 규칙 | 적용 (파이썬 방식으로) |
| `PUT`/`PATCH` 통일 | **안 함** — 두 메서드는 의미가 다르고, 레퍼런스 레포에서 뭉갤 이유가 없다 |
| 시간 규칙 | 적용 (naive datetime 금지가 핵심) |
| 식별자 | **ULID → UUIDv7 로 변경** — 표준 UUID 라 라이브러리 지원이 자동 |
| 문서 위생 | **한 줄로 축소** — 제목에 날짜 금지만. 스냅샷 구분은 버림 |
| 표준 분리 구조 | **안 함** — 1인·단일 레포라 나눌 이유 없음 |

- 부수 발견: `docs/infra.md` 의 `## 현재 상태 (2026-06-28)` 안에 "BE 배포 완료 (2026-07-12)" 가 있다. 제목 날짜 금지 규칙을 만들 근거가 우리 파일에 이미 있다 → 5단계에서 함께 고친다.

### esign-service 항목 검토

1차 목록이 6개였는데 재확인(설정 파일·specs 템플릿 전문·빌드 설정·릴리스 워크플로)에서 **4개가 더 나왔다.** 최종 10개.

| 항목 | 결과 |
|---|---|
| AGENTS.md 번호 체계 | 적용 — 규칙을 인용 가능하게 만드는 전제 조건 |
| "안 하는 것" 목록 | 적용 — 새 금지를 만드는 게 아니라 흩어진 금지를 한곳에 모으는 것 |
| review 스킬 | 적용 — `skills/review/SKILL.md` 신설 |
| specs 템플릿 장치 | 적용 (**재확인 추가**) — 승인 체크박스 / 결정·이유·대안 / 결과 덮어쓰기 |
| 표준 추적 문서 | 적용 |
| `.editorconfig` | 적용 (**재확인 추가**) |
| 검증 명령 문서화 | 적용 (**재확인 추가**) — 지금 Makefile 에만 있어 문서만 읽으면 모른다 |
| 설정 파일 "왜" 주석 | 적용 (**재확인 추가**) |
| CI 검사·배포 분리 | **보류** — 결정 대기 |
| 커버리지 게이트 | **보류** — 결정 대기 |

- 안 가져오는 것 3개: `.gitattributes`(Java 전용) · `docs/operations.md`(infra.md 가 커버) · 릴리스 워크플로(환경 하나뿐).
- 교훈: 1차 목록은 눈에 띄는 것 위주였다. **템플릿 전문·설정 파일까지 열어야 실제 장치가 보인다.**

### 구현 (0~7단계 완료)

- 0단계 — `frontend/AGENTS.md` 신설(루트가 참조하던 결함 해소), `.editorconfig` 신설.
- 1단계 — `AGENTS.md` **전면 재편: 15장 번호 체계.** 14장에 "안 하는 것" 13항목을 장 번호와 함께 모음. 검증 명령·Active Path Rule·버전 함정(Pydantic v2·Tailwind v4·React 19)·PR 루프·미래 요구 금지·예시 코드 규칙·설정 "왜" 주석·한국어 표현 표 추가.
- 2단계 — `backend/AGENTS.md` 에 API 설계·시간·식별자(UUIDv7)·파라미터 재할당 금지 추가.
- 3단계 — `specs/README.md` 신설. 템플릿 4파일에 승인 체크박스·결정/이유/대안·검증 결과 덮어쓰기 규칙 반영.
- 4단계 — `skills/review/SKILL.md` 신설(보안 7항목 + 규칙 16항목, 읽기 전용). 스킬 3종에 `metadata` 통일. commit 에 트레일러 규칙·커밋 예시. create-pr 을 PR 루프에 정렬.
- 5단계 — `docs/infra.md` 의 `## 현재 상태 (2026-06-28)` 에서 날짜 제거(본문이 7-12 내용을 담고 있어 2주 낡은 상태였다).
- 6단계 — `docs/standards-adoption.md` 신설. `docs/agentic.md` 의 중복 섹션은 링크로 축약.
- 7단계 — `.github/workflows/ci.yml` 신설. **이 레포 첫 CI.** backend(ruff→pytest) / frontend(npm ci→lint→build) 두 job, 검사만.
- 발견: 새로 만든 "제목에 날짜 금지" 규칙이 `standards-adoption.md` 의 "1차 조사 (2026-07-12)" 헤딩에 걸렸다. **조사 시점은 낡지 않는 날짜**라 규칙의 예외인데 예외 목록에 없었다 → 8장에 판단 기준("그 날짜가 낡느냐")을 추가.

## 검증 결과

> 최신 결과로 덮어쓴다 (누적 금지).

- `uv run ruff check .` — All checks passed
- `uv run pytest -q` — 2 passed
- `npm run lint` — 통과 (warning 0)
- `npm run build` — 통과 (26 modules, tsc 타입 검사 포함)
- 루트 AGENTS.md 가 참조하는 파일 10개 전부 존재 확인
- 제목에 낡는 날짜가 남은 문서 없음
- 미실행: `review` 스킬 실전 1회 (커밋 후 실제 diff 로 확인 예정)
