// Selisih Senja — program penyerahan (Node 22, standard library only).
// Menyalin game/ dan screenshots/ dari samping berkas ini ke /output lalu
// menulis /output/dossier.json dengan pustaka make.fun yang dibundel.
// Di luar kontainer grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Catatan: /output adalah volume yang dipasang grader, jadi program ini
// tidak pernah menghapus direktorinya sendiri — hanya isinya yang dibersihkan.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function clearDirectoryContents(dir) {
  mkdirSync(dir, { recursive: true });
  for (const child of readdirSync(dir)) {
    rmSync(join(dir, child), { recursive: true, force: true });
  }
}

function copyIfPresent(name) {
  const source = join(repoRoot, name);
  if (existsSync(source)) cpSync(source, join(outDir, name), { recursive: true });
}

clearDirectoryContents(outDir);
copyIfPresent('game');
copyIfPresent('screenshots');

// Batas yang dipakai scorer (lihat RULES.txt): dossier dibatasi 160 KiB teks,
// maksimal 4 tangkapan layar @ 256 KiB, game/ maksimal 993 entri dan 48 MiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
