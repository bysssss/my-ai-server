---
name: create-pr
description: 현재 브랜치를 push하고 main 대상 PR을 팀 규칙(제목 prefix 금지, 본문 존댓말·의도 중심)으로 만든다. 사용자가 PR 생성을 요청할 때 사용.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*), Bash(gh pr:*), Read, Grep
metadata:
  version: 2026.08.0
  role: GitHub PR Generator (my-ai-server 팀 규칙)
  applies-to: my-ai-server main 대상 PR 생성
---

# create-pr — 팀 규칙 PR 생성

## 절차

1. **브랜치 확인**: `git branch --show-current`. `main`이면 중단하고 브랜치부터 만든다 (영어 소문자+하이픈, `feat-`/슬래시 지양 — AGENTS.md 브랜치 규칙).
2. **커밋 확인**: `git log origin/main..HEAD --oneline` 으로 PR에 담길 커밋을 사용자에게 보여준다.
   - `git diff main...HEAD --stat` 으로 실제 변경 파일을 확인한다 (추측으로 본문을 쓰지 않는다).
   - **관련 문서 갱신이 빠져 있으면 먼저 채운다** — 문서는 이 PR에 같이 담는다 (AGENTS.md 10장 PR 루프). 별도 문서 PR을 만들지 않는다.
3. **push**: `git push -u origin <브랜치>`.
4. **PR 생성** — 프로젝트 키로 bysssss 명의 실행:

   ```bash
   GH_TOKEN=$(cat secrets/github-token.txt) gh pr create --base main --title "..." --body "..."
   ```

   - 제목: conventional prefix 금지, 변경 의도가 드러나는 간결한 한국어.
   - 본문: 변경 의도 중심, 존댓말. 말미에 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
5. PR URL을 보고한다. **머지는 사용자가 한다.**
6. **리뷰 루프**: 리뷰 지적이 오면 **코드로 검증한 뒤** 반영하거나, 근거를 들어 유보하고 회신한다. 지적을 그대로 믿고 고치지 않는다. 새 지적이 없을 때까지 반복한다. (AGENTS.md 10장)

## 규칙

- PR 생성은 **매번 새로 승인**받는다 — 이전 승인은 다음 PR에 승계되지 않는다.
- 브랜치 전략은 GitHub Flow(main + feature 브랜치 + PR)다.
