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
- 서비스 계정 `abyssey-sa@abyssey.iam.gserviceaccount.com` (Owner), 키 = `secrets/gcp-sa.json`.
- 활성화된 API: Cloud Run / Cloud Build / Artifact Registry / Resource Manager / Service Usage.
- **아직 안 함**: BE Cloud Run 실제 배포, FE Cloudflare Pages 연동.

## AI가 GCP를 제어하는 법

```bash
gcloud auth activate-service-account --key-file=secrets/gcp-sa.json
gcloud config set project abyssey
# 이후 gcloud 로 배포·리소스 제어 (예: gcloud run deploy ...)
```

- 키 상세·기타 시크릿 규칙은 `secrets/README.md`.
- ⚠️ `secrets/gcp-sa.json` = 프로젝트 전권. **절대 커밋·공유 금지** (gitignore됨).
- ⚠️ 인증 시 gcloud 머신 전역 활성 계정이 바뀜 → 다른 GCP 프로젝트 작업 시 계정 전환.

## 최초 셋업 절차 (사람이 1회)

1. GCP 콘솔에서 프로젝트 생성 + 결제 계정 연결.
2. IAM → 서비스 계정 생성 → 역할 Owner → 키 추가(JSON) 다운로드.
3. 키를 `secrets/gcp-sa.json` 으로 저장.
4. (이후 AI가) gcloud 인증 + 필요한 API 활성화(`gcloud services enable ...`).
5. (권장) 결제 → 예산 및 알림 설정.

## 배포 방법 (예정)

- **BE → Cloud Run**: 배포용 `backend/docker/Dockerfile`에 `$PORT` 바인딩 CMD 추가 후
  `gcloud run deploy` (소스에서 바로 빌드·배포 가능). Cloud Run은 컨테이너가 `0.0.0.0:$PORT`(기본 8080)에 떠야 함.
- **FE → Cloudflare Pages**: GitHub 레포 연동. Root `frontend`, Build `npm run build`, Output `dist`.
  분리 배포라 FE에서 BE API 주소(`VITE_API_URL`) + CORS 설정 필요.
