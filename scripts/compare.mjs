#!/usr/bin/env node
// Side-by-side look test:  node scripts/compare.mjs [seconds=10]
// Renders the first N seconds of toothbrush (stickman, lip-sync) and phototest (cartoon head on painted body)
// with the real voice, then stacks them left/right into out/compare.mp4 (under 28 MB, opens in chat).
import {execSync} from 'node:child_process';
const sec = Number(process.argv[2] ?? 10);
const frames = `0-${sec * 30 - 1}`;
const sh = (c) => { console.log(`$ ${c}`); execSync(c, {stdio: 'inherit'}); };
sh('node scripts/fetch-assets.mjs');
const ids = (process.argv[3] ?? 'toothbrush,phototest').split(',');
for (const id of ids)
	sh(`npx remotion render src/index.ts Short out/cmp-${id}.mp4 --props='{"episodeId":"${id}"}' --frames=${frames}`);
sh(`ffmpeg -y -loglevel error -i out/cmp-${ids[0]}.mp4 -i out/cmp-${ids[1]}.mp4 -filter_complex "[0:v]scale=540:960[a];[1:v]scale=540:960[b];[a][b]hstack[v]" -map "[v]" -map 1:a -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out/compare.mp4`);
sh(`ffmpeg -y -loglevel error -i out/cmp-${ids[1]}.mp4 -c:v libx264 -crf 24 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out/phototest-10s.mp4`);
console.log('done: out/compare.mp4 and out/phototest-10s.mp4');
