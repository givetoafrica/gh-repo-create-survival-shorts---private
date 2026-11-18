// Copies the caption fonts out of node_modules and synthesises the sound effects with FFmpeg.
// Runs automatically from make.mjs; safe to run again.
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = path.join(root, 'public');
const fonts = {
	'LuckiestGuy.woff2': '@fontsource/luckiest-guy/files/luckiest-guy-latin-400-normal.woff2',
	'PermanentMarker.woff2': '@fontsource/permanent-marker/files/permanent-marker-latin-400-normal.woff2',
	'Bangers.woff2': '@fontsource/bangers/files/bangers-latin-400-normal.woff2',
};
for (const [dst, src] of Object.entries(fonts)) {
	if (!fs.existsSync(path.join(pub, dst))) fs.copyFileSync(path.join(root, 'node_modules', src), path.join(pub, dst));
}
const sfx = path.join(pub, 'sfx');
fs.mkdirSync(sfx, {recursive: true});
const make = {
	'whoosh.wav': `-f lavfi -i "anoisesrc=d=0.45:c=pink:a=0.9" -af "highpass=f=400,lowpass=f=5000,afade=t=in:d=0.18,afade=t=out:st=0.2:d=0.25,volume=1.4"`,
	'pop.wav': `-f lavfi -i "sine=f=880:d=0.12" -af "afade=t=out:st=0.02:d=0.1,volume=0.8"`,
	'thud.wav': `-f lavfi -i "sine=f=70:d=0.4" -f lavfi -i "anoisesrc=d=0.4:c=brown:a=1" -filter_complex "[0][1]amix=inputs=2,lowpass=f=300,afade=t=out:st=0.05:d=0.35,volume=3"`,
	'ding.wav': `-f lavfi -i "sine=f=1320:d=0.6" -af "afade=t=out:st=0.05:d=0.55,volume=0.6"`,
};
for (const [name, args] of Object.entries(make)) {
	const out = path.join(sfx, name);
	if (!fs.existsSync(out)) execSync(`ffmpeg -y -loglevel error ${args} "${out}"`);
}
console.log('setup ok: fonts + sfx ready');
