# 회사 표준 적용 현황

회사 레포의 규칙·절차·게이트를 이 저장소에 어디까지 가져왔는지 적는다. **무엇을 왜 안 했는지도 함께 적는다** — 적용한 것만 적으면 나중에 「이건 왜 안 했지」를 다시 조사하게 된다.

참고한 레포:

| 레포 | 성격 | 무엇을 참고했나 |
|---|---|---|
| team-pulse | 회사 공통 도메인·전사 표준을 정리하는 문서 레포 | 개발표준(API·시간·식별자), 문서 위생 |
| esign-service | 실제 서비스 레포. AI 개발 셋팅이 가장 진화한 곳 | 규칙 문서 구조, 스킬, specs 절차, CI |
| member-api | 팀의 코딩 규칙 기준 레포 (1차 조사) | 규칙 문서·스킬 체계의 원형 |

회사는 Java/Spring 이고 여기는 Python/FastAPI 다. **코드는 참고 대상이 아니고**, 가져온 것은 언어와 무관한 규칙·절차·게이트 층뿐이다.

조사는 세 차례 했다 — 1차 member-api·esign-service (2026-07-12), 2차 team-pulse 추가 (2026-08-08), 3차 urbanzone-service·property-right-service 추가 (2026-08-30). 회사 레포는 계속 움직이므로 아래 표는 **2026-08-30 기준**이다.

---

## 1차 조사에서 적용한 것 (2026-07-12)

| 항목 | 상태 | 어디에 |
|---|---|---|
| 단일 규칙 문서 + 심볼릭 링크 | 적용 | `AGENTS.md` ← `CLAUDE.md` (회사는 `GEMINI.md` 까지 — 필요해지면 추가) |
| 스킬 체계 (`skills/` + `.claude/skills` 심링크) | 적용 | `skills/` |
| spec 문서 번호 prefix + Reboot Check | 적용 | `specs/_template/` |
| Code Reading Protocol | 적용 | `AGENTS.md` 4장 |

**회사 것 너머로 확장한 것**: `.claude/settings.json` 의 권한 allowlist + PostToolUse lint 훅(ruff/oxlint, warning 0). 회사 레포에는 없는 기계적 강제 층이다. 산문 규칙은 모델의 준수에 의존하지만 훅은 막는다.

---

## 2차 조사에서 적용한 것 (2026-08-08)

### 규칙 문서

| 항목 | 상태 | 어디에 |
|---|---|---|
| 장 번호 체계 (인용 가능하게) | 적용 | `AGENTS.md` 1~15장 |
| "이 프로젝트에서 안 하는 것" 목록 | 적용 | `AGENTS.md` 14장 |
| 검증 명령 문서화 | 적용 | `AGENTS.md` 2장 |
| Active Path Rule | 적용 | `AGENTS.md` 4장 |
| 프레임워크 버전 함정 섹션 | 적용 | `AGENTS.md` 1장 (Pydantic v2 · Tailwind v4 · React 19 기준) |
| 미래 요구 미리 반영 금지 | 적용 | `AGENTS.md` 4장 |
| 한국어 표현 규칙 (구어·과장 금지 표, 조사 붙여쓰기) | 적용 | `AGENTS.md` 11장 |
| 설정 파일 "왜" 주석 | 적용 | `AGENTS.md` 8장 |
| 예시 코드 작성 규칙 | 적용 | `AGENTS.md` 8장 |
| PR 루프 (문서를 같은 PR에, 리뷰 반영, 머지는 사용자) | 적용 | `AGENTS.md` 10장 · `skills/create-pr` |
| 커밋 트레일러에 실제 모델명 | 적용 | `AGENTS.md` 10장 · `skills/commit` |

### 전사 개발표준 (team-pulse)

| 항목 | 상태 | 어디에 |
|---|---|---|
| Web API 설계 (복수형·kebab-case 경로, 쿼리 camelCase, 단수형 리소스) | 적용 | `backend/AGENTS.md` |
| 시간 (UTC 저장 / ISO 8601 / naive datetime 금지) | **규칙만** | `backend/AGENTS.md` — 적용 대상 코드 없음 |
| 식별자 | **변경 적용 · 규칙만** | `backend/AGENTS.md` — ULID 대신 UUIDv7. 적용 대상 코드 없음 |
| 파라미터 재할당 금지 | 적용 | `backend/AGENTS.md` |
| 문서 제목·머리말에 날짜 금지 | 적용 | `AGENTS.md` 8장 |

⚠️ **시간·식별자는 규칙만 있고 적용된 코드가 없다.** DB·엔티티가 아직 없다. 첫 엔티티를 만들 때 이 규칙을 적용하고, 그때 이 표를 「적용」으로 고친다. 지금 상태를 「적용」으로 읽지 않도록 구분해 둔다.

### 절차·게이트

| 항목 | 상태 | 어디에 |
|---|---|---|
| `specs/README.md` 프로세스 문서 | 적용 | `specs/README.md` |
| specs 템플릿 장치 (승인 체크박스 / 결정·이유·대안 / 결과 덮어쓰기) | 적용 | `specs/_template/` |
| `review` 스킬 | 적용 | `skills/review/SKILL.md` |
| 스킬 frontmatter `metadata` | 적용 | `skills/*/SKILL.md` |
| commit 스킬 예시 | 적용 | `skills/commit/SKILL.md` |
| `.editorconfig` | 적용 | `.editorconfig` |
| CI — 검사와 배포 분리 | 적용 | `.github/workflows/ci.yml` |

---

## 3차 조사에서 적용한 것 (2026-08-30)

핵심 발견: **"작업 시키면 머지 직전까지 알아서"를 만드는 것은 특별한 도구가 아니다.** urbanzone-service 에는 CodeRabbit 설정도 hooks 도 오케스트레이션 스킬도 없다 — 계획서 직렬화, "요청 없이도 갱신", 게이트 최소화, 기계적 종료 조건이 전부이고 그 대부분은 2차 때 이미 가져왔다. 상세 조사 기록은 `specs/2026-08-30-autonomous-pipeline/`.

| 항목 | 출처 | 어디에 |
|---|---|---|
| PR 이후 절차 — CI 초록까지 따라가기, "빨간 채로 넘기기" 금지 | property-right create-pr 스킬 | `skills/create-pr` · AGENTS.md 10장 |
| 리뷰 대응 — 지적의 유효성과 해법의 타당성을 분리 검증 | property-right review 스킬 | `skills/create-pr` · AGENTS.md 10장 |
| PR 본문 "하지 않은 것" 절 | property-right | `skills/create-pr` |
| 커버리지 게이트 — 코드 적은 지금 100% 로 | property-right ("한 번 낮추면 올리는 시점이 오지 않는다") | `ci.yml` backend |
| 장 번호 인용 전수 점검 규칙 | property-right 실결함 (장 삽입 후 인용 어긋남) | AGENTS.md 8장 |
| specs 기간제 보관 (6개월, 유효 사실은 docs 승격 후 삭제) | esign 의 specs 폐기 경험 + 히스토리 보관 요구의 절충 | `specs/README.md` |

---

## 회사와 다르게 가는 것

| 항목 | 회사 | 여기 | 왜 |
|---|---|---|---|
| 에이전트 메모리 | 금지 | **사용** | 이 레포는 에이전틱 패턴 레퍼런스라 메모리 활용 자체가 시연 대상이다 |
| 식별자 | ULID (26자 문자열) | **UUIDv7** | UUIDv7 은 RFC 9562 표준 UUID 라서 UUID 를 지원하는 모든 것(DB 타입·ORM·검증기)이 그대로 지원한다. ULID 는 어디서도 1급 시민이 아니라 타입·검증기를 직접 붙여야 한다 |
| Update 메서드 | `PATCH` 로 통일 | **`PUT`/`PATCH` 구분** | 통일의 목적은 여러 명이 매번 논쟁하는 비용을 없애는 것이다. 1인이고 레퍼런스 레포라 의미를 뭉개는 쪽이 손해다 |
| spec 문서 수 | 6문서 | **4문서** | 1인 프로젝트에 findings/tasks 분리는 과하다. 작성 규칙은 가져왔다 — 문서 수와 작성 규칙은 별개다 |
| 전사 표준 위치 | 별도 레포로 분리 | **분리 안 함** | 여러 레포가 표준을 공유해야 나눌 이유가 생긴다. 레포 하나에 1인이면 `AGENTS.md` + 스택별 문서로 충분하다 |
| 시크릿·인프라 제어 | 표준에 없음 | **`secrets/` 라우팅** | 우리 확장. AI 가 인프라를 직접 제어하려면 키 라우팅 규칙이 필요하다 |
| 커밋·푸시 승인 | 명시 요청 시만 (절대 원칙) | **승인된 스펙 범위에선 자동** | 커밋마다 사람이 끼면 개발→테스트→리뷰→재수정 루프가 끊긴다. 1인이고 PR·CI 가 뒤에서 거른다. 사람은 스펙 승인(입구)과 머지(출구)만 |
| specs 처리 | esign: 폐기 / property-right: 무기한 보관 | **6개월 기간제 보관** | 작업 당시 히스토리는 남기되, 낡은 스펙이 사실처럼 보이는 문제는 유효 사실의 docs 승격으로 예방 |

---

## 적용하지 않은 것

| 항목 | 왜 |
|---|---|
| Java/Spring 코딩 규칙 (Lombok·JPA·`ResponseEntity`·Checkstyle) | 스택 전용이라 옮길 대상이 없다 |
| 살아있는 문서 vs 불변 스냅샷 구분 | 회의록 같은 받은 원본을 쌓는 레포가 아니다. 값어치가 있는 것은 "제목에 날짜 금지" 한 줄뿐이었다 |
| `.gitattributes` | 회사 것은 `gradlew`·`.bat` 개행 처리용이다. Python/TS 에는 해당 없다 |
| `docs/operations.md` | `docs/infra.md` 가 이미 같은 자리를 채우고 있다 |
| 릴리스 워크플로 (dev/stg/prod 태그 승격) | 환경이 하나뿐이라 과하다 |
| Jira 티켓 규칙 (`[RP-XXXX]`) · 팀원 명부 | 1인 프로젝트에 무의미하다 |
| 아키텍처 as code (Structurizr) | 현재 구조가 단순해 SSOT YAML 이 과하다. 시스템이 늘면 재검토한다 |
| 프론트엔드 FSD 체계 | 랜딩 한 장 규모엔 과하다. 커지면 옮긴다는 방향만 `frontend/AGENTS.md` 에 적어 두었다 |

---

## 보류 — 조건이 갖춰지면 한다

| 항목 | 언제 |
|---|---|
| TDD 명문화 | 사용자 결정 대기 |
| AI 리뷰 도구 연동 (CodeRabbit 등) | PR 루프·리뷰 대응 규칙은 이미 있다. 도구만 붙이면 된다 |
| FE 커버리지 게이트 | 테스트 프레임워크 도입과 한 묶음 (BE 는 100% 로 걸려 있다 — 3차 조사 절 참조) |

---

## 앞으로

- 첫 DB 엔티티를 만들 때 시간·식별자 규칙을 실제로 적용하고 이 문서의 「규칙만」을 「적용」으로 고친다.
- 회사 레포가 움직이면 다시 조사하고, 그때 조사 기준 날짜를 이 문서 머리에 갱신한다.
