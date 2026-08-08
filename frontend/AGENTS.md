# frontend — my-ai-server

> 프론트엔드(React + TS + Vite) 스택 규칙. 공통 규칙(에이전트 행동·작업 관리·Git·한국어)은 루트 `AGENTS.md` 를 따른다.
>
> 이 폴더가 만드는 것은 **Abyssey** 랜딩이다 (프로젝트명 `my-ai-server`, 서비스명 `Abyssey` — 루트 AGENTS.md 네이밍 원칙).

## 기술 스택

- React 19 / TypeScript / Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인) — **현재는 셋업만 되어 있고 실제 스타일은 `index.css`** (아래 "스타일" 참조)
- oxlint (린터) — `npm run lint`

## 프로젝트 구조

```
frontend/
  src/
    main.tsx          진입점
    App.tsx           페이지 조립 (섹션 나열)
    index.css         디자인 토큰 + 전체 스타일
    components/       프레젠테이션 컴포넌트 (Nav, Hero, Floor, Footer …)
    abyss.ts          useAbyss — 캔버스·스크롤 (ref 로 DOM 직접 제어)
    useReveal.ts      useReveal — IntersectionObserver 페이드업
  public/             정적 에셋 (로고·바닥 이미지)
  vite.config.ts      플러그인 + dev 프록시
```

## 검증 명령

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run lint     # oxlint — warning 도 0 이어야 한다
npm run build    # tsc -b + vite build — 타입 검사까지 함께 돈다
```

- 코드를 고쳤으면 최소한 `npm run lint` 와 `npm run build` 가 통과해야 한다.
- 파일 수정마다 PostToolUse 훅이 `oxlint --deny-warnings` 를 자동 실행한다 (루트 `.claude/settings.json`).

## 코드 컨벤션

- **컴포넌트**: 파일 하나에 컴포넌트 하나, `export default function 컴포넌트명()`. 파일명은 PascalCase (`Hero.tsx`).
- **훅**: `use` 접두 + camelCase 파일명 (`useReveal.ts`). 훅은 `src/` 바로 아래, 컴포넌트는 `components/`.
- **props 타입**: 인라인으로 적는다. props 가 3개를 넘으면 그때 `type` 으로 뽑는다 — 미리 만들지 않는다.
- **상수**: 컴포넌트 밖에 대문자로 (`const LINKS = [...]`). 렌더마다 새로 만들지 않는다.
- **DOM 직접 제어**: 캔버스·스크롤처럼 매 프레임 도는 것만 `ref` 로 직접 만진다. 그 외에는 상태로 다룬다.
- 상태 관리 라이브러리·라우터는 **없다.** 필요해지기 전에 넣지 않는다.

## 스타일

- **디자인 토큰은 `index.css` 의 CSS 변수**다 (`--cyan`, `--foam`, `--surface` …). 색·폰트를 컴포넌트에 하드코딩하지 않는다.
- Tailwind 는 플러그인만 붙어 있고 실제 스타일은 `index.css` 의 일반 CSS 다. 검증된 목업 CSS 를 그대로 옮겨 시각 회귀를 0 으로 만든 결과다 (`specs/2026-06-27-abyssey-landing/04_notes.md`).
- 새 스타일도 당분간 `index.css` 에 CSS 변수를 써서 적는다. Tailwind 유틸리티로 갈아탈지는 별도 결정 사항이다.
- 랜딩 디자인의 함정(빔 blur 순서, 빔 세로 기준 등)은 `specs/2026-06-27-abyssey-landing/04_notes.md` 에 있다. **디자인을 고치기 전에 먼저 읽는다.**

## 백엔드 연동

- dev 서버가 `/health` 와 `/api` 를 `http://localhost:5555` 로 프록시한다 (`vite.config.ts`).
- 배포 환경의 백엔드 주소는 아직 연결되어 있지 않다. 연동할 때 `VITE_API_URL` 환경변수와 CORS 를 함께 정한다 (`docs/infra.md`).

## 규모가 커지면

지금은 랜딩 한 장이라 `components/` 평면 구조로 충분하다. 페이지가 여러 개가 되고 도메인별 상태·API 가 생기면 **FSD(Feature-Sliced Design)** 로 옮긴다 — 레이어는 `app → pages → widgets → features/entities → shared` 이고 위 레이어만 아래를 참조한다. 지금 미리 만들지 않는다.
