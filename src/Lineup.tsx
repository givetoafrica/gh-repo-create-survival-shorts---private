import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CAST, withCast} from './cast';
import {ACTIONS} from './rig/actions';
import {Stickman} from './rig/Stickman';
import {THEMES} from './themes';
import {SetBackdrop} from './sets/Sets';

// Cast sheet: every recurring character, side by side, for review.
export const Lineup: React.FC<{names?: string[]; theme?: string}> = ({names, theme = 'classic'}) => {
	const th = THEMES[theme];
	const list = names ?? Object.keys(CAST).filter((n) => n !== 'hero');
	const rows = [list.slice(0, Math.ceil(list.length / 2)), list.slice(Math.ceil(list.length / 2))];
	return (
		<AbsoluteFill style={{background: th.bg}}>
			<svg width={1080} height={1920}>
				{rows.map((row, r) => (
					<g key={r}>
						{row.map((n, i) => {
							const f = withCast({who: n, x: 0, acts: [{t: 0, a: 'idle'}]});
							const x = (1080 / row.length) * (i + 0.5);
							const y = 880 + r * 860;
							return (
								<g key={n}>
									<g transform={`translate(${x},${y}) scale(0.95)`}>
										<Stickman pose={ACTIONS.idle(0.3)} theme={th} color={f.color} hat={f.hat} look={f.look} expr={r % 2 ? 'smug' : 'grin'} />
									</g>
									<text x={x} y={y + 70} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} fontSize={34} fill={th.ink}>{n}</text>
								</g>
							);
						})}
						<path d={`M0,${880 + r * 860} L1080,${880 + r * 860}`} stroke={th.ink} strokeWidth={5} />
					</g>
				))}
			</svg>
		</AbsoluteFill>
	);
};
