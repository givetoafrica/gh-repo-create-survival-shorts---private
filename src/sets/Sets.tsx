import React from 'react';
import {Theme} from '../themes';

// Backdrops drawn behind the action (simple flat shapes, one shadow tone).
// Bold simple figures in front of fuller, lit sets is what gives the reference Shorts their production value.
export type SetName = 'none' | 'prison' | 'palace' | 'sea' | 'cave' | 'study' | 'kitchen' | 'church' | 'lab' | 'street' | 'ship';

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c: number[]) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

export const tone = (theme: Theme, h: string) => {
	const c = hex(h);
	if (theme.name === 'night') return toHex(c.map((v) => v * 0.32 + 8));
	if (theme.name === 'notebook') return toHex(c.map((v) => v * 0.25 + 255 * 0.75));
	return toHex(c.map((v) => v * 0.8 + 255 * 0.2));
};

const GROUND = 1180;

export const SetBackdrop: React.FC<{name?: SetName; theme: Theme}> = ({name = 'none', theme}) => {
	if (name === 'none') return null;
	const T = (h: string) => tone(theme, h);
	const st = {stroke: theme.name === 'night' ? '#000' : theme.ink, strokeWidth: 4, strokeLinejoin: 'round' as const};
	const W = 1500; // sets are wider than the frame so push-ins never show an edge
	const X0 = -210;
	switch (name) {
		case 'prison':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#8a8378')} />
					{new Array(22).fill(0).map((_, r) =>
						new Array(10).fill(0).map((__, c) => (
							<rect key={`${r}-${c}`} x={X0 + c * 160 + (r % 2) * 80} y={r * 56} width={152} height={50} rx={6} fill={T('#9b948a')} />
						)),
					)}
					<rect x={700} y={330} width={220} height={190} fill={T('#cfe6f5')} {...st} />
					{[740, 790, 840, 880].map((x) => <rect key={x} x={x} y={330} width={12} height={190} fill={theme.ink} />)}
					<path d="M700,520 L920,520 L760,1180 L380,1180 Z" fill="#fff8d0" opacity={theme.name === 'night' ? 0.12 : 0.25} />
				</g>
			);
		case 'palace':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#d8c39a')} />
					<path d={`M${X0},0 L${X0 + W},0 L${X0 + W},140 Q540,260 ${X0},140 Z`} fill={T('#9e2b2b')} {...st} />
					{[60, 330, 750, 1020].map((x) => (
						<g key={x}>
							<rect x={x - 45} y={180} width={90} height={1000} fill={T('#efe6d2')} {...st} />
							<rect x={x - 62} y={160} width={124} height={34} fill={T('#efe6d2')} {...st} />
							<rect x={x - 30} y={200} width={14} height={970} fill={T('#cfc4ad')} />
						</g>
					))}
					<circle cx={540} cy={240} r={70} fill={T('#f2c94c')} {...st} />
				</g>
			);
		case 'sea':
			return (
				<g>
					<defs>
						<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor={T('#7cc4ef')} />
							<stop offset="1" stopColor={T('#f6d8a8')} />
						</linearGradient>
					</defs>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill="url(#sky)" />
					<circle cx={820} cy={430} r={110} fill={T('#ffd25a')} />
					<rect x={X0} y={760} width={W} height={GROUND - 760} fill={T('#2f7fb8')} />
					{[0, 1, 2, 3].map((r) => (
						<path key={r} d={new Array(12).fill(0).map((_, i) => `${i === 0 ? 'M' : 'L'}${X0 + i * 140},${800 + r * 100} q35,-24 70,0 q35,24 70,0`).join(' ')} stroke={T('#bfe3ff')} strokeWidth={6} fill="none" />
					))}
				</g>
			);
		case 'cave':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#3a2a1f')} />
					<path d={`M${X0},${GROUND} L${X0},300 Q100,80 540,120 Q980,80 1290,300 L1290,${GROUND} L980,${GROUND} Q960,520 540,480 Q120,520 100,${GROUND} Z`} fill={T('#5c4433')} {...st} />
					<ellipse cx={540} cy={900} rx={520} ry={420} fill="#ffb347" opacity={theme.name === 'night' ? 0.12 : 0.18} />
				</g>
			);
		case 'study':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#c9a77c')} />
					<rect x={-40} y={260} width={420} height={760} fill={T('#7a5236')} {...st} />
					{[0, 1, 2, 3].map((r) =>
						new Array(9).fill(0).map((_, i) => (
							<rect key={`${r}-${i}`} x={-20 + i * 44} y={290 + r * 185} width={34} height={150} fill={T(['#b33a3a', '#2f6f9f', '#d9a441', '#3f7f4f'][(i + r) % 4])} />
						)),
					)}
					<rect x={660} y={300} width={300} height={380} fill={T('#cfe6f5')} {...st} />
					<path d="M810,300 L810,680 M660,490 L960,490" {...st} strokeWidth={10} />
				</g>
			);
		case 'kitchen':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#f2e3c6')} />
					{new Array(14).fill(0).map((_, r) => new Array(14).fill(0).map((__, c) => (
						<rect key={`${r}-${c}`} x={X0 + c * 110} y={560 + r * 50} width={104} height={44} fill={(r + c) % 2 ? T('#e7f0f2') : T('#d4e4e8')} />
					)))}
					<rect x={X0} y={980} width={W} height={200} fill={T('#a8754a')} {...st} />
					<rect x={80} y={240} width={360} height={30} fill={T('#7a5236')} />
					{[120, 200, 290, 370].map((x, i) => <rect key={x} x={x} y={170} width={50} height={70} rx={8} fill={T(['#d7261e', '#f2c94c', '#3f7f4f', '#2f6f9f'][i])} {...st} />)}
				</g>
			);
		case 'church':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#b7aa94')} />
					<path d="M380,1000 L380,420 Q540,220 700,420 L700,1000 Z" fill={T('#5b8fd1')} {...st} />
					<path d="M540,300 L540,1000 M380,640 L700,640" {...st} strokeWidth={10} />
					<path d="M420,460 L660,860 M660,460 L420,860" stroke={T('#e0b640')} strokeWidth={14} opacity={0.6} />
					<path d="M380,1000 L120,1180 L960,1180 L700,1000 Z" fill="#fff6c8" opacity={theme.name === 'night' ? 0.1 : 0.22} />
				</g>
			);
		case 'lab':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#dfe8e4')} />
					{[300, 560].map((y) => (
						<g key={y}>
							<rect x={560} y={y} width={500} height={22} fill={T('#7a5236')} />
							{[600, 680, 760, 850, 940, 1010].map((x, i) => (
								<rect key={x} x={x} y={y - 90 + (i % 2) * 20} width={46} height={90 - (i % 2) * 20} rx={10} fill={T(['#d7261e', '#5b8fd1', '#3f7f4f', '#f2c94c'][i % 4])} {...st} />
							))}
						</g>
					))}
					<rect x={40} y={220} width={240} height={300} fill={T('#ffffff')} {...st} />
					<path d="M80,300 L240,300 M80,360 L220,360 M80,420 L200,420" {...st} />
					<path d="M110,250 L160,250 L135,280 Z" fill={T('#d7261e')} />
				</g>
			);
		case 'street':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#bfe0f2')} />
					{[[-120, 380, '#d9a07a'], [180, 300, '#c7c08f'], [460, 420, '#c98a8a'], [760, 260, '#9fb3c9'], [1040, 360, '#d9a07a']].map(([x, y, c]) => (
						<g key={x as number}>
							<rect x={x as number} y={y as number} width={280} height={GROUND - (y as number)} fill={T(c as string)} {...st} />
							<path d={`M${(x as number) - 20},${y} L${(x as number) + 140},${(y as number) - 110} L${(x as number) + 300},${y} Z`} fill={T('#7a3b2e')} {...st} />
							{[0, 1].map((r) => [0, 1].map((cc) => (
								<rect key={`${r}${cc}`} x={(x as number) + 40 + cc * 120} y={(y as number) + 60 + r * 170} width={80} height={100} fill={T('#fff3c4')} {...st} />
							)))}
						</g>
					))}
				</g>
			);
		case 'ship':
			return (
				<g>
					<rect x={X0} y={-500} width={W} height={GROUND + 500} fill={T('#87c3e8')} />
					<rect x={X0} y={0} width={W} height={300} fill={T('#a9d4f0')} />
					<path d={`M${X0},740 L${X0 + W},740`} stroke={T('#ffffff')} strokeWidth={8} />
					<rect x={X0} y={760} width={W} height={420} fill={T('#8b5a2b')} />
					{new Array(12).fill(0).map((_, i) => <path key={i} d={`M${X0 + i * 130},760 L${X0 + i * 130},1180`} stroke={T('#6e4520')} strokeWidth={6} />)}
					<rect x={860} y={0} width={36} height={760} fill={T('#6e4520')} {...st} />
					<path d="M900,60 Q1180,300 900,620 Z" fill={T('#f5efe0')} {...st} />
				</g>
			);
	}
	return null;
};

// Soft light pool behind the action + vignette on top: depth and focus.
export const LightPool: React.FC<{theme: Theme}> = ({theme}) => (
	<g>
		<defs>
			<radialGradient id="pool" cx="50%" cy="50%" r="50%">
				<stop offset="0" stopColor={theme.name === 'night' ? '#ffd9a8' : '#ffffff'} stopOpacity={theme.name === 'night' ? 0.22 : 0.55} />
				<stop offset="1" stopColor="#ffffff" stopOpacity={0} />
			</radialGradient>
		</defs>
		<ellipse cx={540} cy={1000} rx={620} ry={560} fill="url(#pool)" />
	</g>
);

export const Vignette: React.FC<{theme: Theme}> = ({theme}) => (
	<g>
		<defs>
			<radialGradient id="vig" cx="50%" cy="48%" r="75%">
				<stop offset="0.55" stopColor="#000" stopOpacity={0} />
				<stop offset="1" stopColor="#000" stopOpacity={theme.name === 'night' ? 0.7 : theme.name === 'notebook' ? 0.12 : 0.38} />
			</radialGradient>
		</defs>
		<rect width={1080} height={1920} fill="url(#vig)" />
	</g>
);
