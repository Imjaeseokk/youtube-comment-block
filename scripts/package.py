"""Package only the extension files; no build step or runtime dependencies."""
import json
import hashlib
import shutil
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

root = Path(__file__).resolve().parent.parent
extension = root / "extension"
manifest = json.loads((extension / "manifest.json").read_text())
version = manifest["version"]
output = root / "dist" / f"youtube-comment-block-{version}.zip"
output.parent.mkdir(exist_ok=True)


def write_archive(destination, entries):
    with ZipFile(destination, "w", ZIP_DEFLATED) as archive:
        for source, name in sorted(entries, key=lambda entry: str(entry[1])):
            info = ZipInfo(str(name), date_time=(2026, 10, 17, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, source.read_bytes())


write_archive(output, [(p, p.relative_to(extension)) for p in extension.rglob("*") if p.is_file()])
release = root / "release" / version
release.mkdir(parents=True, exist_ok=True)
package = release / output.name
shutil.copy2(output, package)
kit = release / f"youtube-comment-block-store-kit-{version}.zip"
entries = [(package, Path(package.name))]
for directory in (root / "docs" / "store", root / "assets"):
    entries.extend((p, p.relative_to(root)) for p in directory.rglob("*") if p.is_file())
write_archive(kit, entries)
checksums = "".join(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n" for p in (package, kit))
(release / "SHA256SUMS.txt").write_text(checksums)
print(output)
print(kit)
