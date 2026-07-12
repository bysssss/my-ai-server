# 노트 (결정·함정·왜)

> 시간순 로그는 `03_progress.md`. 여기는 디자인 수정 때 참고할 "왜/함정"만 추린다.

## 결정

- **로고·바닥 = PNG.** 사용자가 준 트레이싱 SVG(로고 360KB·70색 / 바닥 4.4MB)는 용량만 크고 화질 이득 0 → PNG가 정답. ("클린 벡터면 SVG가 최고"는 일반론이고, 트레이싱본엔 해당 안 됨.)
- **바닥 이미지는 PNG→JPEG 820px(~220KB)로 축소해 사용** (투명도 불필요, 용량↓). 원본은 `frontend/public/abyss.png` 보관, 웹용은 `abyss.jpg`.
- **로고 배경(다크네이비)은 투명 처리** — Pillow 색-키잉. ImageMagick 없어 scratchpad venv에 Pillow 설치(백엔드 venv 안 건드림). 로고 바뀌면 재실행.
- **브랜드**: "ey"는 색 없이 약한 볼드(wght 400), ".ai"만 시안. 태그라인 `DEEP ALIVE ODYSSEY`는 nav의 Abyssey.ai 밑에만(footer엔 없음). footer는 링크 중앙정렬 + © 만.

## 함정 (gotcha)

- **`clip-path` + `filter:blur` 를 같은 요소에 주면 blur가 안 먹는다.** CSS가 blur→clip 순서라 잘린 대각선이 다시 칼날이 됨. → 빔을 wrapper로 감싸 **부모에 blur**, 자식에 clip-path. (스포트라이트 경계 부드럽게의 핵심)
- **빔 세로는 일부러 이미지에 묶었다** (`.beam-wrap`을 `.relic` 안에, `bottom:40%`). 화면 크기와 무관하게 빛이 해저면(이미지) 아래로 새지 않게 하려는 것 → **고정 height(%)로 되돌리지 말 것.** (빔 너비는 그냥 눈대중 수치 `min(572px,82vw)` — 취향, 세로 로직과 구분.)
- 태그라인 양끝정렬(`text-align-last:justify`)은 글자 간격이 들쭉날쭉해 버림 → 일반 자간으로.
- 미리보기는 claude.ai 아티팩트로 하는데 **CSP가 외부 파일을 차단** → 이미지를 data URI로 임베드해야 보인다 (`scratchpad/inject.py`가 상대경로 src를 data URI로 치환 후 게시).
