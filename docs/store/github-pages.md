# 개인정보처리방침 GitHub Pages 배포

## 공개 주소

- 한국어: https://imjaeseokk.github.io/youtube-comment-block/privacy.html
- 영어: https://imjaeseokk.github.io/youtube-comment-block/privacy-en.html

Chrome 웹 스토어 개인정보처리방침 URL에는 한국어 주소를 입력한다. 페이지 안에서 영어로 전환할 수 있다.

## 저장소와 Pages 설정

- 저장소: 공개 `Imjaeseokk/youtube-comment-block`.
- Pages: **Deploy from a branch → main → / (root)**.
- 배포 파일: 이 저장소 루트의 `privacy.html`, `privacy-en.html`, `privacy.css`, `icon.png`, `index.html`, `.nojekyll`.
- `.nojekyll`은 생성한 정적 파일을 Jekyll 변환 없이 그대로 제공한다.
- 개인 블로그 저장소에 잘못 추가했던 정책 파일은 제거한다. 정책은 이 프로젝트 저장소에서 관리·배포한다.

## 수정과 재배포

1. `docs/store/privacy-policy.ko.md`, `privacy-policy.en.md`를 수정한다.
2. 디자인은 `site/privacy.css`에서 수정한다.
3. `python3 scripts/build-privacy-pages.py`를 실행해 루트의 배포 파일을 재생성한다. 미해결 자리표시자가 있으면 생성이 실패한다.
4. 변경을 커밋하고 이 저장소의 `main`에 push한다. GitHub Pages가 자동 배포한다.
5. 배포 실행 결과와 한국어·영어 URL의 HTTP 응답, 내용, 언어 전환을 확인한다.
6. `python3 scripts/package.py`로 스토어 제출 자료도 갱신한다.

별도 서버, JavaScript, 분석 도구, 광고, 외부 폰트는 사용하지 않는다. GitHub Pages 자체의 접속 정보 처리는 정책 본문에서 설명한다.

## 운영자와 연락처

Jaeseok Heo (Imjaeseokk), `kakaokokoa9971@gmail.com`.

## 배포 위치 정정 (2026-10-17)

이전에 개인 블로그에 배포했던 구성을 이 프로젝트 저장소로 옮겼다. 공개 정책 URL의 경로는 그대로 유지한다. 기존 `site/privacy/`의 생성물은 루트로 이동했으며 생성 스크립트의 기본 출력 경로도 루트로 변경했다.
