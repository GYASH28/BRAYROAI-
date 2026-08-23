from pathlib import Path
import math
import wave
import numpy as np

SR = 48000
DURATION = 5.6
N = int(SR * DURATION)
LEFT = np.zeros(N, dtype=np.float64)
RIGHT = np.zeros(N, dtype=np.float64)
RNG = np.random.default_rng(2808)


def add(buf, start, signal):
    i = int(start * SR)
    if i >= N:
        return
    j = min(N, i + len(signal))
    buf[i:j] += signal[: j - i]


def stereo_add(start, left, right=None):
    if right is None:
        right = left
    add(LEFT, start, left)
    add(RIGHT, start, right)


def lowpass(x, amount=0.94):
    y = np.empty_like(x)
    y[0] = x[0]
    for i in range(1, len(x)):
        y[i] = amount * y[i - 1] + (1 - amount) * x[i]
    return y


def highpass(x, amount=0.92):
    lp = lowpass(x, amount)
    return x - lp


def sub_hit(start, strength=1.0, length=0.9, f0=39.0, stereo=0.01):
    t = np.arange(int(length * SR)) / SR
    env = np.exp(-t / 0.38) * np.minimum(1.0, t / 0.004)
    pitch = f0 * (1.0 + 0.32 * np.exp(-t / 0.07))
    phase = 2 * np.pi * np.cumsum(pitch) / SR
    body = (np.sin(phase) + 0.28 * np.sin(2 * phase) + 0.08 * np.sin(3 * phase)) * env * 0.58 * strength
    click = highpass(RNG.normal(0, 1, len(t)), 0.82) * np.exp(-t / 0.012) * 0.06 * strength
    sig = body + click
    stereo_add(start, sig, np.roll(sig, int(stereo * SR)))


def mechanical_click(start, strength=1.0, pitch=128.0, pan=0.0):
    length = 0.16
    t = np.arange(int(length * SR)) / SR
    transient = highpass(RNG.normal(0, 1, len(t)), 0.86) * np.exp(-t / 0.010) * 0.16 * strength
    shell = (np.sin(2 * np.pi * pitch * t) + 0.55 * np.sin(2 * np.pi * pitch * 1.73 * t)) * np.exp(-t / 0.045) * 0.25 * strength
    knock = np.sin(2 * np.pi * 78 * t) * np.exp(-t / 0.07) * 0.28 * strength
    sig = transient + shell + knock
    l = sig * math.sqrt((1 - pan) * 0.5)
    r = sig * math.sqrt((1 + pan) * 0.5)
    stereo_add(start, l, r)


def metal_latch(start, strength=1.0, pan=0.0):
    length = 0.26
    t = np.arange(int(length * SR)) / SR
    n = highpass(RNG.normal(0, 1, len(t)), 0.78)
    burst = n * np.exp(-t / 0.025) * 0.08 * strength
    ring = (
        np.sin(2 * np.pi * 860 * t) +
        0.7 * np.sin(2 * np.pi * 1330 * t) +
        0.35 * np.sin(2 * np.pi * 2080 * t)
    ) * np.exp(-t / 0.105) * 0.04 * strength
    body = np.sin(2 * np.pi * 112 * t) * np.exp(-t / 0.065) * 0.17 * strength
    sig = burst + ring + body
    l = sig * math.sqrt((1 - pan) * 0.5)
    r = sig * math.sqrt((1 + pan) * 0.5)
    stereo_add(start, l, r)


def whoosh(start, length=0.72, strength=1.0, pan_start=-0.55, pan_end=0.55):
    t = np.arange(int(length * SR)) / SR
    n = lowpass(RNG.normal(0, 1, len(t)), 0.82)
    env = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 1.55
    rumble = np.sin(2 * np.pi * (48 + 16 * t / length) * t) * env * 0.07
    sig = (n * 0.12 + rumble) * env * strength
    pans = np.linspace(pan_start, pan_end, len(sig))
    l = sig * np.sqrt((1 - pans) * 0.5)
    r = sig * np.sqrt((1 + pans) * 0.5)
    stereo_add(start, l, r)


def drone():
    t = np.arange(N) / SR
    slow = 0.54 + 0.46 * np.sin(2 * np.pi * 0.145 * t - 0.6)
    bed = (
        0.050 * np.sin(2 * np.pi * 32 * t) +
        0.036 * np.sin(2 * np.pi * 41 * t + 0.3) +
        0.018 * np.sin(2 * np.pi * 64 * t + 0.6)
    ) * (0.52 + 0.25 * slow)
    texture = lowpass(RNG.normal(0, 1, N), 0.985) * 0.012
    fade_in = np.minimum(1, t / 0.30)
    fade_out = np.minimum(1, np.maximum(0, (DURATION - t) / 0.40))
    sig = (bed + texture) * fade_in * fade_out
    stereo_add(0, sig, np.roll(sig, 43))


drone()

# Brand assembly: dense, physical, progressively heavier.
clicks = [
    (0.78, 0.72, 142, -0.50),
    (0.89, 0.78, 136,  0.38),
    (1.00, 0.84, 132, -0.28),
    (1.12, 0.90, 126,  0.26),
    (1.24, 0.98, 120, -0.18),
    (1.36, 1.04, 116,  0.14),
    (1.49, 1.10, 111, -0.10),
    (1.62, 1.16, 106,  0.08),
    (1.76, 1.24, 101, -0.05),
    (1.91, 1.34,  96,  0.03),
]
for when, strength, pitch, pan in clicks:
    mechanical_click(when, strength, pitch, pan)
    if strength > 1.0:
        metal_latch(when + 0.018, strength * 0.7, -pan * 0.6)

# Low-frequency punctuation.
sub_hit(0.36, 0.72, 0.78, 44)
sub_hit(1.02, 0.62, 0.62, 47)
sub_hit(1.88, 1.04, 0.94, 39)
sub_hit(2.66, 0.72, 0.74, 42)
sub_hit(3.31, 0.82, 0.80, 40)

# Logo resolve / orange scan.
whoosh(1.72, 1.45, 0.55, -0.75, 0.75)
metal_latch(2.22, 1.20, 0.0)
mechanical_click(2.38, 1.16, 92, 0.0)

# Claim arrives with two deliberate mechanical locks.
sub_hit(2.70, 0.88, 0.76, 40)
mechanical_click(2.92, 1.06, 104, -0.18)
metal_latch(3.26, 1.16, 0.20)
mechanical_click(3.55, 0.92, 118, 0.25)

# Final cinematic pass and hero handoff.
whoosh(4.13, 1.12, 1.12, -0.85, 0.85)
sub_hit(4.34, 1.55, 1.18, 34)
metal_latch(4.39, 1.55, 0.0)
mechanical_click(4.56, 1.42, 86, 0.0)
sub_hit(4.61, 1.24, 0.98, 31)

# Gentle air tail into black.
tail_len = int(1.0 * SR)
t = np.arange(tail_len) / SR
tail = lowpass(RNG.normal(0, 1, tail_len), 0.94) * np.exp(-t / 0.38) * 0.025
stereo_add(4.58, tail, np.roll(tail, 61))

# Soft saturation + limiter; preserve bass weight without clipping.
LEFT[:] = np.tanh(LEFT * 1.18)
RIGHT[:] = np.tanh(RIGHT * 1.18)
peak = max(float(np.max(np.abs(LEFT))), float(np.max(np.abs(RIGHT))), 1e-9)
scale = 0.93 / peak
LEFT[:] *= scale
RIGHT[:] *= scale

out = Path(__file__).parent / "assets" / "brayroai-cinematic-sfx.wav"
out.parent.mkdir(parents=True, exist_ok=True)
interleaved = np.column_stack((LEFT, RIGHT))
pcm = np.clip(interleaved * 32767, -32768, 32767).astype(np.int16)
with wave.open(str(out), "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(pcm.tobytes())
print(out)
