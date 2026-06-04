#!/usr/bin/env node
// Downscale + re-encode gallery JPEGs in place.
// Skips files that are already small or already optimized.

import { readdir, stat, rename, unlink } from 'node:fs/promises'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', 'public', 'gallery')

const MAX_EDGE = 1600
const QUALITY = 78
const SIZE_FLOOR_BYTES = 300 * 1024 // skip files already under 300KB

const formatKB = (n) => `${(n / 1024).toFixed(0)} KB`

async function processFile(filePath) {
  const before = (await stat(filePath)).size
  if (before < SIZE_FLOOR_BYTES) {
    console.log(`  skip  ${basename(filePath)}  (${formatKB(before)}, already small)`)
    return { before, after: before, skipped: true }
  }

  const tmpPath = filePath + '.tmp'
  await sharp(filePath, { failOn: 'none' })
    .rotate() // honor EXIF orientation, then strip metadata
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(tmpPath)

  const after = (await stat(tmpPath)).size

  // Only overwrite if smaller.
  if (after < before) {
    await rename(tmpPath, filePath)
    const pct = (((before - after) / before) * 100).toFixed(0)
    console.log(`  ok    ${basename(filePath)}  ${formatKB(before)} → ${formatKB(after)}  (-${pct}%)`)
  } else {
    await unlink(tmpPath)
    console.log(`  keep  ${basename(filePath)}  (${formatKB(before)}, optimized version was larger)`)
  }
  return { before, after, skipped: false }
}

async function processDir(dir) {
  const entries = await readdir(dir)
  const jpegs = entries.filter((n) => /\.(jpe?g)$/i.test(n)).sort()
  console.log(`\n${dir.replace(ROOT, 'gallery')}  (${jpegs.length} files)`)
  let totalBefore = 0
  let totalAfter = 0
  for (const name of jpegs) {
    const { before, after } = await processFile(join(dir, name))
    totalBefore += before
    totalAfter += after
  }
  return { totalBefore, totalAfter }
}

async function main() {
  const subdirs = (await readdir(ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => join(ROOT, d.name))

  let grandBefore = 0
  let grandAfter = 0
  for (const d of subdirs) {
    const { totalBefore, totalAfter } = await processDir(d)
    grandBefore += totalBefore
    grandAfter += totalAfter
  }

  const savedMB = ((grandBefore - grandAfter) / 1024 / 1024).toFixed(1)
  const pct = grandBefore > 0 ? (((grandBefore - grandAfter) / grandBefore) * 100).toFixed(0) : 0
  console.log(
    `\ntotal: ${(grandBefore / 1024 / 1024).toFixed(1)} MB → ${(grandAfter / 1024 / 1024).toFixed(1)} MB  (saved ${savedMB} MB, -${pct}%)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
