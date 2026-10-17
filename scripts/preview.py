"""Serve a local fixture using exactly the extension's content files."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

root = Path(__file__).resolve().parent.parent
class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path in ("/watch", "/preview/watch", "/"):
            self.path = "/preview/index.html"
        super().do_GET()


handler = partial(PreviewHandler, directory=str(root))
server = ThreadingHTTPServer(("127.0.0.1", 4173), handler)
print("Preview: http://127.0.0.1:4173/watch?v=example-video", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
