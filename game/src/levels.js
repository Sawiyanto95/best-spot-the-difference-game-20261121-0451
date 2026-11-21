// Selisih Senja — data level: nama, waktu, dan daftar perbedaan.
// Koordinat dalam ruang gambar 560 x 420. Setiap perbedaan punya titik
// tengah (x, y) dan radius klik (r); label dipakai untuk pesan petunjuk.
export const SCENE_WIDTH = 560;
export const SCENE_HEIGHT = 420;

export const LEVELS = [
  {
    id: 'taman',
    name: 'Taman Senja',
    intro: 'Senja di taman kota. Matahari turun, kucing tidur di bangku, dan layang-layang masih beterbangan.',
    timeLimit: 120,
    hints: 3,
    differences: [
      { id: 'burung', x: 95, y: 62, r: 26, label: 'burung di langit' },
      { id: 'awan', x: 300, y: 55, r: 30, label: 'awan kecil' },
      { id: 'layang', x: 452, y: 92, r: 30, label: 'layang-layang' },
      { id: 'apel', x: 150, y: 212, r: 24, label: 'apel di pohon' },
      { id: 'kucing', x: 330, y: 318, r: 26, label: 'kucing di bangku' },
      { id: 'bunga', x: 455, y: 345, r: 22, label: 'bunga di pojok' },
      { id: 'bangku', x: 255, y: 330, r: 24, label: 'papan bangku' },
    ],
  },
  {
    id: 'dapur',
    name: 'Dapur Nenek',
    intro: 'Dapur nenek yang hangat: teko mengepul, kue baru matang, dan kucing mengintip dari jendela.',
    timeLimit: 150,
    hints: 3,
    differences: [
      { id: 'jam', x: 470, y: 70, r: 28, label: 'jarum jam dinding' },
      { id: 'uap', x: 150, y: 105, r: 24, label: 'uap teko' },
      { id: 'kucing-jendela', x: 90, y: 250, r: 26, label: 'kucing di jendela' },
      { id: 'kue', x: 300, y: 285, r: 26, label: 'kue di toples' },
      { id: 'cangkir', x: 420, y: 290, r: 22, label: 'cangkir di meja' },
      { id: 'daun', x: 520, y: 330, r: 24, label: 'daun tanaman' },
      { id: 'gorden', x: 90, y: 120, r: 26, label: 'pita gorden' },
      { id: 'lukisan', x: 280, y: 90, r: 26, label: 'lukisan di dinding' },
    ],
  },
  {
    id: 'kemah',
    name: 'Kemah Bintang',
    intro: 'Malam di perkemahan: api unggun menyala, tenda berdiri, dan langit penuh bintang.',
    timeLimit: 180,
    hints: 3,
    differences: [
      { id: 'bulan', x: 480, y: 60, r: 28, label: 'bulan di langit' },
      { id: 'bendera', x: 280, y: 130, r: 24, label: 'bendera tenda' },
      { id: 'kayu', x: 280, y: 330, r: 26, label: 'kayu api unggun' },
      { id: 'bintang', x: 140, y: 70, r: 20, label: 'bintang kecil' },
      { id: 'marshmallow', x: 380, y: 300, r: 22, label: 'marshmallow' },
      { id: 'burung-hantu', x: 90, y: 150, r: 26, label: 'burung hantu' },
      { id: 'lentera', x: 450, y: 310, r: 24, label: 'lentera' },
      { id: 'sepatu', x: 200, y: 370, r: 24, label: 'sepatu bot' },
      { id: 'ransel', x: 480, y: 340, r: 22, label: 'kantong ransel' },
    ],
  },
];

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.differences.length, 0);
}
