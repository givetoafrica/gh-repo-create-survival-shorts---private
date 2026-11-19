import React from 'react';
import {MouthContext} from './lipsync';

// Flat cartoon head drawn over a painted, realistic body ("photo" scenes).
// Defined once per character in cast.ts (face/hair/beard colours), so every shot matches.
export type HeadStyle = {
	skin?: string;
	hair?: string; // colour, or 'none' for bald
	hairStyle?: 'short' | 'long' | 'wild' | 'bun' | 'none';
	beard?: 'none' | 'full' | 'moustache' | 'stubble';
	lashes?: boolean;
	brow?: number; // 0 calm, 1 raised, -1 cross
};

export const CartoonHead: React.FC<{x: number; y: number; r: number; rot?: number; style?: HeadStyle; talking?: boolean; blink?: boolean; look?: number}> = ({
	x, y, r, rot = 0, style = {}, talking = true, blink = false, look = 0,
}) => {
	const vis = React.useContext(MouthContext);
	const skin = style.skin ?? '#F3C9A0';
	const hair = style.hair ?? '#3a2614';
	const hs = style.hairStyle ?? 'short';
	const ink = '#151515';
	const k = r / 100; // drawn on a 100-radius grid
	const open = talking ? vis.open : 0;
	const brow = style.brow ?? 0;
	const eye = (ex: number) => (
		<g key={ex}>
			{blink ? (
				<path d={`M${ex - 17},-8 Q${ex},2 ${ex + 17},-8`} stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
			) : (
				<>
					<ellipse cx={ex} cy={-10} rx={19} ry={15} fill="#fff" stroke={ink} strokeWidth={5} />
					<circle cx={ex + look * 6} cy={-9} r={6.5} fill={ink} />
					{style.lashes ? <path d={`M${ex + 12},-22 l7,-9 M${ex + 3},-25 l3,-10`} stroke={ink} strokeWidth={4} strokeLinecap="round" /> : null}
				</>
			)}
			<path d={`M${ex - 18},${-36 - brow * 6} Q${ex},${-44 - brow * 8} ${ex + 18},${-36 - brow * 6 + (brow < 0 ? (ex < 0 ? 10 : -10) : 0)}`} stroke={hair === 'none' ? ink : hair} strokeWidth={7} fill="none" strokeLinecap="round" />
		</g>
	);
	const mouthY = 48;
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`}>
			{/* hair behind */}
			{hs === 'long' || hs === 'wild' ? <path d="M-104,-30 Q-120,70 -80,120 L80,120 Q120,70 104,-30 Q90,-120 0,-122 Q-90,-120 -104,-30 Z" fill={hair} stroke={ink} strokeWidth={5} /> : null}
			{/* face */}
			<path d="M-86,-40 Q-90,-112 0,-112 Q90,-112 86,-40 L82,40 Q72,108 0,112 Q-72,108 -82,40 Z" fill={skin} stroke={ink} strokeWidth={6} />
			{/* ears */}
			<ellipse cx={-88} cy={4} rx={13} ry={20} fill={skin} stroke={ink} strokeWidth={5} />
			<ellipse cx={88} cy={4} rx={13} ry={20} fill={skin} stroke={ink} strokeWidth={5} />
			{/* beard */}
			{style.beard === 'full' ? <path d="M-84,10 Q-80,130 0,140 Q80,130 84,10 Q60,40 40,30 Q0,22 -40,30 Q-60,40 -84,10 Z" fill={hair} stroke={ink} strokeWidth={5} /> : null}
			{style.beard === 'stubble' ? <path d="M-78,20 Q-70,104 0,108 Q70,104 78,20 Q40,60 0,58 Q-40,60 -78,20 Z" fill={hair} opacity={0.35} /> : null}
			{/* nose */}
			<path d={`M${4 + look * 3},-4 Q${16 + look * 3},18 ${2 + look * 3},24`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
			{eye(-32)}
			{eye(32)}
			{/* mouth: closed line or open shape that follows the narration */}
			{open > 0.12 ? (
				<g>
					<ellipse cx={0} cy={mouthY} rx={vis.round ? 13 : vis.wide ? 26 : 20} ry={5 + open * (vis.round ? 20 : 16)} fill="#3b0d0d" stroke={ink} strokeWidth={5} />
					{open > 0.5 && !vis.round ? <ellipse cx={0} cy={mouthY + 4 + open * 8} rx={11} ry={5} fill="#E5484D" /> : null}
				</g>
			) : (
				<path d={`M-20,${mouthY} Q0,${mouthY + 10} 20,${mouthY}`} stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
			)}
			{style.beard === 'moustache' || style.beard === 'full' ? <path d={`M-30,${mouthY - 10} Q-14,${mouthY - 22} 0,${mouthY - 13} Q14,${mouthY - 22} 30,${mouthY - 10} Q14,${mouthY - 6} 0,${mouthY - 9} Q-14,${mouthY - 6} -30,${mouthY - 10} Z`} fill={hair} stroke={ink} strokeWidth={4} /> : null}
			{/* hair on top */}
			{hs !== 'none' && hair !== 'none' ? (
				hs === 'wild' ? (
					<path d="M-92,-30 Q-110,-90 -70,-118 Q-50,-150 -10,-132 Q20,-160 50,-130 Q100,-135 98,-80 Q112,-50 92,-30 Q70,-80 30,-90 Q-20,-70 -60,-88 Q-80,-70 -92,-30 Z" fill={hair} stroke={ink} strokeWidth={5} />
				) : hs === 'bun' ? (
					<>
						<circle cx={0} cy={-128} r={34} fill={hair} stroke={ink} strokeWidth={5} />
						<path d="M-90,-30 Q-96,-122 0,-118 Q96,-122 90,-30 Q60,-84 0,-84 Q-60,-84 -90,-30 Z" fill={hair} stroke={ink} strokeWidth={5} />
					</>
				) : (
					<path d="M-90,-34 Q-98,-124 0,-122 Q98,-124 90,-34 Q80,-76 40,-80 Q0,-70 -50,-82 Q-80,-74 -90,-34 Z" fill={hair} stroke={ink} strokeWidth={5} />
				)
			) : null}
		</g>
	);
};
