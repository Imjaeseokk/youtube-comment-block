"""Build the public, dependency-free privacy documents from the store Markdown."""
import argparse
import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://imjaeseokk.github.io/youtube-comment-block/"
CONTACT = "kakaokokoa9971@gmail.com"


def inline(text):
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    return re.sub(r"\[([^]]+)\]\((https://[^)]+)\)", r'<a href="\2">\1</a>', text)


def render_markdown(source):
    """The policy source uses headings, paragraphs, inline code/links and lists."""
    output, paragraph, items = [], [], []

    def flush():
        if paragraph:
            output.append("<p>" + inline(" ".join(paragraph)) + "</p>")
            paragraph.clear()
        if items:
            output.append("<ul>" + "".join("<li>" + inline(item) + "</li>" for item in items) + "</ul>")
            items.clear()

    for line in source.splitlines():
        if line.startswith("# "):
            continue
        if line.startswith("시행일:") or line.startswith("Effective:"):
            continue
        if not line.strip():
            flush()
        elif line.startswith("## "):
            flush()
            output.append("<h2>" + inline(line[3:]) + "</h2>")
        elif line.startswith("- "):
            if paragraph:
                flush()
            items.append(line[2:])
        else:
            if items:
                flush()
            paragraph.append(line)
    flush()
    return "\n".join(output)


def page(language, body):
    ko = language == "ko"
    title = "개인정보처리방침" if ko else "Privacy Policy"
    filename = "privacy.html" if ko else "privacy-en.html"
    date = "시행일 2026년 10월 17일 · 버전 0.1.0" if ko else "Effective October 17, 2026 · Version 0.1.0"
    summary = "유튜브 댓글을 원할 때만 표시하기 위해 기기 안에서 어떤 정보를 처리하는지 설명합니다." if ko else "How the extension processes information on your device to show comments only when you choose."
    skip = "본문으로 이동" if ko else "Skip to content"
    return f'''<!doctype html>
<html lang="{language}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{title} | YouTube Comment Block</title>
  <meta name="description" content="{summary}">
  <meta name="color-scheme" content="light dark">
  <link rel="canonical" href="{BASE}{filename}">
  <link rel="alternate" hreflang="ko" href="{BASE}privacy.html">
  <link rel="alternate" hreflang="en" href="{BASE}privacy-en.html">
  <link rel="icon" type="image/png" href="icon.png">
  <link rel="stylesheet" href="privacy.css">
</head>
<body>
<a class="skip" href="#main">{skip}</a>
<header><a class="brand" href="privacy.html"><img src="icon.png" width="40" height="40" alt=""><span>YouTube Comment Block</span></a>
<nav aria-label="Language"><a href="privacy.html" lang="ko"{' aria-current="page"' if ko else ''}>한국어</a><a href="privacy-en.html" lang="en"{'' if ko else ' aria-current="page"'}>English</a></nav></header>
<main id="main"><div class="intro"><p class="eyebrow">YouTube Comment Block</p><h1>{title}</h1><p class="summary">{summary}</p><p class="date">{date}</p></div>
<aside class="facts"><span>{'기기 내 일시 처리' if ko else 'Temporary on-device processing'}</span><span>{'개발자 서버 전송 없음' if ko else 'No developer-server transmission'}</span><span>{'확장 프로그램 분석 도구 없음' if ko else 'No extension analytics'}</span></aside>
<article>{body}</article>
<section class="contact"><h2>{'문의' if ko else 'Contact'}</h2><p>Jaeseok Heo (Imjaeseokk)<br><a href="mailto:{CONTACT}">{CONTACT}</a></p></section>
</main>
<footer><p>YouTube Comment Block · {'YouTube 및 Google과 무관한 독립 확장 프로그램' if ko else 'An independent extension, not affiliated with YouTube or Google'}</p><a href="https://github.com/Imjaeseokk">{'개발자 프로필' if ko else 'Developer profile'}</a></footer>
</body></html>
'''


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for language in ("ko", "en"):
        source = (ROOT / "docs" / "store" / f"privacy-policy.{language}.md").read_text()
        if "{{" in source:
            raise ValueError("Resolve policy placeholders before publishing")
        filename = "privacy.html" if language == "ko" else "privacy-en.html"
        (args.output / filename).write_text(page(language, render_markdown(source)))
    shutil.copyfile(ROOT / "site" / "privacy.css", args.output / "privacy.css")
    shutil.copyfile(ROOT / "extension" / "icons" / "icon128.png", args.output / "icon.png")
    (args.output / "index.html").write_text('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=privacy.html"><link rel="canonical" href="' + BASE + 'privacy.html"><title>YouTube Comment Block · 개인정보처리방침</title></head><body><a href="privacy.html">개인정보처리방침 / Privacy Policy</a></body></html>\n')
    (args.output / ".nojekyll").write_text("")
    print(args.output)


if __name__ == "__main__":
    main()
