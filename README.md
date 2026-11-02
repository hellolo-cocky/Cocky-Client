# Cocky Client

React, TypeScript, Vite로 만든 Cocky 웹 클라이언트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

Vite 개발 서버는 `/api` 요청을 Cocky API로 프록시합니다. DataGSM 로그인을 사용하려면 `.env.example`을 `.env.local`로 복사한 뒤 `VITE_DATAGSM_CLIENT_ID`를 입력하고, `VITE_DATAGSM_REDIRECT_URI`가 서버의 `DATAGSM_REDIRECT_URI` 및 DataGSM 앱 등록값과 일치하도록 설정합니다. Client Secret은 프론트엔드에 두지 않습니다.

## API 연결

브라우저 API 주소는 `VITE_API_BASE_URL`로 설정합니다. 기본 운영 주소는 `https://cocky-api.https.gsmsv.site/api/v1`이며, 개발 환경은 Vite 프록시를 사용합니다.

문제 조회, DataGSM 로그인, 사용자 정보/익명 설정, 코드 실행 및 제출, 제출 기록/피드백, 기간별 피드백, 랭킹, 현재 회차/주제 조회를 연결했습니다. Cocky-Server에 게시판, 일정 저장, 사용자 회고 작성 API는 아직 없어 해당 기능은 화면에서만 동작합니다.
