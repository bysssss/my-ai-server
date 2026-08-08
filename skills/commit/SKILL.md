---
name: commit
description: 팀 규칙(한국어 50자 제목, WHY 본문, 명시적 스테이징)에 맞는 커밋을 만든다. 사용자가 커밋을 요청할 때 사용.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(cd backend && uv run pytest:*), Bash(cd frontend && npm run:*), Read, Grep, Glob
metadata:
  version: 2026.08.0
  role: Git Commit Generator (my-ai-server 팀 규칙)
  applies-to: my-ai-server 모노레포 커밋 생성
---

# commit — 팀 규칙 커밋

## 절차

1. **변경 파악**: `git status --short` 와 `git diff --staged --stat` 로 스테이징 상태를 확인한다.
   - 스테이징이 비어 있으면 변경 파일 목록을 보여주고 무엇을 커밋할지 사용자에게 확인한다.
   - `git add -A` / `git add .` 금지 — 경로를 명시해 스테이징한다.
2. **시크릿 안전확인**: staged 목록에 `secrets/` 키 파일(`gcp-sa.json`, `github-token.txt` 등)이 없는지 확인한다. 있으면 즉시 중단하고 보고한다.
3. **검증** (해당 영역이 변경된 경우만):
   - backend 변경 → `cd backend && uv run pytest -q`
   - frontend 변경 → `cd frontend && npm run build` (타입체크 포함)
   - 문서만 변경 → 생략
4. **메시지 작성**: `git diff --staged` 로 실제 변경을 확인한 뒤 작성한다.
   - 한국어 현재형, 요약 50자 이내, conventional prefix(`feat:` 등) 금지.
   - 본문은 "무엇"이 아니라 **"왜"** — diff 보면 아는 내용은 쓰지 않는다.
   - 트레일러 `Co-Authored-By` 의 모델명은 고정하지 않고 **작성 시점에 실제 응답 중인 모델명**을 넣는다. 메시지를 짧게 다듬는 과정에서도 트레일러를 빼지 않는다.

   ```
   Co-Authored-By: Claude <실제 모델명> <noreply@anthropic.com>
   ```

5. **커밋 후 확인**: `git log --oneline -1` 로 결과를 보고한다. `git push` 는 사용자가 별도로 요청할 때만.

## 예시

좋은 메시지는 이런 모양이다. 제목이 의도를 말하고, 본문이 "왜"와 "무엇이 좋아지는가"를 말한다.

```text
헬스 응답에 실행 환경 노출

배포된 인스턴스가 어느 환경 설정으로 떠 있는지 확인할 방법이 없어,
장애 때 로컬·dev 설정 혼동을 먼저 배제하는 데 시간이 걸렸습니다.

환경값을 응답에 포함해 호출 한 번으로 판별되게 합니다. 값은 이미
설정에 있어 새 의존성은 없습니다.
```

나쁜 예: `헬스 스키마에 stage 필드 추가` — diff 를 보면 아는 내용이고, 왜 필요했는지가 없다.

## 금지

- `--amend` / `reset --hard` / `push --force` (AGENTS.md 10장 금지 명령)
- 사용자 요청 없는 push
- 사용자가 커밋을 요청하지 않았는데 이 스킬을 임의로 실행하는 것 (AGENTS.md 10장)
