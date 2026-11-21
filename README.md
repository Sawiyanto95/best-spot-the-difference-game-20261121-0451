[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Sawiyanto95/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Sawiyanto95/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

# Selisih Senja — Cari Perbedaannya!

Game cari perbedaan (*spot the difference*) yang dimainkan di browser desktop,
tanpa instalasi dan tanpa jaringan. Dua gambar hampir sama persis ditampilkan
berdampingan — klik perbedaan yang kamu temukan di gambar mana saja.

## Cara main

- Klik perbedaan di gambar A atau B: lingkaran merah menandai temuanmu di kedua gambar.
- Penghitung di atas menunjukkan berapa yang sudah ketemu dan berapa yang tersisa.
- Tiga level dengan tingkat kesulitan menanjak: **Taman Senja** (7 perbedaan),
  **Dapur Nenek** (8 perbedaan), **Kemah Bintang** (9 perbedaan).
- Timer berjalan di tiap level; klik yang meleset mengurangi 5 detik dan satu hati.
  Tiga kali meleset, level harus diulang.
- Tombol **Petunjuk** (atau tombol `H`) menyorot satu perbedaan yang belum ketemu
  selama 3 detik — biayanya 25 poin.
- Keyboard: `H` petunjuk, `M` suara, `R` ulangi level, `Enter` lanjut, `1/2/3` pilih level.

Semua gambar digambar langsung dengan primitif canvas (tanpa aset luar) dan semua
bunyi disintesis dengan WebAudio — game ini 100% berkas statis dan luring.

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

## Penyerahan (make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `game/` dan `screenshots/` ke `/output` dan menulis
`/output/dossier.json`.

## Lisensi

MIT — lihat [LICENSE](LICENSE).
