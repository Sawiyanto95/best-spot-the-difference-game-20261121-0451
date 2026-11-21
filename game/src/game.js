// Selisih Senja — mesin permainan: status, klik, timer, petunjuk, skor,
// dan semua gambar penanda di atas kedua panel.
import { LEVELS, SCENE_WIDTH, SCENE_HEIGHT } from './levels.js';
import { paintScene } from './scenes.js';
import {
  unlockAudio, setMuted, isMuted,
  playFound, playMiss, playHint, playLevelClear, playWin,
} from './audio.js';

const MARKER_COLOR = '#ff2e4d';
const HINT_COLOR = '#ffd23f';
const MISS_PENALTY_SECONDS = 5;
const MAX_MISTAKES = 3;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export class SpotGame {
  constructor(elements) {
    this.el = elements;
    this.ctxA = elements.canvasA.getContext('2d');
    this.ctxB = elements.canvasB.getContext('2d');
    this.screen = 'menu';
    this.levelIndex = 0;
    this.found = new Set();
    this.foundAt = new Map();
    this.mistakes = 0;
    this.score = 0;
    this.timeLeft = 0;
    this.hintsLeft = 0;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.timerId = null;
    this.lastTick = 0;
    this.levelStartScore = 0;
    this.starsEarned = [];
    this.bindInput();
    this.showMenu();
    this.loop();
  }

  // ---- masukan ------------------------------------------------------------
  bindInput() {
    const { canvasA, canvasB, hintBtn, soundBtn } = this.el;
    for (const canvas of [canvasA, canvasB]) {
      canvas.addEventListener('pointerdown', (event) => {
        unlockAudio();
        this.onBoardClick(canvas, event);
      });
    }
    hintBtn.addEventListener('click', () => {
      unlockAudio();
      this.useHint();
    });
    soundBtn.addEventListener('click', () => {
      unlockAudio();
      setMuted(!isMuted());
      soundBtn.textContent = isMuted() ? '🔇' : '🔊';
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'h' || event.key === 'H') this.useHint();
      if (event.key === 'm' || event.key === 'M') soundBtn.click();
      if (event.key === 'r' || event.key === 'R') {
        if (this.screen === 'playing') this.startLevel(this.levelIndex);
      }
      if (event.key === 'Enter') {
        if (this.screen === 'menu') this.startGame();
        else if (this.screen === 'levelClear') this.nextLevel();
        else if (this.screen === 'gameOver' || this.screen === 'win') this.startLevel(this.screen === 'win' ? 0 : this.levelIndex);
      }
      if (this.screen === 'menu' && ['1', '2', '3'].includes(event.key)) {
        this.startLevel(Number(event.key) - 1);
      }
    });
  }

  boardPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * SCENE_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * SCENE_HEIGHT,
    };
  }

  onBoardClick(canvas, event) {
    if (this.screen !== 'playing') return;
    const point = this.boardPoint(canvas, event);
    const level = LEVELS[this.levelIndex];
    const hit = level.differences.find((diff) => {
      if (this.found.has(diff.id)) return false;
      const dx = point.x - diff.x;
      const dy = point.y - diff.y;
      return Math.hypot(dx, dy) <= diff.r;
    });
    if (hit) this.registerFind(hit);
    else this.registerMiss(point);
  }

  registerFind(diff) {
    this.found.add(diff.id);
    this.foundAt.set(diff.id, performance.now());
    this.score += 100;
    playFound();
    const level = LEVELS[this.levelIndex];
    const remaining = level.differences.length - this.found.size;
    this.setMessage(`Ketemu! ${diff.label} — tinggal ${remaining} lagi. 🎉`);
    this.updateHud();
    if (remaining === 0) this.completeLevel();
  }

  registerMiss(point) {
    this.mistakes += 1;
    this.timeLeft = Math.max(0, this.timeLeft - MISS_PENALTY_SECONDS);
    playMiss();
    this.el.message.textContent = this.mistakes >= MAX_MISTAKES
      ? 'Bukan di situ… kesempatan habis!'
      : `Bukan di situ — waktu berkurang ${MISS_PENALTY_SECONDS} detik.`;
    this.el.boards.classList.remove('shake');
    void this.el.boards.offsetWidth;
    this.el.boards.classList.add('shake');
    this.updateHud();
    if (this.mistakes >= MAX_MISTAKES) this.failLevel('Tiga kali meleset — coba lagi, lebih teliti!');
  }

  // ---- alur level -----------------------------------------------------------
  startGame() {
    this.score = 0;
    this.starsEarned = [];
    this.startLevel(0);
  }

  startLevel(index) {
    this.levelIndex = index;
    const level = LEVELS[index];
    this.found = new Set();
    this.foundAt = new Map();
    this.mistakes = 0;
    this.timeLeft = level.timeLimit;
    this.hintsLeft = level.hints;
    this.hintTarget = null;
    this.levelStartScore = this.score;
    this.screen = 'playing';
    this.hideOverlay();
    this.setMessage(`Level ${index + 1}: ${level.name} — cari ${level.differences.length} perbedaan!`);
    this.updateHud();
    this.startTimer();
  }

  completeLevel() {
    this.stopTimer();
    const level = LEVELS[this.levelIndex];
    const timeBonus = Math.round(this.timeLeft) * 5;
    this.score += timeBonus;
    const stars = this.timeLeft > level.timeLimit * 0.5 && this.mistakes === 0
      ? 3
      : this.mistakes <= 1 ? 2 : 1;
    this.starsEarned[this.levelIndex] = stars;
    playLevelClear();
    this.updateHud();
    if (this.levelIndex + 1 < LEVELS.length) {
      this.screen = 'levelClear';
      this.showOverlay(
        `Level ${this.levelIndex + 1} selesai! 🎉`,
        `${level.name} tuntas — semua ${level.differences.length} perbedaan ketemu.\nBonus waktu: +${timeBonus} poin.`,
        '★'.repeat(stars) + '☆'.repeat(3 - stars),
        [
          { label: 'Lanjut ke level berikutnya →', action: () => this.nextLevel(), primary: true },
          { label: 'Ulangi level ini', action: () => this.startLevel(this.levelIndex) },
        ],
      );
    } else {
      this.finishGame();
    }
  }

  nextLevel() {
    this.startLevel(this.levelIndex + 1);
  }

  finishGame() {
    this.screen = 'win';
    playWin();
    const totalStars = this.starsEarned.reduce((a, b) => a + b, 0);
    this.showOverlay(
      'Kamu Master Mata Elang! 🏆',
      `Semua ${LEVELS.length} adegan selesai — ${LEVELS.reduce((n, l) => n + l.differences.length, 0)} perbedaan ditemukan.\nSkor akhir: ${this.score} poin.`,
      '★'.repeat(Math.min(3, Math.round(totalStars / 3))) + '☆'.repeat(3 - Math.min(3, Math.round(totalStars / 3))),
      [
        { label: 'Main lagi dari awal', action: () => this.startGame(), primary: true },
        { label: 'Pilih level', action: () => this.showMenu() },
      ],
    );
  }

  failLevel(reason) {
    this.stopTimer();
    this.screen = 'gameOver';
    this.showOverlay(
      'Waktu habis!',
      `${reason}\nKamu menemukan ${this.found.size} dari ${LEVELS[this.levelIndex].differences.length} perbedaan di level ini.`,
      '',
      [
        { label: 'Coba lagi level ini', action: () => this.startLevel(this.levelIndex), primary: true },
        { label: 'Kembali ke menu', action: () => this.showMenu() },
      ],
    );
  }

  // ---- timer ------------------------------------------------------------------
  startTimer() {
    this.stopTimer();
    this.lastTick = performance.now();
    this.timerId = setInterval(() => {
      const now = performance.now();
      this.timeLeft -= (now - this.lastTick) / 1000;
      this.lastTick = now;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateHud();
        this.failLevel('Waktu habis — coba lagi, lebih cepat sedikit!');
        return;
      }
      this.updateHud();
    }, 200);
  }

  stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // ---- petunjuk -----------------------------------------------------------------
  useHint() {
    if (this.screen !== 'playing') return;
    if (this.hintsLeft <= 0) {
      this.setMessage('Petunjuk habis — percaya pada matamu sendiri!');
      return;
    }
    const level = LEVELS[this.levelIndex];
    const remaining = level.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    this.hintsLeft -= 1;
    this.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintUntil = performance.now() + 3000;
    this.score = Math.max(0, this.score - 25);
    playHint();
    this.setMessage(`Petunjuk: cari di sekitar ${this.hintTarget.label}… (−25 poin)`);
    this.updateHud();
  }

  // ---- tampilan -----------------------------------------------------------------
  updateHud() {
    const level = LEVELS[this.levelIndex];
    this.el.levelName.textContent = `Level ${this.levelIndex + 1} — ${level.name}`;
    this.el.foundCount.textContent = String(this.found.size);
    this.el.totalCount.textContent = String(level.differences.length);
    this.el.score.textContent = String(this.score);
    this.el.hearts.textContent = '❤'.repeat(MAX_MISTAKES - this.mistakes) + '🤍'.repeat(this.mistakes);
    this.el.hintCount.textContent = String(this.hintsLeft);
    this.el.hintBtn.disabled = this.screen !== 'playing' || this.hintsLeft <= 0;
    this.el.timerText.textContent = formatTime(Math.max(0, this.timeLeft));
    const fraction = Math.max(0, this.timeLeft / level.timeLimit);
    this.el.timerBar.style.width = `${fraction * 100}%`;
    this.el.timerBar.classList.toggle('low', fraction < 0.25);
  }

  setMessage(text) {
    this.el.message.textContent = text;
    this.el.message.classList.remove('pop');
    void this.el.message.offsetWidth;
    this.el.message.classList.add('pop');
  }

  showMenu() {
    this.stopTimer();
    this.screen = 'menu';
    this.levelIndex = 0;
    this.found = new Set();
    this.timeLeft = LEVELS[0].timeLimit;
    this.hintsLeft = LEVELS[0].hints;
    this.mistakes = 0;
    this.updateHud();
    this.setMessage('Dua gambar hampir sama — temukan semua perbedaannya!');
    this.showOverlay(
      '🔍 Selisih Senja',
      'Dua gambar berdampingan, hampir sama persis.\nKlik perbedaan di gambar mana saja — lingkaran merah akan menandainya.\nTiga level: Taman Senja, Dapur Nenek, dan Kemah Bintang.\nKlik yang meleset mengurangi waktu. Tombol H = petunjuk, M = suara.',
      '',
      [
        { label: '▶ Mulai bermain', action: () => this.startGame(), primary: true },
        ...LEVELS.map((level, i) => ({
          label: `Level ${i + 1}: ${level.name}`,
          action: () => this.startLevel(i),
        })),
      ],
    );
  }

  showOverlay(title, text, stars, buttons) {
    this.el.overlayTitle.textContent = title;
    this.el.overlayText.textContent = text;
    this.el.overlayStars.textContent = stars;
    this.el.overlayButtons.innerHTML = '';
    for (const button of buttons) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = button.label;
      if (!button.primary) btn.classList.add('secondary');
      btn.addEventListener('click', () => {
        unlockAudio();
        button.action();
      });
      this.el.overlayButtons.appendChild(btn);
    }
    this.el.overlay.classList.remove('hidden');
  }

  hideOverlay() {
    this.el.overlay.classList.add('hidden');
  }

  // ---- gambar -------------------------------------------------------------------
  drawMarkers(ctx, now) {
    const level = LEVELS[this.levelIndex];
    for (const diff of level.differences) {
      if (!this.found.has(diff.id)) continue;
      const age = Math.min(1, (now - (this.foundAt.get(diff.id) || now)) / 250);
      const r = diff.r * (0.6 + 0.4 * age);
      ctx.strokeStyle = MARKER_COLOR;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(diff.x - 7, diff.y);
      ctx.lineTo(diff.x - 2, diff.y + 6);
      ctx.lineTo(diff.x + 8, diff.y - 6);
      ctx.stroke();
    }
    if (this.hintTarget && now < this.hintUntil && !this.found.has(this.hintTarget.id)) {
      const pulse = 1 + 0.18 * Math.sin(now / 130);
      const diff = this.hintTarget;
      ctx.strokeStyle = HINT_COLOR;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 7]);
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  loop() {
    const draw = (now) => {
      const level = LEVELS[this.levelIndex];
      paintScene(this.ctxA, level.id, 0);
      paintScene(this.ctxB, level.id, 1);
      if (this.screen === 'playing' || this.screen === 'levelClear' || this.screen === 'gameOver') {
        this.drawMarkers(this.ctxA, now);
        this.drawMarkers(this.ctxB, now);
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  // ---- keadaan demo untuk tangkapan layar ----------------------------------------
  // ?shot=cover → level 1 dengan 3 perbedaan sudah ditemukan (cover: penanda
  // terlihat, beberapa belum ketemu, penghitung 3/7).
  // ?shot=play → level 2 dengan 2 ditemukan dan satu petunjuk aktif.
  // ?shot=win → layar kemenangan.
  applyShot(shot) {
    if (shot === 'cover') {
      this.startLevel(0);
      const ids = LEVELS[0].differences.slice(0, 3).map((d) => d.id);
      for (const id of ids) {
        this.found.add(id);
        this.foundAt.set(id, performance.now() - 1000);
      }
      this.score = 300;
      this.timeLeft = 87;
      this.updateHud();
      this.setMessage('Ketemu! layang-layang — tinggal 4 lagi. 🎉');
    } else if (shot === 'play') {
      this.startLevel(1);
      const ids = LEVELS[1].differences.slice(0, 2).map((d) => d.id);
      for (const id of ids) {
        this.found.add(id);
        this.foundAt.set(id, performance.now() - 1000);
      }
      this.score = 200;
      this.timeLeft = 118;
      this.hintsLeft = 2;
      this.hintTarget = LEVELS[1].differences[4];
      this.hintUntil = performance.now() + 60000;
      this.updateHud();
      this.setMessage('Petunjuk: cari di sekitar cangkir di meja… (−25 poin)');
    } else if (shot === 'win') {
      // Layar kemenangan dengan keadaan level terakhir yang sudah tuntas,
      // supaya HUD di belakang overlay pun konsisten.
      this.levelIndex = 2;
      this.found = new Set(LEVELS[2].differences.map((d) => d.id));
      this.foundAt = new Map(LEVELS[2].differences.map((d) => [d.id, performance.now() - 1000]));
      this.timeLeft = 45;
      this.score = 2450;
      this.starsEarned = [3, 2, 3];
      this.updateHud();
      this.finishGame();
    }
  }
}
