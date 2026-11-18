import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Short, ShortProps} from './Short';
import {Lineup} from './Lineup';
import {resolveSceneStarts, findWordTime} from './timing';
import {Caption, Episode} from './types';

const FPS = 30;
for (const [family, file] of [
	['LuckiestGuy', 'LuckiestGuy.woff2'],
	['PermanentMarker', 'PermanentMarker.woff2'],
	['Bangers', 'Bangers.woff2'],
]) {
	loadFont({family, url: staticFile(file)});
}

export const RemotionRoot: React.FC = () => (
	<>
	<Composition id="Lineup" component={Lineup as any} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{}} />
	<Composition
		id="Short"
		component={Short}
		width={1080}
		height={1920}
		fps={FPS}
		durationInFrames={FPS * 50}
		defaultProps={{episodeId: 'toothbrush'} as ShortProps}
		calculateMetadata={async ({props}) => {
			const ep: Episode = await (await fetch(staticFile(`episodes/${props.episodeId}/episode.json`))).json();
			const captions: Caption[] = await (await fetch(staticFile(ep.captions))).json();
			const starts = resolveSceneStarts(ep, captions);
			const durationSec = captions[captions.length - 1].endMs / 1000 + (ep.tailSec ?? 0.9);
			if (ep.voice) {
				const ok = await fetch(staticFile(ep.voice), {method: 'HEAD'}).then((r) => r.ok).catch(() => false);
				if (!ok) {
					console.warn(`voice file ${ep.voice} missing: rendering silent preview`);
					ep.voice = null;
				}
			}
			// painted backdrops are optional: use public/bg/<set>.jpg when present, else the drawn set
			const sets = [...new Set(ep.scenes.map((sc) => sc.set).filter((x): x is NonNullable<typeof x> => !!x && x !== 'none'))];
			const head = (f: string) => fetch(staticFile(f), {method: 'HEAD'}).then((r) => r.ok).catch(() => false);
			ep.painted = {};
			for (const st of sets) {
				for (const f of [`bg/${ep.id}/${st}.jpg`, `bg/${st}.jpg`]) if (await head(f)) { ep.painted[st] = f; break; }
			}
			const duckStart = findWordTime(captions, ep.duck.at);
			return {
				durationInFrames: Math.ceil(durationSec * FPS),
				props: {...props, episode: ep, captions, starts, durationSec, duckStart},
			};
		}}
	/>
</>
);
