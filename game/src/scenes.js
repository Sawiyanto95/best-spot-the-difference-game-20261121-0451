// Selisih Senja — pelukis gambar: tiga adegan asli digambar dengan primitif
// canvas (tanpa aset luar). Setiap adegan digambar dua kali: varian 0 untuk
// gambar A dan varian 1 untuk gambar B; perbedaannya hidup di percabangan
// `variant` di dalam tiap pelukis, jadi kedua panel selalu satu gambar yang
// sama kecuali pada titik-titik perbedaan itu.
import { SCENE_WIDTH, SCENE_HEIGHT } from './levels.js';

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function triangle(ctx, x1, y1, x2, y2, x3, y3, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s, color) {
  circle(ctx, x, y, 20 * s, color);
  circle(ctx, x + 18 * s, y + 4 * s, 15 * s, color);
  circle(ctx, x - 18 * s, y + 5 * s, 14 * s, color);
  circle(ctx, x + 6 * s, y - 10 * s, 14 * s, color);
}

function bird(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 9 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 9 * s, x + 12 * s, y);
  ctx.stroke();
}

function flower(ctx, x, y, petal, center) {
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7, petal);
  }
  circle(ctx, x, y, 6, center);
}

function grassTuft(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 5, y - 12);
  ctx.moveTo(x + 4, y);
  ctx.lineTo(x + 3, y - 14);
  ctx.moveTo(x + 9, y);
  ctx.lineTo(x + 11, y - 10);
  ctx.stroke();
}

// ---- Adegan 1: Taman Senja -------------------------------------------------
function paintPark(ctx, variant) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#ff9a5c');
  sky.addColorStop(0.55, '#ff7e7e');
  sky.addColorStop(1, '#c65b8e');
  rect(ctx, 0, 0, SCENE_WIDTH, 300, sky);
  // Matahari terbenam.
  circle(ctx, 470, 82, 42, '#ffd23f');
  circle(ctx, 470, 82, 30, '#ffe98a');
  // Awan; awan kecil di (300, 55) hanya ada di varian 1.
  cloud(ctx, 120, 48, 1, 'rgba(255,235,220,0.95)');
  cloud(ctx, 420, 40, 0.8, 'rgba(255,235,220,0.9)');
  if (variant === 1) cloud(ctx, 300, 55, 0.6, 'rgba(255,235,220,0.95)');
  // Burung hanya ada di varian 0.
  if (variant === 0) {
    bird(ctx, 95, 62, 1, '#5b2a4a');
    bird(ctx, 140, 90, 0.8, '#5b2a4a');
  } else {
    bird(ctx, 140, 90, 0.8, '#5b2a4a');
  }
  // Layang-layang: merah di varian 0, biru di varian 1.
  const kiteColor = variant === 0 ? '#e63946' : '#4361ee';
  triangle(ctx, 452, 62, 478, 92, 452, 122, kiteColor);
  triangle(ctx, 452, 62, 426, 92, 452, 122, kiteColor);
  ctx.strokeStyle = '#fff7ea';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(452, 122);
  ctx.quadraticCurveTo(430, 170, 405, 210);
  ctx.stroke();
  // Bukit dan tanah.
  ellipse(ctx, 130, 330, 260, 90, '#5da24a');
  ellipse(ctx, 470, 340, 240, 95, '#4c8a3e');
  rect(ctx, 0, 330, SCENE_WIDTH, 90, '#6fae4e');
  // Jalan setapak.
  ctx.fillStyle = '#e8c890';
  ctx.beginPath();
  ctx.moveTo(250, 420);
  ctx.lineTo(300, 420);
  ctx.lineTo(285, 330);
  ctx.lineTo(265, 330);
  ctx.closePath();
  ctx.fill();
  // Pohon apel di kiri; varian 0 punya 3 apel, varian 1 hanya 2.
  rect(ctx, 142, 210, 16, 110, '#7a4a21');
  circle(ctx, 120, 185, 42, '#3f7d33');
  circle(ctx, 180, 180, 46, '#4c8a3e');
  circle(ctx, 150, 150, 44, '#57a047');
  circle(ctx, 132, 200, 6, '#e63946');
  circle(ctx, 172, 190, 6, '#e63946');
  if (variant === 0) circle(ctx, 152, 165, 6, '#e63946');
  // Bangku kayu; varian 0 punya 3 papan duduk, varian 1 hanya 2.
  rect(ctx, 215, 300, 130, 10, '#8a5a2b');
  rect(ctx, 220, 292, 8, 44, '#6b4423');
  rect(ctx, 332, 292, 8, 44, '#6b4423');
  rect(ctx, 215, 314, 130, 8, '#a06a33');
  if (variant === 0) rect(ctx, 215, 328, 130, 8, '#8a5a2b');
  rect(ctx, 215, 344, 130, 8, '#a06a33');
  // Kucing tidur di bangku, hanya di varian 0.
  if (variant === 0) {
    ellipse(ctx, 330, 296, 22, 11, '#f4a259');
    circle(ctx, 350, 292, 9, '#f4a259');
    triangle(ctx, 344, 284, 347, 276, 351, 284, '#f4a259');
    triangle(ctx, 354, 284, 357, 276, 360, 284, '#f4a259');
    ctx.strokeStyle = '#e07b39';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(310, 296);
    ctx.quadraticCurveTo(298, 288, 300, 278);
    ctx.stroke();
  }
  // Bunga-bunga; bunga pojok merah di varian 0, ungu di varian 1.
  flower(ctx, 60, 380, '#ff6b9d', '#ffd23f');
  flower(ctx, 110, 395, '#ffffff', '#ff9d3f');
  flower(ctx, 500, 385, '#ff6b9d', '#ffd23f');
  flower(ctx, 455, 345, variant === 0 ? '#e63946' : '#9b5de5', '#ffd23f');
  flower(ctx, 40, 340, '#ffd23f', '#e63946');
  grassTuft(ctx, 200, 400, '#2f6b26');
  grassTuft(ctx, 380, 405, '#2f6b26');
  grassTuft(ctx, 520, 360, '#2f6b26');
}

// ---- Adegan 2: Dapur Nenek -------------------------------------------------
function paintKitchen(ctx, variant) {
  rect(ctx, 0, 0, SCENE_WIDTH, 300, '#f7e3c3');
  rect(ctx, 0, 300, SCENE_WIDTH, 120, '#b07a45');
  rect(ctx, 0, 300, SCENE_WIDTH, 10, '#8a5a2b');
  // Jendela kiri dengan gorden; pita gorden merah (0) atau biru (1).
  rect(ctx, 40, 60, 120, 180, '#8ecae6');
  rect(ctx, 48, 68, 104, 164, '#bde0fe');
  circle(ctx, 140, 100, 22, '#ffd23f');
  ellipse(ctx, 80, 220, 55, 14, '#7fb069');
  ellipse(ctx, 130, 228, 45, 12, '#6a9e58');
  rect(ctx, 36, 56, 128, 12, '#8a5a2b');
  rect(ctx, 36, 240, 128, 12, '#8a5a2b');
  const tieColor = variant === 0 ? '#e63946' : '#4361ee';
  rect(ctx, 36, 60, 22, 180, '#ff8fa3');
  rect(ctx, 142, 60, 22, 180, '#ff8fa3');
  circle(ctx, 47, 150, 9, tieColor);
  circle(ctx, 153, 150, 9, tieColor);
  // Kucing di ambang jendela, hanya di varian 0.
  if (variant === 0) {
    ellipse(ctx, 90, 240, 20, 10, '#6c757d');
    circle(ctx, 108, 234, 9, '#6c757d');
    triangle(ctx, 102, 227, 105, 219, 109, 227, '#6c757d');
    triangle(ctx, 111, 227, 114, 219, 117, 227, '#6c757d');
    ctx.strokeStyle = '#495057';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(72, 240);
    ctx.quadraticCurveTo(60, 232, 62, 222);
    ctx.stroke();
  }
  // Jam dinding; jarum menunjuk pukul 3 (0) atau 4 (1).
  circle(ctx, 470, 70, 34, '#fff7ea');
  ctx.strokeStyle = '#4a2350';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(470, 70, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(470, 70);
  ctx.lineTo(470, 46);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(470, 70);
  ctx.lineTo(variant === 0 ? 492 : 486, variant === 0 ? 70 : 88);
  ctx.stroke();
  circle(ctx, 470, 70, 4, '#4a2350');
  // Lukisan di dinding: matahari (0) atau bulan (1).
  rect(ctx, 240, 58, 80, 64, '#8a5a2b');
  rect(ctx, 246, 64, 68, 52, '#bde0fe');
  if (variant === 0) {
    circle(ctx, 280, 90, 14, '#ffd23f');
  } else {
    circle(ctx, 280, 90, 13, '#f4f1de');
    circle(ctx, 286, 86, 11, '#bde0fe');
  }
  ellipse(ctx, 280, 112, 30, 6, '#7fb069');
  // Rak dengan piring dan gelas.
  rect(ctx, 360, 130, 160, 10, '#8a5a2b');
  circle(ctx, 390, 122, 12, '#fff7ea');
  circle(ctx, 420, 122, 12, '#ff8fa3');
  circle(ctx, 450, 122, 12, '#90e0a0');
  rect(ctx, 480, 106, 14, 24, '#bde0fe');
  // Meja dan taplak.
  rect(ctx, 60, 300, 440, 14, '#e63946');
  rect(ctx, 60, 314, 440, 106, '#fff7ea');
  // Teko di atas kompor kecil; uap hanya di varian 0.
  rect(ctx, 110, 262, 90, 38, '#6c757d');
  circle(ctx, 150, 255, 4, '#e63946');
  circle(ctx, 150, 245, 4, '#e63946');
  ellipse(ctx, 150, 264, 26, 18, '#4361ee');
  circle(ctx, 150, 246, 10, '#4361ee');
  circle(ctx, 150, 242, 4, '#2b3a8f');
  triangle(ctx, 174, 254, 192, 264, 174, 268, '#4361ee');
  ctx.strokeStyle = '#2b3a8f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(122, 262, 9, Math.PI / 2, Math.PI * 1.5);
  ctx.stroke();
  if (variant === 0) {
    ctx.strokeStyle = 'rgba(120,120,120,0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(145, 225);
    ctx.quadraticCurveTo(138, 210, 146, 196);
    ctx.moveTo(158, 225);
    ctx.quadraticCurveTo(165, 208, 157, 194);
    ctx.stroke();
  }
  // Toples kue; varian 0 berisi 4 kue, varian 1 berisi 3.
  rect(ctx, 272, 240, 56, 60, 'rgba(189,224,254,0.75)');
  rect(ctx, 272, 234, 56, 10, '#8a5a2b');
  circle(ctx, 288, 282, 9, '#c68a4b');
  circle(ctx, 312, 282, 9, '#c68a4b');
  circle(ctx, 300, 264, 9, '#c68a4b');
  if (variant === 0) circle(ctx, 300, 292, 9, '#c68a4b');
  // Cangkir: merah (0) atau hijau (1).
  const mugColor = variant === 0 ? '#e63946' : '#43aa4b';
  rect(ctx, 405, 272, 30, 28, mugColor);
  ctx.strokeStyle = mugColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(439, 286, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Tanaman di pojok; varian 0 punya 5 daun, varian 1 punya 4.
  triangle(ctx, 505, 300, 535, 300, 520, 330, '#e07b39');
  rect(ctx, 502, 330, 36, 26, '#e07b39');
  ellipse(ctx, 508, 288, 7, 18, '#43aa4b');
  ellipse(ctx, 520, 280, 7, 20, '#57b95e');
  ellipse(ctx, 532, 288, 7, 18, '#43aa4b');
  ellipse(ctx, 514, 296, 7, 14, '#6cc470');
  if (variant === 0) ellipse(ctx, 528, 296, 7, 14, '#6cc470');
  // Karpet dan remah kue.
  ellipse(ctx, 280, 400, 130, 14, '#ff8fa3');
  circle(ctx, 350, 380, 3, '#c68a4b');
  circle(ctx, 360, 392, 3, '#c68a4b');
}

// ---- Adegan 3: Kemah Bintang ----------------------------------------------
function paintCamp(ctx, variant) {
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#0b1026');
  sky.addColorStop(0.7, '#1b2a52');
  sky.addColorStop(1, '#2a3a6b');
  rect(ctx, 0, 0, SCENE_WIDTH, 320, sky);
  // Bintang-bintang; satu bintang di (140, 70) hanya ada di varian 0.
  const stars = [
    [60, 40, 2], [200, 35, 1.6], [330, 45, 2], [420, 30, 1.5],
    [90, 110, 1.6], [250, 90, 2], [360, 110, 1.5], [520, 130, 2],
    [180, 130, 1.4], [40, 180, 1.8], [500, 190, 1.6], [300, 150, 1.4],
  ];
  for (const [x, y, r] of stars) circle(ctx, x, y, r, '#fff7ea');
  if (variant === 0) circle(ctx, 140, 70, 2, '#fff7ea');
  // Bulan: purnama berkawah (0) atau sabit (1).
  circle(ctx, 480, 60, 30, '#f4f1de');
  if (variant === 0) {
    circle(ctx, 470, 52, 5, '#d8d2b8');
    circle(ctx, 490, 68, 4, '#d8d2b8');
    circle(ctx, 488, 50, 3, '#d8d2b8');
  } else {
    circle(ctx, 492, 52, 26, '#1b2a52');
  }
  // Pohon pinus kiri; burung hantu hanya di varian 0.
  rect(ctx, 72, 200, 14, 70, '#5b3a1e');
  triangle(ctx, 79, 110, 30, 210, 128, 210, '#1e4d2b');
  triangle(ctx, 79, 140, 45, 225, 113, 225, '#276038');
  if (variant === 0) {
    ellipse(ctx, 90, 150, 13, 16, '#8a6d3b');
    circle(ctx, 85, 146, 4, '#fff7ea');
    circle(ctx, 95, 146, 4, '#fff7ea');
    circle(ctx, 85, 146, 2, '#222222');
    circle(ctx, 95, 146, 2, '#222222');
    triangle(ctx, 90, 152, 86, 158, 94, 158, '#f4a259');
  }
  // Tanah dan rumput malam.
  rect(ctx, 0, 300, SCENE_WIDTH, 120, '#1e4d2b');
  ellipse(ctx, 120, 320, 200, 40, '#276038');
  ellipse(ctx, 460, 330, 200, 45, '#276038');
  // Tenda dengan bendera: merah (0) atau biru (1).
  triangle(ctx, 280, 170, 190, 300, 370, 300, '#e63946');
  triangle(ctx, 280, 170, 245, 300, 315, 300, '#7a1f2b');
  triangle(ctx, 280, 240, 250, 300, 310, 300, '#2b1a12');
  rect(ctx, 278, 120, 4, 52, '#8a5a2b');
  const flagColor = variant === 0 ? '#ffd23f' : '#4361ee';
  triangle(ctx, 282, 120, 312, 128, 282, 136, flagColor);
  // Api unggun; varian 0 punya 3 batang kayu, varian 1 hanya 2.
  circle(ctx, 250, 332, 8, '#6c757d');
  circle(ctx, 310, 332, 8, '#6c757d');
  circle(ctx, 280, 340, 8, '#6c757d');
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(258, 326);
  ctx.lineTo(302, 318);
  ctx.moveTo(302, 326);
  ctx.lineTo(258, 318);
  ctx.stroke();
  if (variant === 0) {
    ctx.beginPath();
    ctx.moveTo(280, 312);
    ctx.lineTo(280, 330);
    ctx.stroke();
  }
  ellipse(ctx, 280, 320, 16, 22, '#ff9d3f');
  ellipse(ctx, 280, 318, 10, 16, '#ffd23f');
  ellipse(ctx, 280, 316, 5, 10, '#fff7ea');
  // Tongkat marshmallow dari kanan; marshmallow hanya di varian 0.
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(420, 330);
  ctx.lineTo(378, 302);
  ctx.stroke();
  if (variant === 0) {
    circle(ctx, 378, 300, 9, '#fff7ea');
    circle(ctx, 374, 298, 3, '#e8dcc8');
  }
  // Lentera: cahaya kuning (0) atau hijau (1).
  const lampGlow = variant === 0 ? 'rgba(255,210,63,0.35)' : 'rgba(120,220,120,0.35)';
  circle(ctx, 450, 310, 34, lampGlow);
  rect(ctx, 442, 292, 16, 26, '#3a3a3a');
  rect(ctx, 444, 296, 12, 18, variant === 0 ? '#ffd23f' : '#7ed957');
  rect(ctx, 440, 288, 20, 5, '#3a3a3a');
  // Sepatu bot; varian 0 sepasang, varian 1 hanya satu.
  rect(ctx, 188, 352, 18, 22, '#7a4a21');
  rect(ctx, 184, 370, 26, 8, '#5b3a1e');
  if (variant === 0) {
    rect(ctx, 214, 352, 18, 22, '#7a4a21');
    rect(ctx, 210, 370, 26, 8, '#5b3a1e');
  }
  // Ransel dengan kantong depan hanya di varian 0.
  ellipse(ctx, 480, 348, 22, 28, '#4361ee');
  rect(ctx, 470, 322, 20, 8, '#2b3a8f');
  if (variant === 0) rect(ctx, 470, 344, 20, 16, '#2b3a8f');
  // Kantong tidur dan kayu duduk.
  ellipse(ctx, 120, 380, 60, 16, '#9b5de5');
  ellipse(ctx, 120, 376, 60, 12, '#b983ff');
  rect(ctx, 380, 360, 90, 16, '#7a4a21');
  circle(ctx, 40, 350, 3, '#fff7ea');
  circle(ctx, 520, 380, 3, '#fff7ea');
}

// ---- Titik masuk ------------------------------------------------------------
const PAINTERS = { taman: paintPark, dapur: paintKitchen, kemah: paintCamp };

export function paintScene(ctx, levelId, variant) {
  ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  PAINTERS[levelId](ctx, variant);
}
