#!/usr/bin/env node
// One command per Short:  node scripts/make.mjs <episodeId>
//   1. voice   - if public/episodes/<id>/voice.mp3 is missing and ELEVENLABS_API_KEY is set,
//                generate it from script.txt with the voice in episode.json ("tts").
//   2. captions- if captions.json is missing, transcribe voice.mp3 with Whisper (whisper.cpp,
//                runs locally, free) to word-level timestamps.
//   3. render  - Remotion renders the 1080x1920 stickman video with burned-in captions.
//   4. finish  - FFmpeg normalises loudness (-14 LUFS, YouTube's target) and writes out/<id>.mp4.
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const id = process.argv[2];
if (!id) { console.error('usage: node scripts/make.mjs <episodeId>'); process.exit(1); }
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'public/episodes', id);
const ep = JSON.parse(fs.readFileSync(path.join(dir, 'episode.json'), 'utf8'));
const voice = path.join(dir, 'voice.mp3');
const caps = path.join(dir, 'captions.json');
const sh = (c) => { console.log(`$ ${c}`); execSync(c, {stdio: 'inherit', cwd: root}); };
sh('node scripts/setup.mjs');

// 1. voice
if (!fs.existsSync(voice)) {
	const key = process.env.ELEVENLABS_API_KEY;
	const scriptTxt = path.join(dir, 'script.txt');
	if (!key || !ep.tts || !fs.existsSync(scriptTxt)) {
		console.error(`No ${voice}. Either drop an MP3 there, or set ELEVENLABS_API_KEY and add script.txt + "tts" to episode.json.`);
		process.exit(1);
	}
	console.log(`Generating voice with ElevenLabs voice ${ep.tts.voiceId} ...`);
	const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ep.tts.voiceId}?output_format=mp3_44100_128`, {
		method: 'POST',
		headers: {'xi-api-key': key, 'content-type': 'application/json'},
		body: JSON.stringify({text: fs.readFileSync(scriptTxt, 'utf8'), model_id: ep.tts.model ?? 'eleven_v3'}),
	});
	if (!res.ok) { console.error(await res.text()); process.exit(1); }
	fs.writeFileSync(voice, Buffer.from(await res.arrayBuffer()));
}

// 2. captions (Whisper via whisper.cpp)
if (!fs.existsSync(caps)) {
	const {installWhisperCpp, downloadWhisperModel, transcribe, toCaptions} = await import('@remotion/install-whisper-cpp');
	const whisperDir = path.join(root, '.whisper');
	const model = process.env.WHISPER_MODEL ?? 'medium.en';
	await installWhisperCpp({to: whisperDir, version: '1.5.5'});
	await downloadWhisperModel({model, folder: whisperDir});
	const wav = path.join(dir, 'voice16k.wav');
	sh(`ffmpeg -y -loglevel error -i "${voice}" -ar 16000 -ac 1 "${wav}"`);
	const out = await transcribe({inputPath: wav, whisperPath: whisperDir, whisperCppVersion: '1.5.5', model, modelFolder: whisperDir, tokenLevelTimestamps: true, splitOnWord: true});
	const {captions} = toCaptions({whisperCppOutput: out});
	const words = captions.map((c) => ({text: c.text.trim(), startMs: c.startMs, endMs: c.endMs})).filter((c) => c.text);
	fs.writeFileSync(caps, JSON.stringify(words));
	fs.unlinkSync(wav);
	console.log(`Wrote ${words.length} caption words`);
}

// 3. render
fs.mkdirSync(path.join(root, 'out'), {recursive: true});
const raw = path.join(root, 'out', `${id}.raw.mp4`);
sh(`npx remotion render src/index.ts Short "${raw}" --props='${JSON.stringify({episodeId: id})}' --codec=h264 --crf=18`);

// 4. finish
const final = path.join(root, 'out', `${id}.mp4`);
sh(`ffmpeg -y -loglevel error -i "${raw}" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart "${final}"`);
fs.unlinkSync(raw);
console.log(`\nDone: ${final}`);
