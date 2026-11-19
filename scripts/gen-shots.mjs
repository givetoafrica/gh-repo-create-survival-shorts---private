#!/usr/bin/env node
// Paint the shots for a photo-look episode with a CHEAP image model.
//   FAL_KEY=... node scripts/gen-shots.mjs <episodeId> [model]
// Each scene's photo needs  "prompt": "..."  (what the shot shows). Shots that already exist are skipped,
// so re-running only pays for new/changed ones. Results go to public/<photo.src> as 1080x1920 JPEG.
// Models (price per ~0.6 MP portrait image, Nov 2026):
//   zimage  fal-ai/z-image/turbo   ~$0.003   (default, fast, good enough under a cartoon head)
//   flux2   fal-ai/flux-2          ~$0.007
//   nano    fal-ai/nano-banana-2   $0.08     (best prompt-following; use for tricky shots)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const MODELS = {
	zimage: {id: 'fal-ai/z-image/turbo', price: 0.003, input: (p) => ({prompt: p, image_size: {width: 720, height: 1280}})},
	flux2: {id: 'fal-ai/flux-2', price: 0.007, input: (p) => ({prompt: p, image_size: {width: 720, height: 1280}})},
	nano: {id: 'fal-ai/nano-banana-2', price: 0.08, input: (p) => ({prompt: p, aspect_ratio: '9:16'})},
};
const [id, modelName = 'zimage'] = process.argv.slice(2);
const key = process.env.FAL_KEY;
if (!id || !key || !MODELS[modelName]) {
	console.error('usage: FAL_KEY=... node scripts/gen-shots.mjs <episodeId> [zimage|flux2|nano]');
	process.exit(1);
}
const m = MODELS[modelName];
const ep = JSON.parse(fs.readFileSync(`public/episodes/${id}/episode.json`, 'utf8'));
const STYLE = 'Photorealistic cinematic photo, vertical 9:16. ';
const FACE = ' Face fully visible, looking toward the camera, head upright, head in the upper half of the image. Rich period-accurate detail, cinematic lighting, shallow depth of field. No text, no watermark.';
let spent = 0;
for (const sc of ep.scenes) {
	const ph = sc.photo;
	if (!ph?.prompt) continue;
	const out = path.join('public', ph.src);
	if (fs.existsSync(out)) continue;
	const r = await fetch(`https://fal.run/${m.id}`, {
		method: 'POST',
		headers: {Authorization: `Key ${key}`, 'Content-Type': 'application/json'},
		body: JSON.stringify(m.input(STYLE + ph.prompt + (ph.heads?.length ? FACE : ''))),
	});
	if (!r.ok) throw new Error(`${m.id}: ${r.status} ${await r.text()}`);
	const url = (await r.json()).images[0].url;
	const raw = out.replace(/\.jpg$/, '.src.png');
	fs.mkdirSync(path.dirname(out), {recursive: true});
	fs.writeFileSync(raw, Buffer.from(await (await fetch(url)).arrayBuffer()));
	execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920', '-q:v', '3', out]);
	fs.renameSync(raw, out.replace(/\.jpg$/, '.original.png')); // keep the original next to the JPEG
	spent += m.price;
	console.log('painted', out);
}
console.log(`done, about $${spent.toFixed(2)} on ${m.id}. Next: fit heads[].x/y/r, then node scripts/make.mjs ${id}`);
