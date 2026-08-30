---
name: create-pr
description: 현재 브랜치를 push하고 main 대상 PR을 만든 뒤, CI 초록·리뷰 대응까지 따라가 머지 가능 상태로 만든다. 승인된 스펙 파이프라인 안에서는 자동 실행.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*), Bash(git checkout:*), Bash(gh pr:*), Bash(gh run:*), Read, Grep
metadata:
  version: 2026.08.1
  role: GitHub PR Generator + 머지 가능 상태까지 (my-ai-server 팀 규칙)
  applies-to: my-ai-server main 대상 PR 생성·CI 대응
---

# create-pr — PR 생성과 머지 가능 상태까지

PR 을 만드는 것이 끝이 아니다. **CI 초록 + 미대응 리뷰 지적 없음 = "머지 가능"을 보고하는 것**이 이 스킬의 끝이다 (AGENTS.md 10장 PR 루프).

## 절차

### 1. PR 생성까지

1. **브랜치 확인**: `git branch --show-current`. `main`이면 중단하고 브랜치부터 만든다 (영어 소문자+하이픈, `feat-`/슬래시 지양 — AGENTS.md 10장).
2. **커밋 확인**: `git log origin/main..HEAD --oneline` 으로 PR에 담길 커밋을 확인한다.
   - `git diff main...HEAD --stat` 으로 실제 변경 파일을 확인한다 (추측으로 본문을 쓰지 않는다).
   - **관련 문서 갱신이 빠져 있으면 먼저 채운다** — 문서는 이 PR에 같이 담는다. 별도 문서 PR을 만들지 않는다.
3. **push**: `git push -u origin <브랜치>`.
4. **PR 생성** — 프로젝트 키로 bysssss 명의 실행:

   ```bash
   GH_TOKEN=$(cat secrets/github-token.txt) gh pr create --base main --title "..." --body "..."
   ```

   - 제목: conventional prefix 금지, 변경 의도가 드러나는 간결한 한국어.
   - 본문: 변경 의도 중심, 존댓말. **"하지 않은 것" 절을 반드시 넣는다** — 범위 밖으로 둔 것과 잊은 것은 다르고, 적지 않으면 구별되지 않는다. 말미에 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

### 2. 그 뒤 — 머지 가능 상태까지 따라간다

5. **CI 확인**: `gh pr checks <번호>` 로 결과를 본다.
   - 실패하면 **로그를 읽는다. 짐작하지 않는다** (`gh run view --log-failed`).
   - 고쳐서 커밋·push 하고 다시 확인한다. **초록이 될 때까지 반복한다.**
6. **리뷰 대응** (자동 리뷰 봇이 달렸으면): 지적마다 두 가지를 **나눠** 검증한다.
   - 지적이 유효한가 — 코드로 확인한다. 그대로 믿고 고치지 않는다.
   - 제안된 해법이 이 레포에서 맞는가 — **지적이 맞아도 해법이 틀릴 수 있다.**
   - 반영하면 커밋·push, 반영하지 않으면 이유를 코멘트로 회신한다. 새 지적이 없을 때까지 반복한다.
7. **종료 보고**: CI 초록 + 미대응 지적 없음이 되면 **"머지 가능"** 을 커밋·CI·리뷰 대응 요약과 함께 보고한다. **머지는 사용자가 한다** (명시 위임 시에만 실행).

## 금지

- **CI 가 빨간 채로 사용자에게 넘기고 기다리기** — 원인을 읽고 고치는 것까지가 이 스킬이다.
- 리뷰 지적을 검증 없이 그대로 반영하기.
- `main` 직접 푸시, `push --force` (AGENTS.md 10장).

## 규칙

- 승인된 스펙 파이프라인 안에서는 이 스킬 전체가 자동으로 돈다. 스펙 없는 작업이면 PR 생성 전에 사용자 승인을 받는다 (AGENTS.md 10장).
- 브랜치 전략은 GitHub Flow(main + feature 브랜치 + PR)다.
