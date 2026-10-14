import sys, json, numpy as np, soundfile as sf, sherpa_onnx
wav, model, task, lang, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
limit = int(sys.argv[6]) if len(sys.argv) > 6 else 10**9
audio, sr = sf.read(wav, dtype='float32'); assert sr == 16000
vcfg = sherpa_onnx.VadModelConfig()
vcfg.silero_vad.model = '/tmp/claude-0/asr/silero_vad.onnx'
vcfg.silero_vad.min_silence_duration = 0.35
vcfg.silero_vad.min_speech_duration = 0.25
vcfg.silero_vad.max_speech_duration = 12
vcfg.sample_rate = 16000
vad = sherpa_onnx.VoiceActivityDetector(vcfg, buffer_size_in_seconds=600)
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{model}-encoder.int8.onnx', decoder=f'{model}-decoder.int8.onnx', tokens=f'{model}-tokens.txt', language=lang, task=task, num_threads=4)
segs = []
w = 512
for i in range(0, len(audio), w):
    vad.accept_waveform(audio[i:i+w])
while True:
    vad.flush() if False else None
    break
vad.flush()
while not vad.empty():
    s = vad.front; vad.pop()
    segs.append((s.start / 16000, np.array(s.samples, dtype=np.float32)))
res = []
for st, smp in segs[:limit]:
    stream = rec.create_stream(); stream.accept_waveform(16000, smp); rec.decode_stream(stream)
    r = {'start': round(st, 2), 'end': round(st + len(smp) / 16000, 2), 'text': stream.result.text.strip(), 'lang': getattr(stream.result, 'lang', '')}
    res.append(r); print(r, flush=True)
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
