# 모바일 적용 가능성

검토일: 2026-10-12. 아래는 구현 후보이며 이 저장소에 모바일 앱·모바일 웹 지원이 구현되었다는 뜻은 아니다.

| 환경 | 접근 | 검증해야 할 제약 |
| --- | --- | --- |
| Android 공식 YouTube 앱 | 별도 앱의 접근성 서비스로 댓글 영역을 감지하고 접근성 오버레이로 가리는 설계 | 실제 기기의 댓글 감지 정확도, 최초 노출 타이밍, 화면 변화 대응. 사용자의 접근성 권한 활성화와 Google Play 권한 공개·심사 필요 |
| iPhone 공식 YouTube 앱 | 일반 앱이 다른 앱의 일부 UI를 수정·덮는 범용 경로는 제공되지 않음 | iOS 앱 격리 구조에 따른 제한 |
| 모바일 웹 | Android Firefox 확장 또는 iPhone Safari 웹 확장으로 포팅 | 모바일 YouTube의 DOM 대응, 브라우저별 패키징과 검증. 공식 앱에서의 시청과는 별개 |

기존 콘텐츠 스크립트와 안내 문구를 재사용하기 쉬운 후보는 모바일 웹 확장이다. 공식 앱이 핵심이면 Android의 감지·가리기만 담당하는 시제품을 먼저 검증하는 방향이 적합하다. 기기에서 검증하기 전에는 공식 앱 지원이나 첫 노출 완전 차단을 약속하지 않는다.

공식 근거:

- [Android 접근성 서비스](https://developer.android.com/guide/topics/ui/accessibility/service)
- [Android 접근성 오버레이](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo#TYPE_ACCESSIBILITY_OVERLAY)
- [Google Play 접근성 API 정책](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en)
- [Apple 앱 격리](https://support.apple.com/en-gb/guide/security/sec15bfe098e/web)
- [Firefox Android 확장](https://support.mozilla.org/en-US/kb/find-and-install-add-ons-firefox-android)
- [Safari 웹 확장](https://developer.apple.com/safari/extensions/)
