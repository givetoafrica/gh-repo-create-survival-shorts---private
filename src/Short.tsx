import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Scene} from './Scene';
import {Duck} from './props/Props';
import {Vignette} from './sets/Sets';
import {THEMES, Theme} from './themes';
import {buildPages} from './timing';
import {Caption, Episode} from './types';

export type ShortProps = {
	episodeId: string;
	episode?: Episode;
	captions?: Caption[];
	starts?: number[];
	duckStart?: number;
	durationSec?: number;
};

const Background: React.FC<{theme: Theme}> = ({theme}) => {
	if (theme.name === 'notebook')
		return (
			<g>
				<rect width={1080} height={1920} fill={theme.bg} />
				{new Array(30).fill(0).map((_, i) => (
					<path key={i} d={`M0,${120 + i * 64} L1080,${120 + i * 64}`} stroke="#9CC3E6" strokeWidth={3} opacity={0.6} />
				))}
				<path d="M120,0 L120,1920" stroke="#F08A8A" strokeWidth={4} />
				{[400, 960, 1520].map((y) => (
					<circle key={y} cx={56} cy={y} r={20} fill="#E9E3D2" />
				))}
			</g>
		);
	if (theme.name === 'night')
		return (
			<g>
				<defs>
					<radialGradient id="ng" cx="50%" cy="48%" r="70%">
						<stop offset="0%" stopColor="#23263A" />
						<stop offset="100%" stopColor={theme.bg} />
					</radialGradient>
				</defs>
				<rect width={1080} height={1920} fill="url(#ng)" />
				<ellipse cx={540} cy={1384} rx={520} ry={34} fill={theme.accent} opacity={0.12} />
				<path d="M40,1384 L1040,1384" stroke={theme.ink} strokeWidth={5} opacity={0.5} />
			</g>
		);
	return (
		<g>
			<rect width={1080} height={1920} fill={theme.bg} />
			<path d="M0,1384 L1080,1384" stroke={theme.ground} strokeWidth={7} strokeLinecap="round" />
			{[80, 260, 700, 930].map((x) => (
				<path key={x} d={`M${x},1406 L${x + 50},1406`} stroke={theme.ground} strokeWidth={4} opacity={0.4} strokeLinecap="round" />
			))}
		</g>
	);
};

const Captions: React.FC<{caps: Caption[]; theme: Theme}> = ({caps, theme}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const pages = React.useMemo(() => buildPages(caps), [caps]);
	const page = pages.find((p) => t >= p.start && t < p.end);
	if (!page) return null;
	const k = spring({frame: (t - page.start) * fps, fps, config: {damping: 12, stiffness: 220}});
	const isNotebook = theme.name === 'notebook';
	return (
		<div
			style={{
				position: 'absolute', left: 60, right: 60, top: 1440, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
				gap: '0 58px', transform: `scale(${0.7 + 0.3 * k}) rotate(${isNotebook ? -2 : 0}deg)`,
				fontFamily: theme.captionFont, fontSize: isNotebook ? 112 : 118, lineHeight: 1.12, textTransform: 'uppercase',
			}}
		>
			{page.words.map((w, i) => {
				const active = t >= w.startMs / 1000 && t < w.endMs / 1000 + 0.05;
				const said = t >= w.startMs / 1000;
				return (
					<span
						key={i}
						style={{
							color: active ? theme.captionActive : theme.captionFill,
							WebkitTextStroke: `${isNotebook ? 12 : 16}px ${theme.captionStroke}`,
							paintOrder: 'stroke fill',
							transform: `scale(${active ? 1.12 : 1}) translateY(${active ? -6 : 0}px)`,
							display: 'inline-block',
							opacity: said || !isNotebook ? 1 : 0.35,
							textShadow: theme.glow ? `0 0 24px ${active ? theme.captionActive : '#ffffff55'}` : isNotebook ? 'none' : '0 8px 0 rgba(0,0,0,0.25)',
						}}
					>
						{w.text.replace(/^"|"$/g, '')}
					</span>
				);
			})}
		</div>
	);
};

export const Short: React.FC<ShortProps> = ({episode, captions, starts, duckStart, durationSec}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (!episode || !captions || !starts) return null;
	const theme = THEMES[episode.theme] ?? THEMES.classic;
	const total = durationSec ?? 60;
	const t = frame / fps;
	const d = episode.duck;
	const duckK = duckStart !== undefined && t >= duckStart && t < duckStart + d.dur ? spring({frame: (t - duckStart) * fps, fps, config: {damping: 10}}) : 0;
	return (
		<AbsoluteFill style={{backgroundColor: theme.bg}}>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
				<defs>
					<filter id="boil">
						<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={Math.floor(frame / 4)} />
						<feDisplacementMap in="SourceGraphic" scale={7} />
					</filter>
					<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation="6" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<Background theme={theme} />
				<g filter={theme.boil ? 'url(#boil)' : theme.glow ? 'url(#glow)' : undefined}>
					{episode.scenes.map((sc, i) => {
						const from = Math.round(starts[i] * fps);
						const to = Math.round((i + 1 < starts.length ? starts[i + 1] : total) * fps);
						return (
							<Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} layout="none">
								<Scene spec={sc} theme={theme} dur={(to - from) / fps} painted={episode.painted} />
							</Sequence>
						);
					})}
					{duckK > 0 ? (
						<g transform={`translate(${d.x},${d.y}) rotate(${d.rot ?? 0}) scale(${(d.scale ?? 0.55) * duckK})`}>
							<Duck theme={theme} />
						</g>
					) : null}
				</g>
				<Vignette theme={theme} />
			</svg>
			<Captions caps={captions} theme={theme} />
			{episode.voice ? <Audio src={staticFile(episode.voice)} /> : null}
			{episode.scenes.map((sc, i) =>
				i > 0 && sc.sfx !== 'none' ? (
					<Sequence key={`s${i}`} from={Math.round(starts[i] * fps)} durationInFrames={Math.round(fps * 0.8)} layout="none">
						<Audio src={staticFile(`sfx/${sc.sfx ?? 'whoosh'}.wav`)} volume={sc.sfx === 'thud' ? 0.5 : 0.28} />
					</Sequence>
				) : null,
			)}
			<AbsoluteFill style={{opacity: interpolate(frame, [0, 3], [1, 0], {extrapolateRight: 'clamp'}), backgroundColor: theme.bg}} />
		</AbsoluteFill>
	);
};
