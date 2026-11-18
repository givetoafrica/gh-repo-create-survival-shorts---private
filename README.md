# Survival Untold: stickman Shorts pipeline

Code-driven 9:16 YouTube Shorts in a consistent stick-figure style.
Everything you see is drawn in code (Remotion + SVG), so every episode looks the same and costs nothing to render.
The only paid step is the AI voice (ElevenLabs, roughly 700-850 credits per 45-55 s Short).

## Make a new Short

1. Copy an episode folder: `cp -r public/episodes/toothbrush public/episodes/<new-id>`
2. Put the narration at `public/episodes/<new-id>/voice.mp3`
   (or write `script.txt`, add `"tts": {"voiceId": "o9B86nZP8mMLaT5FBEzP", "model": "eleven_v3"}` to `episode.json`
   and set `ELEVENLABS_API_KEY`; the script then generates the voice for you).
3. Delete the old `captions.json` (Whisper rebuilds it, word by word, from the audio).
4. Edit `episode.json`: title, theme, duck spot and the list of scenes (see below).
5. Run one command:

```bash
npm install        # first time only
node scripts/make.mjs <new-id>     # -> out/<new-id>.mp4
```

Preview and tweak live with `npm run studio` (opens a browser timeline you can scrub).

## How an episode is described

Each scene starts on a spoken phrase (`"at": "then in 1498"`), so if you re-record the voice
with different timing, every cut moves with it automatically. A scene can contain:

- `figures`: stick figures with a position, size, optional hat and held prop, and a list of
  actions over time (`run, walk, talk, sassy, point, pointUp, shock, disgust, facepalm, shrug,
  celebrate, craft, wave, slam, brush, sad, eat, present, write, laugh, sneak, jump, sit, scared,
  flex, drink, chew, idle`), plus emotes (`! ? !! heart sweat anger dots sparkle zzz`).
- `props`: drawn objects (`toothbrush, bonebrush, nylonbrush, twig, pig, bone, bars, tooth,
  sign, mugshot, fork, silverfork, plate, drumstick, church, grave, scroll, bottle, pills, pill,
  fish, tomato, mushroom, ship, fries, splat, chopsticks`) with entrances (`pop, drop, slam,
  slideL, slideR`) and idle motion (`wobble, bob, spin, trot, shake`).
- `texts`: big titles and year stamps (`slam, stamp, pop, type`).
- `fx`: `shake, flash, punch, speedlines, rewind, spotlight`; `sfx`: `whoosh, pop, thud, ding`.

The red-headed figure (`"head": "hero"`) is the YAP narrator and appears in every episode.
The yellow duck is placed with `"duck": {"at": "<phrase>", "x": .., "y": .., "dur": 3}`.

## Looks (`"theme"`)

- `classic`: off-white stage, black ink, red hero, Luckiest Guy captions.
- `notebook`: blue ballpoint doodles on lined paper with wobbly "boiling" lines, marker captions.
- `night`: dark stage, glowing white figures, orange hero, Bangers captions.

## Files

- `src/rig/` stick-figure skeleton and the procedural actions
- `src/props/Props.tsx` every drawn object (add new ones here)
- `src/Scene.tsx`, `src/Short.tsx` scene layout, camera FX, captions, duck, audio
- `src/themes.ts` the three looks
- `scripts/make.mjs` voice -> Whisper captions -> Remotion render -> FFmpeg loudness/export
- `public/sfx/` sound effects synthesised with FFmpeg (no licensing issues)

## Notes

- Whisper runs locally through whisper.cpp (downloaded on first run, about 1.5 GB for `medium.en`;
  set `WHISPER_MODEL=base.en` for a faster, smaller model).
- Final export is H.264 1080x1920 30 fps, audio normalised to -14 LUFS (YouTube's loudness target).
- Rendering a 50 s Short takes about 1-2 minutes on a laptop.
