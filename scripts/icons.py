"""Compatibility entry point for the vector artwork and PNG exporter."""
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
subprocess.run(["node", "scripts/build-assets.cjs"], cwd=root, check=True)
