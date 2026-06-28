# secrets/

AI(에이전트)가 인프라를 직접 제어하기 위한 자격증명·시크릿을 두는 곳.
**이 폴더의 파일은 gitignore 된다** (`secrets/*`). README만 추적된다 — 실제 키는 절대 커밋 금지.

## 파일

| 파일 | 용도 |
|---|---|
| `gcp-sa.json` | GCP 서비스 계정 키(JSON). gcloud가 이걸로 인증해 Cloud Run 등 인프라를 제어한다. |
| `secrets.txt` | (선택) 기타 시크릿·메모 — ⚠️ gitignore 예외라 **커밋되니 민감정보 넣지 말 것**. |

## GCP 인증 (이 키로 gcloud 활성화)

```bash
gcloud auth activate-service-account --key-file=secrets/gcp-sa.json
gcloud config set project <프로젝트ID>
# 라이브러리/SDK가 자동 인식하도록:
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/secrets/gcp-sa.json"
```

생성 방법: GCP 콘솔 → IAM 및 관리자 → 서비스 계정 → 만들기 → 역할 부여 → 키 추가(JSON) → 다운로드 → 이 폴더에 `gcp-sa.json` 으로 저장.
