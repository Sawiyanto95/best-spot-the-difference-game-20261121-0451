// Selisih Senja — titik masuk: merangkai elemen halaman menjadi permainan,
// lalu menerapkan keadaan demo ?shot=… bila ada (dipakai untuk tangkapan
// layar: cover / play / win).
import { SpotGame } from './game.js';

const elements = {
  canvasA: document.getElementById('canvas-a'),
  canvasB: document.getElementById('canvas-b'),
  levelName: document.getElementById('level-name'),
  foundCount: document.getElementById('found-count'),
  totalCount: document.getElementById('total-count'),
  timerBar: document.getElementById('timer-bar'),
  timerText: document.getElementById('timer-text'),
  score: document.getElementById('score'),
  hearts: document.getElementById('hearts'),
  hintBtn: document.getElementById('hint-btn'),
  hintCount: document.getElementById('hint-count'),
  soundBtn: document.getElementById('sound-btn'),
  message: document.getElementById('message'),
  boards: document.getElementById('boards'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlay-title'),
  overlayText: document.getElementById('overlay-text'),
  overlayStars: document.getElementById('overlay-stars'),
  overlayButtons: document.getElementById('overlay-buttons'),
};

const game = new SpotGame(elements);

const shot = new URLSearchParams(window.location.search).get('shot');
if (shot === 'cover' || shot === 'play' || shot === 'win') {
  game.applyShot(shot);
}
