# 인프라 / 배포

> 이 프로젝트의 배포 인프라와, **AI(에이전트)가 인프라를 직접 제어하는 법**을 정리한다.
> 사람이 한 번 토대를 깔면, 이후 운영(배포·리소스 생성)은 AI가 gcloud 등으로 직접 한다.

## 결정 (무엇을 / 왜)

| 영역 | 선택 | 왜 |
|---|---|---|
| **BE** | **Cloud Run (GCP)** | 서버리스 컨테이너 — idle이면 0으로 내려가 비용 $0, 월 무료한도 큼. 도커 그대로 굴림. **GCP라 DB(Cloud SQL)·MQ(Pub/Sub)·관측성까지 천장 없이 확장**. |
| **FE** | **Cloudflare Pages** | 정적 빌드(Vite) 호스팅, 무료 한도 넉넉, 카드 불필요. |
| 과금 철학 | 무료 → 초과 시 종량 | 저트래픽 단계는 사실상 $0. 단 GCP는 하드 상한이 없으니 **예산 알림** 권장. |

- 다른 후보 비교: BE는 Render/Railway/Fly(도커 PaaS)도 있으나 MQ·다양한 DB·관측성에서 천장이 빨라 GCP를 택함.
- best-of-breed라 DB/MQ는 필요 시 GCP 네이티브(Cloud SQL/Pub/Sub) 또는 외부 무료(Neon/Upstash)로.

## 현재 상태 (2026-06-28)

- GCP 프로젝트 `abyssey` (number 9242752760), 결제 계정 연결됨.
  (⚠️ 네이밍 원칙상 인프라는 `my-ai-server`가 맞지만 프로젝트 ID는 변경 불가 — "Abyssey 서비스를 담는 그릇"으로 읽고 유지. 필요하면 콘솔 표시명만 변경 가능)
- 서비스 계정 `abyssey-sa@abyssey.iam.gserviceaccount.com` (Owner), 키 = `secrets/gcp-sa.json`.
- 활성화된 API: Cloud Run / Cloud Build / Artifact Registry / Resource Manager / Service Usage.
- **FE 배포 완료**: Cloudflare Pages 프로젝트 `my-ai-server` → **https://my-ai-server.pages.dev** (라이브).
- **BE 배포 완료** (2026-07-12): Cloud Run 서비스 `my-ai-server`(서울) → **https://my-ai-server-9242752760.asia-northeast3.run.app** (`/health` 라이브).

### BE (Cloud Run) — 배포됨

- 서비스 `my-ai-server` / 리전 `asia-northeast3` / 공개(allUsers invoker) / **min 0(idle $0)·max 2** / 512Mi·1CPU / env `MY_*`
- 이미지: Artifact Registry `asia-northeast3-docker.pkg.dev/abyssey/my-ai-server/backend:sha-<커밋7자리>` (latest 금지)
- 배포 절차 (AI가 gcloud로 직접 — 상세·함정은 `specs/2026-07-12-be-cloud-run-deploy/`):

  ```bash
  docker build --platform linux/amd64 -t <이미지:sha-태그> -f backend/docker/Dockerfile backend
  docker push <이미지:sha-태그>
  gcloud run deploy my-ai-server --image <이미지:sha-태그> --region asia-northeast3
  ```

- ⚠️ SA는 **Owner 필요** — Editor면 배포는 되나 공개(IAM) 설정에서 막힘 (2026-07-12 Editor→Owner 상향으로 해결).

### FE (Cloudflare Pages) — 배포됨
- 프로젝트: `my-ai-server` / 주소: `my-ai-server.pages.dev`
- GitHub `bysssss/my-ai-server` 연동, **Production branch `main` → push 시 자동 재빌드·배포**.
- 빌드 설정: Framework preset **None**, **Root directory `frontend`**, Build `npm run build`, Output `dist`.
  (Cloudflare preset 목록엔 Vite가 없음 — Vite는 프레임워크가 아니라 빌드도구라서. preset None + 위 값 수동 지정.)

## AI가 인프라를 제어하는 법

작업 대상에 맞는 키를 `secrets/`에서 골라 쓴다 (라우팅·상세는 `secrets/README.md`). 머신 전역 로그인에 기대지 않는다.

### GCP (gcloud)

```bash
gcloud auth activate-service-account --key-file=secrets/gcp-sa.json
gcloud config set project abyssey
# 이후 gcloud 로 배포·리소스 제어 (예: gcloud run deploy ...)
```

- ⚠️ `secrets/gcp-sa.json` = 프로젝트 전권. **절대 커밋·공유 금지** (gitignore됨).
- ⚠️ 인증 시 gcloud 머신 전역 활성 계정이 바뀜 → 다른 GCP 프로젝트 작업 시 계정 전환.

### GitHub (gh)

```bash
GH_TOKEN=$(cat secrets/github-token.txt) gh <명령>
```

- 이슈·PR·레포 관리 등 gh API 작업을 **bysssss 명의**로 실행 (fine-grained PAT, `my-ai-server` 한정).
- git push/pull 은 머신 SSH 키로 동작 — 토큰과 무관.

## 최초 셋업 절차 (사람이 1회)

### GCP (BE)

1. GCP 콘솔에서 프로젝트 생성 + 결제 계정 연결.
2. IAM → 서비스 계정 생성 → 역할 Owner → 키 추가(JSON) 다운로드.
3. 키를 `secrets/gcp-sa.json` 으로 저장.
4. (이후 AI가) gcloud 인증 + 필요한 API 활성화(`gcloud services enable ...`).
5. (권장) 결제 → 예산 및 알림 설정.

### GitHub (레포 관리 PAT)

1. `bysssss` 로그인 → Settings → Developer settings → Fine-grained tokens 발급
   (Repository `my-ai-server` 한정, Contents·Issues·Pull requests·Actions·Workflows = RW).
2. `secrets/github-token.txt` 로 저장.

### Cloudflare Pages (FE)

1. dash.cloudflare.com 가입 (카드·API 키 불필요).
2. Workers & Pages → Pages → **Connect to Git** → GitHub 인증 → 레포 선택.
   (새 UI는 Workers가 기본이라 "Looking to deploy Pages? Get started" 링크로 진입)
3. 빌드 설정: preset **None** / Root `frontend` / Build `npm run build` / Output `dist` → Save and Deploy.
4. 끝 — 이후 `main` push마다 자동 배포. main 외 브랜치 push는 **프리뷰 URL**(해시.my-ai-server.pages.dev)이 자동 생성된다(프로덕션과 별개).

## 배포 방법

- **FE → Cloudflare Pages**: ✅ 완료 (위 "FE — 배포됨" 참조). `main` push 시 자동 배포.
- **BE → Cloud Run**: ✅ 완료 (위 "BE — 배포됨" 참조). 현재는 AI가 gcloud로 수동 배포 — 깃액션 자동화는 브랜치 전략과 묶어 추후.
- **연동(예정)**: FE에서 BE API 주소(`VITE_API_URL` 환경변수) + CORS 설정 필요.
