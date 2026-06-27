# 진행 로그

> 새 세션은 이 파일부터. (목적/범위 README.md, 계획 plan.md)

## 한 줄 현재 상태

**목업을 React로 이식 완료 — `frontend/`가 실제로 구동됨 (`npm run dev` → http://localhost:5173).**
디자인은 목업과 1:1 (검증된 CSS 그대로 컴포넌트화). 이제 로컬에서 라이브로 보며 편집 가능.

## 산출물 위치

- 목업: `tasks/2026-06-27-abyssey-landing/abyssey-hero.mockup.html` (이미지 `abyss.jpg`·`abyssey.png` 같은 폴더)
- 실제 에셋: `frontend/public/abyssey.png`(투명 로고)·`abyss.png`(원본)·`abyss.jpg`(웹용 축소)
- 미리보기 아티팩트(claude.ai, data URI 임베드본): 스크롤 목업 `…/3209bcc9…`

## 2026-06-27

- 컨셉/스택 확정: Abyssey.ai 랜딩, Vite+React+TS+Tailwind, FE 도커 X.
- 심연 스크롤 Hero 목업 작성 → "느낌 OK" 받음.
- `frontend/`에 Vite(React+TS) 기본 스캐폴드 병합 + package.json에 Tailwind 의존성 추가.
  - **주의: `npm install` 안 함 → 아직 구동 안 됨. 내용도 Vite 데모 그대로.**

## 2026-06-28 (디자인 다듬기 — 전부 목업 파일에 반영됨)

- **canvas 글린트·caustics 제거** (바닥에 떠다니던 점·물웅덩이) → 바닥은 은은한 글로우만.
- **실제 로고 적용**: `Abyssey.png`의 다크네이비 배경을 색-키잉으로 **투명화**(Pillow, scratchpad venv) → nav에 적용.
  - 트레이싱 SVG(`Abyssey.svg` 360KB 70색 / `abyss.svg` 4.4MB)는 **안 씀** — PNG가 정답.
- **바닥 일러스트 적용**: 사용자가 테두리 자른 `abyss.png` → 820px JPEG(약 220KB)로 축소해 사용. 가장자리 CSS mask로 부드럽게.
- **스포트라이트(beam)**:
  - 경계 부드럽게 = **wrapper로 감싸 부모에 blur** (같은 요소에 clip-path+blur 주면 blur 안 먹는 CSS 순서 이슈 회피).
  - 너비 = 눈대중 수치(`min(572px,82vw)`).
  - **세로는 이미지에 묶음**(`.beam-wrap`을 `.relic` 안에, `bottom:40%`) → 화면 크기 무관하게 빛이 이미지(해저면) 아래로 안 샘.
- **브랜드 락업**: nav = `Abyssey.ai` ("ey"는 색 없이 약한 볼드 wght 400, ".ai"만 시안) + 밑에 작은 `DEEP ALIVE ODYSSEY` 태그라인. **footer 로고·텍스트 전부 제거**, 푸터 링크 중앙 정렬.

## 2026-06-28 (React 이식 — frontend 구동)

- `npm install` 완료 (React 19 / Vite 8 / Tailwind v4).
- 목업 → React+TS 컴포넌트: `App` + `Nav`/`DepthRail`/`Hero`/`DepthLine`/`Features`/`Floor`/`Footer` + `SvgDefs`. 캔버스·스크롤은 `abyss.ts`(useAbyss 훅, ref로 DOM 직접), 리빌은 `useReveal.ts`(IntersectionObserver).
- **방침**: 검증된 목업 CSS를 `src/index.css`에 그대로 옮겨 컴포넌트화 → 시각 회귀 0. Tailwind는 셋업만(향후용), 색은 CSS 변수.
- `vite.config.ts`: Tailwind 플러그인 + `/health`·`/api` → localhost:5555 프록시.
- 스캐폴드 잔재 제거(App.css·assets·icons.svg). 에셋은 `public/abyssey.png`·`abyss.jpg`.
- 검증: `npm run build` 통과(타입체크 OK), `npm run dev` → http://localhost:5173 정상 서빙.

## 결정/메모

- 미리보기는 claude.ai 아티팩트로(이미지를 data URI 임베드). 깃 프로젝트와 별개.
- 로고 투명화: ImageMagick 없어 Pillow를 scratchpad venv에 설치해 색-키잉 처리(백엔드 venv 안 건드림).
- 픽셀 단위 디자인 핑퐁이 비효율 → 다음엔 frontend 로컬 구동해 라이브로 보며 편집하기로.

## 다음 (선택)

1. `frontend/` `npm install` → 구동 (Tailwind 등)
2. 목업 → React 컴포넌트 이식 (canvas 훅 + Hero·Nav·섹션·바닥·Footer) → `npm run dev`로 라이브 편집
3. 받은 로고/바닥 이미지 frontend에 정식 배치
