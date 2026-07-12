---
name: create-pr
description: 현재 브랜치를 push하고 main 대상 PR을 팀 규칙(제목 prefix 금지, 본문 존댓말·의도 중심)으로 만든다. 사용자가 PR 생성을 요청할 때 사용.
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*), Bash(gh pr:*), Read, Grep
---

# create-pr — 팀 규칙 PR 생성

## 절차

1. **브랜치 확인**: `git branch --show-current`. `main`이면 중단하고 브랜치부터 만든다 (영어 소문자+하이픈, `feat-`/슬래시 지양 — AGENTS.md 브랜치 규칙).
2. **커밋 확인**: `git log origin/main..HEAD --oneline` 으로 PR에 담길 커밋을 사용자에게 보여준다.
3. **push**: `git push -u origin <브랜치>`.
4. **PR 생성** — 프로젝트 키로 bysssss 명의 실행:

   ```bash
   GH_TOKEN=$(cat secrets/github-token.txt) gh pr create --base main --title "..." --body "..."
   ```

   - 제목: conventional prefix 금지, 변경 의도가 드러나는 간결한 한국어.
   - 본문: 변경 의도 중심, 존댓말. 말미에 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
5. PR URL을 보고한다. **머지는 사용자가 한다.**

## 규칙

- PR 생성은 **매번 새로 승인**받는다 — 이전 승인은 다음 PR에 승계되지 않는다.
- 깃 브랜치 전략은 TBD(현재 main 직접 커밋) — 브랜치 워크플로 도입 시 이 스킬을 쓴다.
