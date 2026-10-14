#!/usr/bin/env bash
# Reproducible render.
#   bash scripts/render.sh preview      -> output/H1B_Visa_Preview_1080p.mp4 (or assembly cut, see below)
#   bash scripts/render.sh final        -> output/H1B_Visa_Final_4K.mp4 (requires every asset; --strict)
#   bash scripts/render.sh prototype    -> output/prototype_4k.mp4
# Long renders can be split: FRAMES=0-18899 bash scripts/render.sh final  (then concat with ffmpeg)
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:-preview}"
STRIP="node --experimental-strip-types --no-warnings"

$STRIP scripts/build-timing.mjs
python3 -I scripts/generate_sfx.py >/dev/null
if [ "$MODE" = "final" ]; then
  $STRIP scripts/check-assets.mjs --strict
else
  $STRIP scripts/check-assets.mjs
fi
$STRIP scripts/build-manifests.mjs

RANGE=()
[ -n "${FRAMES:-}" ] && RANGE=(--frames="$FRAMES")
mkdir -p output

case "$MODE" in
  final)
    npx remotion render src/index.ts H1BDocumentary "${OUT:-output/H1B_Visa_Final_4K.mp4}" \
      --scale=2 --codec=h264 --crf=16 --x264-preset=slow --pixel-format=yuv420p \
      --audio-codec=aac --audio-bitrate=320k "${RANGE[@]}" ;;
  preview)
    # If any stock clip or screenshot is still missing, the output is an
    # assembly cut with labelled placeholder slates and is named accordingly.
    if [ "$(node -e "const m=require('./production/missing-assets.json');console.log(m.stock.length+m.screenshots.length)")" != "0" ]; then
      DEFAULT_OUT=output/H1B_Visa_AssemblyCut_1080p.mp4
    else
      DEFAULT_OUT=output/H1B_Visa_Preview_1080p.mp4
    fi
    npx remotion render src/index.ts H1BDocumentary "${OUT:-$DEFAULT_OUT}" \
      --scale=1 --codec=h264 --crf=20 --pixel-format=yuv420p \
      --audio-codec=aac --audio-bitrate=192k "${RANGE[@]}" ;;
  prototype)
    npx remotion render src/index.ts Prototype output/prototype_4k.mp4 \
      --scale=2 --codec=h264 --crf=18 --audio-codec=aac --audio-bitrate=192k ;;
  *) echo "unknown mode $MODE"; exit 1 ;;
esac
