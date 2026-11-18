// Run on a machine that can reach the AI media hosts (e.g. your Mac):
//   node scripts/fetch-assets.mjs
// Downloads the painted backdrops listed in public/bg/sources.json to public/bg/<path> (1080x1920 JPEG via ffmpeg).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const src = JSON.parse(fs.readFileSync('public/bg/sources.json', 'utf8'));
for (const [rel, url] of Object.entries(src)) {
	const out = path.join('public/bg', rel);
	if (fs.existsSync(out)) continue;
	fs.mkdirSync(path.dirname(out), {recursive: true});
	const tmp = out + '.src';
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url}: ${res.status}`);
	fs.writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
	execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', 'scale=1080:1920:flags=lanczos', '-q:v', '3', out]);
	fs.unlinkSync(tmp);
	console.log('saved', out);
}
