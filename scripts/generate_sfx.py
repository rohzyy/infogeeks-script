#!/usr/bin/env python3
"""Procedurally synthesise every sound effect used in the film.

All effects are original, generated from noise and simple oscillators with a
fixed random seed, so they are reproducible and carry no third-party licence.
None contains speech, melody or rhythm. Output: 48 kHz 16-bit stereo WAV in
public/assets/sound_effects/.

Usage: python3 -I scripts/generate_sfx.py
"""
import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'sound_effects')
rng = np.random.default_rng(20261014)


def t(dur):
    return np.arange(int(dur * SR)) / SR


def onepole_lp(x, cutoff):
    """One-pole low-pass with per-sample cutoff (array or scalar)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def hp(x, cutoff):
    return x - onepole_lp(x, cutoff)


def norm(x, peak):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def fade(x, fin=0.005, fout=0.02):
    n_in, n_out = int(fin * SR), int(fout * SR)
    env = np.ones(len(x))
    if n_in:
        env[:n_in] = np.linspace(0, 1, n_in)
    if n_out:
        env[-n_out:] = np.linspace(1, 0, n_out)
    return x * env


def stereo(x, pan=0.0):
    """pan: -1 left .. 1 right, scalar or array."""
    pan = np.broadcast_to(np.asarray(pan, dtype=float), x.shape)
    l = x * np.cos((pan + 1) * np.pi / 4)
    r = x * np.sin((pan + 1) * np.pi / 4)
    return np.stack([l, r], axis=1)


def write(name, data):
    if data.ndim == 1:
        data = stereo(data)
    pcm = (np.clip(data, -1, 1) * 32767).astype('<i2')
    path = os.path.join(OUT, f'{name}.wav')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f'{name:14s} {len(data) / SR:5.2f}s')


def whoosh(dur, lo, hi, peak, pan_sweep=0.5):
    x = rng.standard_normal(int(dur * SR))
    tt = t(dur) / dur
    bell = np.sin(np.pi * tt) ** 2.2
    cutoff = lo + (hi - lo) * np.sin(np.pi * tt) ** 1.5
    y = hp(onepole_lp(onepole_lp(x, cutoff), cutoff), 120)
    y = norm(y * bell, peak)
    return stereo(fade(y), pan=np.linspace(-pan_sweep, pan_sweep, len(y)))


def thud(dur, f0, f1, peak, noise=0.25):
    tt = t(dur)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) * np.exp(-tt * 5.5)
    n = onepole_lp(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 40) * noise * 6
    return norm(fade(body + n, 0.001, 0.05), peak)


def click(dur, freq, peak, lp=6000):
    tt = t(dur)
    n = onepole_lp(rng.standard_normal(len(tt)), lp) * np.exp(-tt * 300)
    tone = np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 160) * 0.5
    return norm(fade(n + tone, 0.0005, 0.01), peak)


def main():
    os.makedirs(OUT, exist_ok=True)

    write('whoosh_soft', whoosh(0.85, 400, 4200, 0.45))
    write('whoosh_low', whoosh(1.3, 150, 1500, 0.55, pan_sweep=0.25))
    write('impact_soft', thud(1.6, 90, 42, 0.7))
    write('stamp', thud(0.45, 220, 110, 0.6, noise=0.6))
    write('click', click(0.06, 2300, 0.4))
    write('tick', click(0.05, 3400, 0.28, lp=9000))

    # Keyboard typing: irregular key clicks, no rhythm grid.
    dur = 2.4
    y = np.zeros(int(dur * SR))
    pos = 0.05
    while pos < dur - 0.1:
        k = click(0.045, rng.uniform(1500, 2600), rng.uniform(0.18, 0.32), lp=rng.uniform(3500, 6500))
        i = int(pos * SR)
        y[i:i + len(k)] += k
        pos += rng.uniform(0.07, 0.19) + (0.25 if rng.random() < 0.08 else 0)
    write('typing', fade(y, 0.002, 0.05))

    # Notification: a single soft "blop" with a falling pitch (not a melody).
    tt = t(0.32)
    f = 700 + 500 * np.exp(-tt * 30)
    blop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14)
    write('notify', norm(fade(blop, 0.002, 0.05), 0.32))

    # Data blip for counters.
    tt = t(0.12)
    b = np.sin(2 * np.pi * 1500 * tt) * np.exp(-tt * 45) + 0.3 * np.sin(2 * np.pi * 3000 * tt) * np.exp(-tt * 70)
    write('blip', norm(fade(b, 0.001, 0.02), 0.22))

    # Low pulse for the map arrival ripple.
    tt = t(1.1)
    p = np.sin(2 * np.pi * 62 * tt) * np.exp(-tt * 3.2) * (0.7 + 0.3 * np.cos(2 * np.pi * 7 * tt))
    write('pulse', norm(fade(p, 0.01, 0.1), 0.5))

    # Shimmer: sparse high grains for the selection moment.
    dur = 1.2
    s = np.zeros(int(dur * SR))
    for _ in range(70):
        i = int(rng.uniform(0, dur - 0.05) * SR)
        g = hp(rng.standard_normal(int(0.012 * SR)), 5000) * np.hanning(int(0.012 * SR))
        s[i:i + len(g)] += g * rng.uniform(0.2, 1.0)
    s *= np.sin(np.pi * t(dur) / dur)
    write('shimmer', stereo(norm(s, 0.18), pan=rng.uniform(-0.4, 0.4)))

    # Paper handling.
    dur = 0.7
    x = rng.standard_normal(int(dur * SR))
    am = onepole_lp(np.abs(rng.standard_normal(len(x))) ** 3, 25)
    paper = hp(onepole_lp(x, 5500), 900) * am * np.sin(np.pi * t(dur) / dur)
    write('paper', norm(fade(paper), 0.3))

    # Ambience beds (quiet, no voices, no tonal content). 9 s each.
    dur = 9.0
    tt = t(dur)

    def bed(lp1, lp2, swell_rate, peak, seed_pan):
        n = rng.standard_normal(len(tt))
        brown = onepole_lp(n, lp1)
        air = hp(onepole_lp(rng.standard_normal(len(tt)), lp2), 200) * 0.25
        sw = 0.75 + 0.25 * np.sin(2 * np.pi * swell_rate * tt + rng.uniform(0, 6))
        mix = norm(brown, 1) + air
        return stereo(norm(fade(mix * sw, 0.6, 0.8), peak), pan=seed_pan)

    write('amb_city', bed(180, 2500, 0.11, 0.22, -0.1))
    write('amb_airport', bed(300, 4000, 0.07, 0.2, 0.1))
    # Road: slow swells of passing traffic.
    n = onepole_lp(rng.standard_normal(len(tt)), 260)
    passes = sum(np.exp(-((tt - c) ** 2) / (2 * 0.9 ** 2)) for c in (1.5, 3.7, 6.1, 8.0))
    write('amb_road', stereo(norm(fade(norm(n, 1) * (0.35 + passes), 0.5, 0.8), 0.26), pan=np.sin(tt * 0.7) * 0.4))


if __name__ == '__main__':
    main()
