# 개인정보처리방침 GitHub Pages 배포

배포일: 2026-10-17

## 공개 주소

- 한국어: https://imjaeseokk.github.io/youtube-comment-block/privacy.html
- 영어: https://imjaeseokk.github.io/youtube-comment-block/privacy-en.html

Chrome 웹 스토어의 개인정보처리방침 URL에는 한국어 주소를 입력한다. 페이지 안에서 영어로 전환할 수 있다. 두 주소 모두 로그인이 필요 없는 HTTPS 문서다.

## 저장소와 배포 범위

- 확장 프로그램과 방침 원본: 비공개 `Imjaeseokk/youtube-comment-block`.
- 공개 문서 호스트: 기존 `Imjaeseokk/Imjaeseokk.github.io`, Pages 소스 `master`의 루트.
- 공개 파일: `youtube-comment-block/privacy.html`, `privacy-en.html`, `privacy.css`, `icon.png`, `index.html` 다섯 개.
- 배포 PR: https://github.com/Imjaeseokk/Imjaeseokk.github.io/pull/1
- 배포 커밋: `1bab7054768ca467c7cce7bc26cc63d642e2fcb0`.

Color Remapper가 GitHub Pages에서 `privacy.html`을 공개하는 방식을 참고했다. 이 프로젝트는 기존 공개 Pages 사이트의 하위 경로를 사용한다. 운영 서버의 저장소를 직접 수정하지 않고 별도의 개발용 복제본과 PR을 통해 배포했다. 공개 사이트의 다른 파일이나 Pages 설정은 변경하지 않았다.

## 운영자와 연락처

Jaeseok Heo (Imjaeseokk), `kakaokokoa9971@gmail.com`. 기존 공개 Pages 저장소의 `_config.yml`에 게시된 이름·이메일을 확인해 사용했다. 새 문의 메시지를 보내거나 이메일 수신을 자동화하지 않는다.

## 재생성과 업데이트

1. `docs/store/privacy-policy.ko.md`, `privacy-policy.en.md`를 수정한다.
2. `python3 scripts/build-privacy-pages.py`로 `site/privacy/`의 HTML·CSS·아이콘을 생성한다. 미해결 자리표시자가 있으면 생성이 실패한다.
3. 별도의 개발용 Pages 복제본에서 작업 브랜치를 만든다.
4. `python3 scripts/build-privacy-pages.py --output /절대/경로/Pages-개발용-복제본/youtube-comment-block`로 위 다섯 파일만 준비한다.
5. 파일과 언어 링크를 확인하고 PR로 변경을 반영한다.
6. GitHub Pages 빌드 상태를 확인하고 두 공개 URL·CSS·아이콘의 HTTPS 응답과 내용을 확인한다. 공개 HTML이 생성 원본과 일치하는지 확인한다.
7. Chrome 웹 스토어 등록 문서와 제출 자료 ZIP도 갱신한다.

페이지에는 별도 JavaScript, 분석 도구, 광고 또는 외부 폰트가 없다. GitHub Pages 자체의 접속 정보 처리는 방침 본문에 별도로 설명한다.

## 배포 확인 결과

- GitHub Pages 실행 [39022764377](https://github.com/Imjaeseokk/Imjaeseokk.github.io/actions/runs/39022764377)이 성공했고, Pages API가 위 배포 커밋을 `built`로 확인했다.
- 한국어·영어 HTML, CSS, 아이콘, 진입 페이지 다섯 URL의 HTTPS 응답이 모두 HTTP 200이며, 응답 본문은 생성한 파일과 바이트 단위로 일치했다.
- 로그인 없이 공개 페이지를 열고 한국어 → English → 한국어 링크 전환을 확인했다.
- 최초 배포 당시 공개 페이지 화면: `docs/store/privacy-page-preview.jpg` (제품명 정리 전 기록).

## 제품명 정리 (2026-10-17)

패키지·팝업·스토어 등록 문서의 제품명을 `YouTube Comment Block`으로 통일하고, 한국어·영어 공개 정책에도 반영했다.

- 변경 PR: https://github.com/Imjaeseokk/Imjaeseokk.github.io/pull/2
- 배포 커밋: `b13e4e92621242a2f9a85f1b92706663968a791f`.
- Pages 실행: https://github.com/Imjaeseokk/Imjaeseokk.github.io/actions/runs/39022978502

빌드와 배포 단계는 성공했으며, 내려받은 배포 산출물의 한국어·영어 HTML이 생성 원본과 일치함을 확인했다. 이후 공개 정책 경로는 HTTP 404를 반환했다. 배포 단계 재실행과 새 Pages 빌드 [39023364108](https://github.com/Imjaeseokk/Imjaeseokk.github.io/actions/runs/39023364108) 성공 후에도 같은 상태여서, 공개 주소의 재접속 확인이 남아 있다. 기존 사이트의 홈은 HTTP 200이다. 이 항목은 원격 배포 상태의 제한이며 패키지 ZIP의 제품명 변경은 완료됐다.
