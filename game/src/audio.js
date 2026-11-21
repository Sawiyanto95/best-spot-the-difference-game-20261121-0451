// Selisih Senja — efek suara disintesis dengan WebAudio, tanpa berkas audio.
// Semua bunyi dibuat dari osilator, jadi game tetap tanpa permintaan jaringan.
let audioContext = null;
let muted = false;

function ensureContext() {
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function tone(freq, startAt, duration, type, volume) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

export function unlockAudio() {
  ensureContext();
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

// Bunyi "pling" ceria saat perbedaan ditemukan.
export function playFound() {
  tone(880, 0, 0.18, 'sine', 0.25);
  tone(1318, 0.07, 0.25, 'sine', 0.22);
}

// Bunyi rendah saat klik meleset.
export function playMiss() {
  tone(160, 0, 0.22, 'sawtooth', 0.12);
}

// Bunyi petunjuk: dua nada naik.
export function playHint() {
  tone(660, 0, 0.12, 'triangle', 0.18);
  tone(990, 0.1, 0.16, 'triangle', 0.18);
}

// Arpeggio kemenangan saat satu level selesai.
export function playLevelClear() {
  [523, 659, 784, 1046].forEach((freq, i) => tone(freq, i * 0.11, 0.3, 'triangle', 0.2));
}

// Fanfare saat seluruh permainan selesai.
export function playWin() {
  [523, 659, 784, 1046, 784, 1046, 1318].forEach((freq, i) => tone(freq, i * 0.13, 0.35, 'triangle', 0.2));
}
