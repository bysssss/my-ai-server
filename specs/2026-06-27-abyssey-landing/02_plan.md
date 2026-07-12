# 계획

## 접근

- 디자인 느낌은 이미 **목업으로 확정**됨 (`abyssey-hero.mockup.html`, 사용자 OK).
- 이 목업을 그대로 React + TS + Tailwind 컴포넌트로 이식하는 게 핵심.
- 무드(배경 그라데이션·빛줄기·marine snow·바닥 글로우·수심계)는 `<canvas>` + 스크롤 연동 JS → React는 `useEffect`로 포팅. (caustics·글린트는 제거됨)

## 확정된 스택/결정 (재논의 X)

- FE 스택: **Vite + React + TypeScript** (팀 표준, member-fe 등과 동일)
- 스타일: **Tailwind** (Vite+React에 자연스럽고 AI가 클래스 다 써줘서 학습부담 적음)
- FE는 **도커 안 씀** — 개발 `npm run dev`, 배포는 정적 빌드. 도커는 BE만.
- 첫 페이지 = 심연 스크롤 Hero + 구도용 섹션.

## 단계

- [x] 1. `frontend/` 구동 — `npm install` 완료 (React 19 / Vite 8 / Tailwind v4)
- [x] 2. 목업(`abyssey-hero.mockup.html`)을 React 컴포넌트로 이식 — 완료, 배포까지 됨(my-ai-server.pages.dev)
      - 심연 canvas(배경/빛줄기/입자/바닥글로우) → `abyss.ts` useAbyss 훅
      - 우측 수심계(−0m→−6000m→THE FLOOR), Nav, Hero, depth 카피 라인, 3카드, 바닥 reveal, Footer
      - 바닥 beam = wrapper-blur + 이미지에 묶기(`bottom:%`), 브랜드 락업 (04_notes.md 참고)
- [x] 3. 로고·바닥 이미지 적용 (목업 기준 완료): 로고 PNG 배경 투명화 → nav, 바닥 abyss.png(테두리 자름)→JPEG 축소.
      React 이식 때 `frontend/public/`에서 참조.
- [ ] 4. (선택) Vite proxy로 BE `/health` 호출해 화면에 표시 (BE+FE 연결 확인)
- [ ] 5. `frontend/AGENTS.md` (FE 스택 규칙) 작성

## 검증

- `npm run dev`로 로컬 구동 → 스크롤 하강/바닥 reveal/수심계가 목업과 동일하게 동작.
- (4 하면) BE `make be-up` 띄운 상태에서 FE가 `/health` 응답 표시.
