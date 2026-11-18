import React from 'react';
import {Theme} from '../themes';

// Every prop is drawn centred on (0,0), roughly 200px tall at scale 1, "up" = -y.
type PP = {theme: Theme; label?: string; color?: string};

const sty = (t: Theme, fill?: string, w = 0.7) => ({
	stroke: t.ink,
	strokeWidth: t.stroke * w,
	strokeLinejoin: 'round' as const,
	strokeLinecap: 'round' as const,
	fill: fill ?? 'none',
});

const Toothbrush: React.FC<PP & {bone?: boolean; nylon?: boolean}> = ({theme, bone, nylon}) => (
	<g>
		<rect x={-14} y={-60} width={28} height={160} rx={14} {...sty(theme, bone ? '#EFE6CF' : theme.accent2)} />
		<rect x={-14} y={-100} width={28} height={50} rx={8} {...sty(theme, bone ? '#EFE6CF' : theme.accent2)} />
		{[-9, -1, 7].map((x) => (
			<path key={x} d={`M${x},-100 L${x - 14},-130 M${x},-90 L${x - 16},-118 M${x},-78 L${x - 18},-104`} {...sty(theme, undefined, 0.35)} stroke={nylon ? '#FFFFFF' : bone ? '#6B4F2A' : '#FFFFFF'} />
		))}
		<path d="M-30,-128 L-30,-70" {...sty(theme, undefined, 0.5)} opacity={0} />
	</g>
);

const Twig: React.FC<PP> = ({theme}) => (
	<g>
		<path d="M0,100 Q-6,20 4,-40 Q8,-80 0,-110" {...sty(theme, undefined, 1.2)} stroke="#7A5230" />
		<path d="M3,-30 L32,-60 M0,30 L-28,6 M2,-70 L-20,-96" {...sty(theme, undefined, 0.7)} stroke="#7A5230" />
		<ellipse cx={34} cy={-66} rx={12} ry={7} fill={theme.accent2} transform="rotate(-40 34 -66)" />
	</g>
);

const Pig: React.FC<PP> = ({theme}) => (
	<g>
		<ellipse cx={0} cy={0} rx={95} ry={62} {...sty(theme, theme.pink)} />
		<circle cx={78} cy={-34} r={44} {...sty(theme, theme.pink)} />
		<ellipse cx={112} cy={-28} rx={16} ry={13} {...sty(theme, '#F6C1C1')} />
		<circle cx={108} cy={-29} r={3} fill={theme.ink} />
		<circle cx={117} cy={-27} r={3} fill={theme.ink} />
		<circle cx={84} cy={-50} r={6} fill={theme.ink} />
		<path d="M58,-72 L62,-96 L80,-76 Z" {...sty(theme, theme.pink)} />
		<path d="M-60,50 L-62,92 M-25,56 L-25,94 M30,56 L30,94 M62,48 L66,90" {...sty(theme, undefined, 1)} />
		<path d="M-95,-10 q-22,-10 -14,-26 q10,-6 10,8" {...sty(theme, undefined, 0.6)} />
	</g>
);

const Bone: React.FC<PP> = ({theme}) => (
	<g transform="rotate(-30)">
		<rect x={-80} y={-14} width={160} height={28} rx={10} {...sty(theme, '#F1E9D2')} />
		{[-1, 1].map((s) => (
			<g key={s}>
				<circle cx={s * 84} cy={-16} r={18} {...sty(theme, '#F1E9D2')} />
				<circle cx={s * 84} cy={16} r={18} {...sty(theme, '#F1E9D2')} />
			</g>
		))}
	</g>
);

const Bars: React.FC<PP> = ({theme}) => (
	<g>
		<rect x={-200} y={-260} width={400} height={26} fill={theme.ink} />
		<rect x={-200} y={234} width={400} height={26} fill={theme.ink} />
		{[-160, -96, -32, 32, 96, 160].map((x) => (
			<rect key={x} x={x - 7} y={-250} width={14} height={500} rx={6} fill={theme.ink} opacity={0.92} />
		))}
	</g>
);

const Tooth: React.FC<PP> = ({theme}) => (
	<g>
		<path d="M-70,-70 Q-80,-120 -30,-115 Q0,-100 30,-115 Q80,-120 70,-70 Q62,-10 50,60 Q42,100 26,70 Q14,20 0,20 Q-14,20 -26,70 Q-42,100 -50,60 Q-62,-10 -70,-70 Z" {...sty(theme, '#FFFFFF')} />
		<circle cx={-24} cy={-60} r={7} fill={theme.ink} />
		<circle cx={24} cy={-60} r={7} fill={theme.ink} />
		<path d="M-22,-34 Q0,-14 22,-34" {...sty(theme, undefined, 0.5)} />
	</g>
);

const Sign: React.FC<PP> = ({theme, label = 'SIGN'}) => {
	const w = Math.max(220, label.length * 30 + 60);
	return (
		<g>
			<path d={`M-10,40 L-10,150 M10,40 L10,150`} {...sty(theme, undefined, 0.9)} />
			<rect x={-w / 2} y={-60} width={w} height={110} rx={10} {...sty(theme, theme.paper, 0.8)} />
			<text x={0} y={14} textAnchor="middle" fontFamily={theme.textFont} fontSize={48} fill={theme.ink}>
				{label}
			</text>
		</g>
	);
};

const Mugshot: React.FC<PP> = ({theme, label = 'CRIMINAL'}) => (
	<g>
		{[0, 1, 2, 3, 4, 5].map((i) => (
			<g key={i}>
				<path d={`M-220,${-250 + i * 60} L220,${-250 + i * 60}`} stroke={theme.ink} strokeWidth={3} opacity={0.35} />
				<text x={-240} y={-244 + i * 60} textAnchor="end" fontFamily={theme.textFont} fontSize={24} fill={theme.ink} opacity={0.5}>
					{`${6 - Math.floor(i / 2)}'${i % 2 ? '0' : '6'}`}
				</text>
			</g>
		))}
		<g transform="translate(0,120)">
			<rect x={-150} y={-46} width={300} height={92} rx={6} fill={theme.ink} />
			<text x={0} y={16} textAnchor="middle" fontFamily={theme.textFont} fontSize={44} fill={theme.bg}>
				{label}
			</text>
		</g>
	</g>
);

const Fork: React.FC<PP & {gold?: boolean}> = ({theme, gold = true}) => {
	const f = gold ? theme.gold : '#C9CED6';
	return (
		<g>
			<rect x={-9} y={-30} width={18} height={140} rx={9} {...sty(theme, f, 0.5)} />
			<path d="M-34,-110 L-34,-50 Q-34,-24 0,-24 Q34,-24 34,-50 L34,-110" {...sty(theme, undefined, 0.5)} stroke={theme.ink} />
			{[-34, -11, 11, 34].map((x) => (
				<rect key={x} x={x - 5} y={-118} width={10} height={70} rx={5} fill={f} stroke={theme.ink} strokeWidth={3} />
			))}
			<path d="M-34,-56 Q-34,-26 0,-26 Q34,-26 34,-56 L34,-48 Q34,-14 0,-14 Q-34,-14 -34,-48 Z" fill={f} stroke={theme.ink} strokeWidth={3} />
		</g>
	);
};

const Plate: React.FC<PP> = ({theme}) => (
	<g>
		<ellipse cx={0} cy={0} rx={130} ry={42} {...sty(theme, theme.paper)} />
		<ellipse cx={0} cy={0} rx={86} ry={26} {...sty(theme, undefined, 0.4)} />
		<path d="M-40,-10 Q-10,-60 30,-14 Z" {...sty(theme, '#C77B3E', 0.5)} />
	</g>
);

const Drumstick: React.FC<PP> = ({theme}) => (
	<g>
		<ellipse cx={0} cy={-40} rx={46} ry={62} {...sty(theme, '#C77B3E')} />
		<rect x={-9} y={10} width={18} height={70} rx={8} {...sty(theme, '#F1E9D2', 0.5)} />
		<circle cx={-12} cy={86} r={13} {...sty(theme, '#F1E9D2', 0.5)} />
		<circle cx={12} cy={86} r={13} {...sty(theme, '#F1E9D2', 0.5)} />
	</g>
);

const Church: React.FC<PP> = ({theme}) => (
	<g>
		<rect x={-110} y={-40} width={220} height={180} {...sty(theme, theme.paper)} />
		<path d="M-130,-40 L0,-150 L130,-40 Z" {...sty(theme, theme.accent)} />
		<path d="M0,-150 L0,-230 M-26,-200 L26,-200" {...sty(theme, undefined, 1)} />
		<path d="M-30,140 L-30,60 Q0,20 30,60 L30,140" {...sty(theme, theme.ink, 0.5)} />
	</g>
);

const Grave: React.FC<PP> = ({theme}) => (
	<g>
		<path d="M-80,120 L-80,-40 Q-80,-120 0,-120 Q80,-120 80,-40 L80,120 Z" {...sty(theme, '#B9BCC4')} />
		<text x={0} y={-10} textAnchor="middle" fontFamily={theme.textFont} fontSize={54} fill={theme.ink}>
			RIP
		</text>
		<path d="M-120,120 L120,120" {...sty(theme, undefined, 1)} />
	</g>
);

const Scroll: React.FC<PP> = ({theme, label = ''}) => (
	<g>
		<rect x={-110} y={-130} width={220} height={260} {...sty(theme, '#F4E8C8')} />
		<rect x={-125} y={-150} width={250} height={30} rx={14} {...sty(theme, '#E6D3A3')} />
		<rect x={-125} y={120} width={250} height={30} rx={14} {...sty(theme, '#E6D3A3')} />
		{label ? (
			<text x={0} y={0} textAnchor="middle" fontFamily={theme.textFont} fontSize={36} fill={theme.accent}>
				{label}
			</text>
		) : null}
		{[-80, -50, 40, 70].map((y) => (
			<path key={y} d={`M-80,${y} L80,${y}`} {...sty(theme, undefined, 0.3)} />
		))}
	</g>
);

const Bottle: React.FC<PP> = ({theme, label = 'KETCHUP'}) => (
	<g>
		<path d="M-60,140 L-60,-30 Q-60,-70 -24,-90 L-24,-130 L24,-130 L24,-90 Q60,-70 60,-30 L60,140 Z" {...sty(theme, '#D7261E')} />
		<rect x={-28} y={-158} width={56} height={30} rx={6} {...sty(theme, theme.paper)} />
		<rect x={-52} y={-10} width={104} height={80} rx={8} {...sty(theme, '#FFF7E0', 0.5)} />
		<text x={0} y={40} textAnchor="middle" fontFamily={theme.textFont} fontSize={label.length > 7 ? 18 : 24} fill="#D7261E">
			{label}
		</text>
	</g>
);

const Pills: React.FC<PP> = ({theme, label = 'TOMATO PILLS'}) => (
	<g>
		<rect x={-70} y={-90} width={140} height={190} rx={18} {...sty(theme, '#F2E7C9')} />
		<rect x={-80} y={-130} width={160} height={46} rx={10} {...sty(theme, theme.accent)} />
		<rect x={-60} y={-40} width={120} height={90} {...sty(theme, '#FFFFFF', 0.4)} />
		<text x={0} y={0} textAnchor="middle" fontFamily={theme.textFont} fontSize={22} fill="#D7261E">
			{label.split(' ')[0]}
		</text>
		<text x={0} y={32} textAnchor="middle" fontFamily={theme.textFont} fontSize={22} fill="#D7261E">
			{label.split(' ').slice(1).join(' ')}
		</text>
	</g>
);

const Pill: React.FC<PP> = ({theme}) => (
	<g transform="rotate(-30)">
		<rect x={-70} y={-30} width={140} height={60} rx={30} {...sty(theme, '#FFFFFF')} />
		<path d="M0,-30 L0,30 L40,30 Q70,30 70,0 Q70,-30 40,-30 Z" fill="#D7261E" stroke={theme.ink} strokeWidth={theme.stroke * 0.7} />
	</g>
);

const Fish: React.FC<PP> = ({theme}) => (
	<g>
		<path d="M-100,0 Q-20,-80 70,0 Q-20,80 -100,0 Z" {...sty(theme, '#7FB2D9')} />
		<path d="M70,0 L120,-45 L120,45 Z" {...sty(theme, '#7FB2D9')} />
		<circle cx={-56} cy={-10} r={8} fill={theme.ink} />
		<path d="M-20,-30 Q-4,0 -20,30" {...sty(theme, undefined, 0.4)} />
	</g>
);

const Tomato: React.FC<PP> = ({theme}) => (
	<g>
		<circle cx={0} cy={10} r={90} {...sty(theme, '#E53225')} />
		<path d="M0,-80 L-20,-110 M0,-80 L24,-106 M0,-80 L-40,-78 M0,-80 L40,-74" {...sty(theme, undefined, 0.8)} stroke="#2E8B3E" />
		<ellipse cx={-36} cy={-20} rx={16} ry={26} fill="#FFFFFF" opacity={0.35} />
	</g>
);

const Mushroom: React.FC<PP> = ({theme}) => (
	<g>
		<path d="M-90,-10 Q0,-130 90,-10 Z" {...sty(theme, '#B5835A')} />
		<rect x={-26} y={-10} width={52} height={90} rx={14} {...sty(theme, '#F4EAD5')} />
	</g>
);

const Ship: React.FC<PP> = ({theme}) => (
	<g>
		<path d="M-170,40 L170,40 L120,120 L-120,120 Z" {...sty(theme, '#8B5A2B')} />
		<path d="M0,40 L0,-200" {...sty(theme, undefined, 1)} />
		<path d="M8,-190 Q110,-110 8,-20 Z" {...sty(theme, theme.paper)} />
		<path d="M0,-200 L60,-184 L0,-170" fill={theme.accent} stroke={theme.ink} strokeWidth={4} />
	</g>
);

const Fries: React.FC<PP> = ({theme}) => (
	<g>
		{[-50, -28, -6, 16, 38].map((x, i) => (
			<rect key={x} x={x} y={-120 + (i % 2) * 18} width={18} height={120} {...sty(theme, '#F6C744', 0.4)} transform={`rotate(${(i - 2) * 6} ${x} 0)`} />
		))}
		<path d="M-80,-20 L80,-20 L60,110 L-60,110 Z" {...sty(theme, '#D7261E')} />
		<path d="M-50,20 Q0,50 50,20" {...sty(theme, undefined, 0.4)} stroke="#FFFFFF" />
	</g>
);

const Splat: React.FC<PP> = ({theme, color}) => (
	<path
		d="M0,-80 Q20,-40 50,-70 Q40,-30 90,-20 Q50,0 80,40 Q30,30 30,80 Q0,40 -30,90 Q-30,40 -80,50 Q-50,10 -90,-20 Q-40,-20 -50,-70 Q-20,-40 0,-80 Z"
		fill={color ?? '#D7261E'}
		stroke={theme.ink}
		strokeWidth={theme.stroke * 0.5}
	/>
);

const Chopsticks: React.FC<PP> = ({theme}) => (
	<g>
		<path d="M-30,110 L10,-120" {...sty(theme, undefined, 1.4)} stroke="#8B5A2B" />
		<path d="M20,110 L30,-120" {...sty(theme, undefined, 1.4)} stroke="#8B5A2B" />
	</g>
);

export const Duck: React.FC<{theme: Theme}> = ({theme}) => (
	<g>
		<path d="M-40,10 Q-44,40 -10,44 L30,44 Q56,40 50,10 Q46,-4 30,0 Q0,6 -14,-6 Z" fill="#FFD400" stroke={theme.name === 'night' ? '#000' : theme.ink} strokeWidth={3} />
		<circle cx={-22} cy={-18} r={18} fill="#FFD400" stroke={theme.name === 'night' ? '#000' : theme.ink} strokeWidth={3} />
		<path d="M-40,-16 L-58,-12 L-40,-6 Z" fill="#FF8A00" stroke={theme.name === 'night' ? '#000' : theme.ink} strokeWidth={2} />
		<circle cx={-26} cy={-22} r={3.5} fill="#000" />
	</g>
);

export const Prop: React.FC<PP & {name: string}> = ({name, ...p}) => {
	switch (name) {
		case 'toothbrush': return <Toothbrush {...p} />;
		case 'bonebrush': return <Toothbrush {...p} bone />;
		case 'nylonbrush': return <Toothbrush {...p} nylon />;
		case 'twig': return <Twig {...p} />;
		case 'pig': return <Pig {...p} />;
		case 'bone': return <Bone {...p} />;
		case 'bars': return <Bars {...p} />;
		case 'tooth': return <Tooth {...p} />;
		case 'sign': return <Sign {...p} />;
		case 'mugshot': return <Mugshot {...p} />;
		case 'fork': return <Fork {...p} />;
		case 'silverfork': return <Fork {...p} gold={false} />;
		case 'plate': return <Plate {...p} />;
		case 'drumstick': return <Drumstick {...p} />;
		case 'church': return <Church {...p} />;
		case 'grave': return <Grave {...p} />;
		case 'scroll': return <Scroll {...p} />;
		case 'bottle': return <Bottle {...p} />;
		case 'pills': return <Pills {...p} />;
		case 'pill': return <Pill {...p} />;
		case 'fish': return <Fish {...p} />;
		case 'tomato': return <Tomato {...p} />;
		case 'mushroom': return <Mushroom {...p} />;
		case 'ship': return <Ship {...p} />;
		case 'fries': return <Fries {...p} />;
		case 'splat': return <Splat {...p} />;
		case 'chopsticks': return <Chopsticks {...p} />;
		case 'duck': return <Duck theme={p.theme} />;
		default: return null;
	}
};
