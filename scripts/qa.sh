#!/usr/bin/env bash
# Quality assurance on a rendered file.
#   bash scripts/qa.sh output/H1B_Visa_AssemblyCut_1080p.mp4 [expected_width expected_height]
# Writes production/qa/<name>.txt and a contact sheet production/qa/<name>_contact.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
F="$1"; EW="${2:-}"; EH="${3:-}"
N="$(basename "${F%.*}")"
mkdir -p production/qa
R="production/qa/$N.txt"
STRIP="node --experimental-strip-types --no-warnings"
{
echo "QA report for $F  ($(date -u +%FT%TZ))"
echo "== Container / streams"
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,pix_fmt,channels,sample_rate -of default=nw=1 "$F"
echo "== Exact frame count (decoded)"
FR=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 "$F")
echo "frames=$FR (expected 37800 for full film)"
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=nw=1:nk=1 "$F")
H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=nw=1:nk=1 "$F")
[ -n "$EW" ] && { [ "$W" = "$EW" ] && [ "$H" = "$EH" ] && echo "resolution OK ${W}x${H}" || echo "RESOLUTION MISMATCH ${W}x${H} != ${EW}x${EH}"; }
echo "== True-black gaps (>0.5 s; pixel luma <= 0.03, below the 0.055 charcoal design background)"
ffmpeg -hide_banner -nostats -i "$F" -vf "blackdetect=d=0.5:pix_th=0.03:pic_th=0.98" -an -f null - 2>&1 | grep -o "black_start.*" || echo "none"
echo "== Loudness (EBU R128) and true peak"
ffmpeg -hide_banner -nostats -i "$F" -vn -af "ebur128=peak=true" -f null - 2>&1 | sed -n '/Summary/,$p'
echo "== Silences longer than 6 s at -60 dB (expected: graphics-only passages)"
ffmpeg -hide_banner -nostats -i "$F" -vn -af "silencedetect=n=-60dB:d=6" -f null - 2>&1 | grep -E "silence_(start|end)" | wc -l | xargs echo "silence events:"
echo "== Audio provenance"
echo "Composition audio sources: only <Audio> elements in src/Documentary.tsx fed by public/assets/sound_effects (synthesised). OffthreadVideo is muted:"
grep -n "muted" src/scenes/Stock.tsx
grep -rn "<Audio" src | grep -v "src/Documentary.tsx" && echo "WARNING: extra audio source" || echo "no other <Audio> sources"
echo "== Text audit"
$STRIP scripts/text-audit.mjs
echo "== Timing map"
$STRIP scripts/build-timing.mjs
} 2>&1 | tee "$R"

# Contact sheet: one frame from the middle of every 4th scene + every evidence/key graphic.
$STRIP -e '
const t=JSON.parse(require("fs").readFileSync("production/timing-map.json","utf8"));
const keep=t.scenes.filter((s,i)=>i%3===0||["evidence","chapter","ladder","cap","countrycap","backlog","projection","timeline","verdict","risks","checkpoint","highway","endcard"].includes(s.type));
console.log(keep.map(s=>((s.startFrame+Math.floor(s.durationFrames*0.65))/30).toFixed(3)+" "+s.id+" "+s.start.slice(0,5)).join("\n"));' > /tmp/qa_times.txt
TMP=$(mktemp -d)
i=0
while read -r T ID TC; do
  ffmpeg -nostdin -hide_banner -loglevel error -y -ss "$T" -i "$F" -frames:v 1 -vf "scale=640:-1,drawbox=y=ih-34:w=iw:h=34:color=black@0.75:t=fill,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf:text='$TC  $ID':x=10:y=h-26:fontsize=18:fontcolor=white" "$TMP/$(printf %04d $i).jpg"
  i=$((i+1))
done < /tmp/qa_times.txt
COLS=6
ffmpeg -hide_banner -loglevel error -y -framerate 1 -i "$TMP/%04d.jpg" -vf "tile=${COLS}x$(( (i+COLS-1)/COLS )):padding=6:margin=6:color=0x222222" -frames:v 1 "production/qa/${N}_contact.jpg"
rm -rf "$TMP"
echo "contact sheet: production/qa/${N}_contact.jpg ($i frames; labels are added to the sheet only, not the video)" | tee -a "$R"
