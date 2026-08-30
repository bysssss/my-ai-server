# 진행 로그

> 작업하며 날짜별로 기록한다. 새 세션은 이 파일부터 읽는다.
>
> 세션은 시간순(오래된 → 최신). 같은 날짜는 하나로 합친다.

## Reboot Check (세션 재개용 — 마지막 세션이 끝날 때 갱신)

1. 지금 뭐 하고 있었나: 승인 후 1~6단계 구현 완료. **PR 파이프라인 진행 중 (커밋→PR→CI→머지 가능 보고)**
2. 다음 할 일: 머지(사용자 판단) → 머지 후 main 동기화·브랜치 정리
3. 만진 파일: `AGENTS.md`(8·10·14장) · `skills/commit`·`create-pr` · `backend/tests/test_health.py`(lifespan 커버) · `backend/pyproject.toml`·`uv.lock`(pytest-cov) · `.github/workflows/ci.yml`(100% 게이트) · `specs/README.md`(보관 규칙) · `docs/backlog.md` · `docs/standards-adoption.md` · 이 spec 4파일
4. 내린 결정: 커밋 게이트 제거(입구=스펙 승인·출구=머지), specs 6개월 보관, 커버리지 100% 게이트(측정 93%→lifespan 커버로 100%)
5. 미해결/막힌 것: 없음

## 2026-08-30

- 한 일:
  - 3차 조사 — 서브에이전트 4개 병렬(urbanzone·esign·property-right·team-pulse).
  - 스펙(`01_README`·`02_plan`) 작성.
- 결정 / 발견:
  - **자율 루프의 비결은 도구가 아니라 문서 구조** — urbanzone에 CodeRabbit 설정·hooks·오케스트레이션 스킬 전부 없음. 계획서 직렬화 + "요청 없이도 갱신" + 게이트 2곳 + 기계적 종료 조건이 전부. 그 핵심은 8월 반영 때 이미 가져왔다.
  - **esign은 specs를 폐기했고(8-11, 25폴더 146파일) property-right는 유지** — 같은 회사가 갈림. 우리는 보관 + 기간제 삭제(6개월) + 유효 사실 docs 승격으로 결정.
  - **property-right 실결함**: AGENTS.md 장 삽입 후 스킬들의 장 번호 인용이 어긋남 — 우리도 같은 구조라 점검 규칙 채택.
  - 사용자 방향 확정: **커밋 승인 게이트 제거** — 커밋마다 사람이 끼면 개발→테스트→리뷰→재수정 루프가 끊긴다. 사람은 스펙 승인(입구)과 머지(출구)만.
  - team-pulse의 식별자 논쟁(ULID/UUID)은 여전히 미결 — 우리 UUIDv7 결정 유지.
- 다음: 사용자 승인 → 1단계부터.

### 구현 (같은 날, 승인 후)

- 1단계 — AGENTS.md 10장 "커밋·푸시 금지" → "승인된 스펙 범위 안에서는 자동" 교체, PR 루프 6단계로 확장(CI 대응·해법 분리 검증·머지 가능 보고), 14장 갱신.
- 2단계 — create-pr 스킬 전면 개정: "PR 생성이 끝이 아니라 머지 가능 보고가 끝". CI 로그 읽기(짐작 금지)·리뷰 유효성/해법 분리·"하지 않은 것" 절 필수.
- 3단계 — pytest-cov 추가, 측정 93% → 원인이 lifespan 미실행(TestClient 를 with 없이 사용)이라 테스트를 fixture 로 고쳐 100% → `--cov-fail-under=100` 을 CI 에 연결. 이유 주석 포함.
- 4·5단계 — AGENTS.md 8장 장 번호 점검 규칙, specs/README.md 보관 규칙(6개월).
- 6단계 — backlog(커버리지 게이트 완료 처리, 아키텍처 패턴 3건·FE 테스트 조건 대기 추가), standards-adoption(3차 조사 절 신설, 다르게 가는 것에 커밋 게이트·specs 보관 추가).

## 검증 결과

> 최신 결과로 덮어쓴다 (누적 금지).

- `uv run ruff check .` — All checks passed
- `uv run pytest -q --cov=app --cov-fail-under=100` — 2 passed, TOTAL 100%
- 장 번호 인용 전수 점검 — 인용되는 장(4·5·8·10·15)이 실제 장 제목과 전부 일치
- CI(PR) — (파이프라인 진행 중, 결과는 PR 에서 확인)
