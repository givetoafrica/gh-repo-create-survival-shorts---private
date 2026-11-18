import React from 'react';
import {Prop} from '../props/Props';
import {Theme} from '../themes';

// All angles in degrees. Limbs: 0 = straight down, +90 = forward (screen right), 180 = straight up.
// Torso/head: 0 = upright, positive leans forward.
export type Pose = {
	dx: number; dy: number; // root offset from the hip anchor
	torso: number; head: number;
	lArm: number; lFore: number; rArm: number; rFore: number;
	lLeg: number; lShin: number; rLeg: number; rShin: number;
	sx?: number; sy?: number; // squash & stretch
};

// Proportions follow the bold "thick-limb" stick style: big head (~1/5 height), long legs.
export const L = {torso: 140, head: 68, arm: 78, fore: 72, thigh: 88, shin: 86};
export const HIP_HEIGHT = L.thigh + L.shin; // hip height above ground when standing

const rad = (d: number) => (d * Math.PI) / 180;
const dir = (a: number, len: number) => ({x: Math.sin(rad(a)) * len, y: Math.cos(rad(a)) * len});

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
	const out: any = {};
	for (const k of Object.keys(a) as (keyof Pose)[]) {
		const va = (a[k] ?? 1) as number;
		const vb = (b[k] ?? 1) as number;
		out[k] = va + (vb - va) * t;
	}
	return out as Pose;
};

export type Hat = 'none' | 'tophat' | 'crown' | 'cap' | 'bandana' | 'tiara' | 'mitre' | 'doctor' | 'sailor' | 'helmet' | 'laurel' | 'nemes' | 'veil' | 'chef';
export type Outfit = 'shirt' | 'tunic' | 'toga' | 'robe' | 'dress' | 'gown' | 'armor' | 'apron' | 'suit';
export type Hair = 'none' | 'short' | 'long' | 'bun' | 'ponytail' | 'braids' | 'curly';
// Wardrobe layer: garments snap onto the same rig, so every character keeps the same proportions.
export type Look = {outfit?: Outfit; trim?: string; hair?: Hair; hairColor?: string; beard?: 'none' | 'beard' | 'moustache'; cape?: string; lashes?: boolean};

export const Stickman: React.FC<{
	pose: Pose;
	theme: Theme;
	color?: string; // body colour
	headColor?: string;
	hat?: Hat;
	holding?: string; // prop held in right hand
	holdingScale?: number;
	holdingRot?: number;
	expr?: Expr;
	blink?: boolean;
	look?: Look;
}> = ({pose, theme, color, headColor, hat = 'none', holding, holdingScale = 0.45, holdingRot = 0, expr = 'neutral', blink = false, look = {}}) => {
	const ink = color ?? theme.ink;
	const hip = {x: pose.dx, y: -HIP_HEIGHT + pose.dy};
	const t = dir(180 - pose.torso, L.torso); // upward
	const neck = {x: hip.x - t.x * -1 * 1, y: hip.y + t.y};
	// fix sign: torso positive leans forward (+x)
	neck.x = hip.x + Math.sin(rad(pose.torso)) * L.torso;
	neck.y = hip.y - Math.cos(rad(pose.torso)) * L.torso;
	const shoulder = {
		x: neck.x - Math.sin(rad(pose.torso)) * 10,
		y: neck.y + Math.cos(rad(pose.torso)) * 10,
	};
	const ha = pose.torso + pose.head;
	const head = {
		x: neck.x + Math.sin(rad(ha)) * (L.head + 4),
		y: neck.y - Math.cos(rad(ha)) * (L.head + 4),
	};
	const limb = (o: {x: number; y: number}, a1: number, l1: number, a2: number, l2: number) => {
		const d1 = dir(a1, l1);
		const m = {x: o.x + d1.x, y: o.y + d1.y};
		const d2 = dir(a2, l2);
		const e = {x: m.x + d2.x, y: m.y + d2.y};
		return {m, e, d: `M${o.x},${o.y} L${m.x},${m.y} L${e.x},${e.y}`};
	};
	const lA = limb(shoulder, pose.lArm, L.arm, pose.lFore, L.fore);
	const rA = limb(shoulder, pose.rArm, L.arm, pose.rFore, L.fore);
	const lL = limb(hip, pose.lLeg, L.thigh, pose.lShin, L.shin);
	const rL = limb(hip, pose.rLeg, L.thigh, pose.rShin, L.shin);
	const W = theme.limb; // coloured limb width
	const O = theme.outline; // ink outline around limbs
	const bodyCol = color ?? theme.body;
	const tube = (d: string, key: string, back = false, w = W) => (
		<g key={key} opacity={back ? 0.92 : 1}>
			<path d={d} stroke={theme.outlineColor} strokeWidth={w + O * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
			<path d={d} stroke={back ? theme.bodyBack ?? bodyCol : bodyCol} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
		</g>
	);
	const outfit = look.outfit ?? 'shirt';
	const trim = look.trim ?? theme.gold;
	const R = L.head;
	const OUT = {stroke: theme.outlineColor, strokeWidth: O, strokeLinejoin: 'round' as const};
	// point along a leg at fraction f of its length (for hems)
	const legAt = (lg: {m: {x: number; y: number}; e: {x: number; y: number}}, f: number) => {
		const ft = L.thigh / (L.thigh + L.shin);
		if (f <= ft) {const k = f / ft; return {x: hip.x + (lg.m.x - hip.x) * k, y: hip.y + (lg.m.y - hip.y) * k};}
		const k = (f - ft) / (1 - ft);
		return {x: lg.m.x + (lg.e.x - lg.m.x) * k, y: lg.m.y + (lg.e.y - lg.m.y) * k};
	};
	const skirtLen: Partial<Record<Outfit, [number, number]>> = {tunic: [0.48, 14], toga: [0.55, 12], armor: [0.45, 10], robe: [0.9, 16], dress: [0.86, 34], gown: [0.92, 52], apron: [0.5, 8]};
	const sk = skirtLen[outfit];
	let skirt: React.ReactNode = null;
	if (sk) {
		const a = legAt(lL, sk[0]), b = legAt(rL, sk[0]);
		const lo = Math.min(a.x, b.x) - W / 2 - sk[1], hi = Math.max(a.x, b.x) + W / 2 + sk[1];
		const hy = Math.max(a.y, b.y) + 4;
		const top = hip.y - 8, hw = W * 1.5;
		const d = `M${hip.x - hw},${top} L${hip.x + hw},${top} L${hi},${hy} Q${(lo + hi) / 2},${hy + 16} ${lo},${hy} Z`;
		const col = outfit === 'armor' ? '#8a5a2b' : outfit === 'apron' ? '#ffffff' : bodyCol;
		skirt = (
			<g>
				<path d={d} fill={col} {...OUT} />
				{outfit === 'armor' ? [0.25, 0.5, 0.75].map((k) => <path key={k} d={`M${hip.x - hw + 2 * hw * k},${top + 8} L${lo + (hi - lo) * k},${hy}`} stroke={theme.outlineColor} strokeWidth={4} />) : null}
				{outfit === 'gown' || outfit === 'robe' || outfit === 'tunic' ? <path d={`M${lo + 6},${hy - 4} Q${(lo + hi) / 2},${hy + 10} ${hi - 6},${hy - 4}`} stroke={trim} strokeWidth={8} fill="none" /> : null}
				{outfit === 'gown' || outfit === 'dress' || outfit === 'tunic' || outfit === 'robe' ? <path d={`M${hip.x - hw},${top + 4} L${hip.x + hw},${top + 4}`} stroke={outfit === 'dress' ? theme.outlineColor : trim} strokeWidth={9} strokeLinecap="round" /> : null}
			</g>
		);
	}
	// cape hangs behind, swept away from the facing direction
	const cape = look.cape ? (
		<path d={`M${shoulder.x - 22},${shoulder.y + 4} L${shoulder.x + 18},${shoulder.y + 4} L${hip.x - 10},${hip.y + L.thigh * 0.95} Q${hip.x - 70},${hip.y + L.thigh * 1.05} ${hip.x - 120},${hip.y + L.thigh * 0.85} Z`} fill={look.cape} {...OUT} />
	) : null;
	const torsoCol = outfit === 'armor' ? '#9aa3ad' : bodyCol;
	const chest = (() => {
		const mx = (hip.x + neck.x) / 2, my = (hip.y + neck.y) / 2;
		if (outfit === 'toga') return <path d={`M${shoulder.x - 18},${shoulder.y + 6} L${hip.x + 22},${hip.y - 12}`} stroke={trim} strokeWidth={14} strokeLinecap="round" />;
		if (outfit === 'armor') return <path d={`M${mx - 28},${my - 18} L${mx + 28},${my - 18} M${mx - 30},${my + 10} L${mx + 30},${my + 10}`} stroke={theme.outlineColor} strokeWidth={4} />;
		if (outfit === 'suit') return <path d={`M${neck.x - 18},${neck.y + 22} L${neck.x},${neck.y + 60} L${neck.x + 18},${neck.y + 22} M${neck.x},${neck.y + 40} L${neck.x},${neck.y + 90}`} stroke="#ffffff" strokeWidth={7} fill="none" />;
		if (outfit === 'apron') return <rect x={mx - 26} y={my - 20} width={52} height={70} rx={8} fill="#ffffff" {...OUT} strokeWidth={4} />;
		if (outfit === 'gown') return <path d={`M${neck.x - 26},${neck.y + 26} Q${neck.x},${neck.y + 46} ${neck.x + 26},${neck.y + 26}`} stroke={trim} strokeWidth={8} fill="none" />;
		return null;
	})();
	const hairCol = look.hairColor ?? '#3a2614';
	const hair = look.hair ?? 'none';
	const hairBack: React.ReactNode =
		hair === 'long' ? <path d={`M${-R * 0.1},${-R * 0.95} Q${-R * 1.45},${-R * 0.6} ${-R * 1.25},${R * 1.5} Q${-R * 0.4},${R * 1.75} ${R * 0.15},${R * 1.1} Z`} fill={hairCol} {...OUT} />
		: hair === 'ponytail' ? <path d={`M${-R * 0.85},${-R * 0.55} Q${-R * 1.9},${-R * 0.3} ${-R * 1.55},${R * 1.1} Q${-R * 1.2},${R * 0.2} ${-R * 0.8},${R * 0.05} Z`} fill={hairCol} {...OUT} />
		: hair === 'braids' ? <path d={`M${-R * 0.6},${R * 0.5} L${-R * 0.8},${R * 1.8} M${R * 0.1},${R * 0.7} L${R * 0.05},${R * 1.9}`} stroke={hairCol} strokeWidth={22} strokeLinecap="round" />
		: hair === 'bun' ? <circle cx={-R * 0.78} cy={-R * 0.72} r={R * 0.42} fill={hairCol} {...OUT} />
		: null;
	const hairTop: React.ReactNode = hair === 'none' ? null : hair === 'curly'
		? <g>{[-150, -120, -90, -60, -30, -180].map((a) => <circle key={a} cx={Math.cos(rad(a)) * R * 0.92} cy={Math.sin(rad(a)) * R * 0.92} r={R * 0.34} fill={hairCol} {...OUT} />)}</g>
		: <path d={`M${R * 0.55},${-R * 0.84} A${R},${R} 0 0 0 ${-R},${R * 0.15} L${-R * 0.72},${R * 0.1} Q${-R * 0.55},${-R * 0.45} ${R * 0.55},${-R * 0.84} Z`} fill={hairCol} {...OUT} />;
	const beard = look.beard === 'beard'
		? <path d={`M${-R * 0.45},${R * 0.3} C${-R * 0.25},${R * 1.35} ${R * 0.9},${R * 1.25} ${R * 0.98},${R * 0.2} Q${R * 0.45},${R * 0.62} ${-R * 0.45},${R * 0.3} Z`} fill={hairCol} {...OUT} strokeWidth={O * 0.7} />
		: look.beard === 'moustache' ? <path d={`M${R * 0.05},${R * 0.22} Q${R * 0.3},${R * 0.1} ${R * 0.45},${R * 0.2} Q${R * 0.6},${R * 0.1} ${R * 0.85},${R * 0.22} Q${R * 0.45},${R * 0.38} ${R * 0.05},${R * 0.22} Z`} fill={hairCol} />
		: null;
	const tubeC = (d: string, key: string, col: string, w: number) => (
		<g key={key}>
			<path d={d} stroke={theme.outlineColor} strokeWidth={w + O * 2} strokeLinecap="round" fill="none" />
			<path d={d} stroke={col} strokeWidth={w} strokeLinecap="round" fill="none" />
		</g>
	);
	const torsoD = `M${hip.x},${hip.y - 6} L${(hip.x + neck.x * 3) / 4},${(hip.y + neck.y * 3) / 4 + 14}`;
	const facing = Math.sin(rad(ha));
	return (
		<g transform={`scale(${pose.sx ?? 1},${pose.sy ?? 1})`}>
			{cape}
			{tube(lL.d, 'll', true)}
			{tube(lA.d, 'la', true)}
			{tube(rL.d, 'rl')}
			{skirt}
			{tubeC(torsoD, 't', torsoCol, W * 3)}
			{chest}
			{holding ? (
				<g transform={`translate(${rA.e.x},${rA.e.y}) rotate(${-pose.rFore + 180 + holdingRot}) scale(${holdingScale * 1.5})`}>
					<Prop name={holding} theme={theme} />
				</g>
			) : null}
			{tube(rA.d, 'ra')}
			<g transform={`translate(${head.x},${head.y}) rotate(${ha})`}>
				{hairBack}
				<circle r={L.head} fill={headColor ?? theme.skin} stroke={theme.outlineColor} strokeWidth={O} />
				{beard}
				<Face expr={expr} ink={theme.outlineColor} look={facing * 4} blink={blink} lashes={look.lashes} />
				{hat === 'none' || hat === 'cap' || hat === 'bandana' || hat === 'laurel' || hat === 'tiara' || hat === 'veil' ? hairTop : null}
			</g>
			<HatShape hat={hat} x={head.x} y={head.y} rot={ha} theme={theme} />
		</g>
	);
};

export type Expr = 'neutral' | 'shock' | 'smug' | 'grin' | 'frown' | 'angry' | 'disgust' | 'sleepy';

// Cartoon face: dot eyes + one-line brows + small mouth. Expression swaps carry the comedy.
const Face: React.FC<{expr: Expr; ink: string; look: number; blink: boolean; lashes?: boolean}> = ({expr, ink, look, blink, lashes}) => {
	const ex = [6 + look, 24 + look];
	const ey = -6;
	const line = {stroke: ink, strokeWidth: 5, strokeLinecap: 'round' as const, fill: 'none'};
	const eyes = blink || expr === 'sleepy'
		? ex.map((x) => <path key={x} d={`M${x - 6},${ey} Q${x},${ey + 5} ${x + 6},${ey}`} {...line} />)
		: expr === 'smug'
			? ex.map((x) => (
					<g key={x}>
						<circle cx={x} cy={ey + 1} r={6} fill={ink} />
						<path d={`M${x - 9},${ey - 2} L${x + 9},${ey - 2}`} {...line} strokeWidth={6} />
					</g>
				))
			: ex.map((x) => <circle key={x} cx={x} cy={ey} r={expr === 'shock' ? 8 : 6} fill={ink} />);
	const brows: Record<Expr, string> = {
		neutral: '',
		shock: `M${ex[0] - 8},${ey - 22} Q${ex[0]},${ey - 30} ${ex[0] + 8},${ey - 22} M${ex[1] - 8},${ey - 22} Q${ex[1]},${ey - 30} ${ex[1] + 8},${ey - 22}`,
		smug: `M${ex[0] - 8},${ey - 16} L${ex[0] + 8},${ey - 14} M${ex[1] - 8},${ey - 18} L${ex[1] + 8},${ey - 22}`,
		grin: `M${ex[0] - 8},${ey - 18} Q${ex[0]},${ey - 24} ${ex[0] + 8},${ey - 18} M${ex[1] - 8},${ey - 18} Q${ex[1]},${ey - 24} ${ex[1] + 8},${ey - 18}`,
		frown: `M${ex[0] - 8},${ey - 14} L${ex[0] + 8},${ey - 20} M${ex[1] - 8},${ey - 20} L${ex[1] + 8},${ey - 14}`,
		angry: `M${ex[0] - 8},${ey - 22} L${ex[0] + 8},${ey - 12} M${ex[1] - 8},${ey - 12} L${ex[1] + 8},${ey - 22}`,
		disgust: `M${ex[0] - 8},${ey - 14} L${ex[0] + 8},${ey - 20} M${ex[1] - 8},${ey - 16} L${ex[1] + 8},${ey - 16}`,
		sleepy: '',
	};
	const mx = 16 + look;
	const mouth: Record<Expr, React.ReactNode> = {
		neutral: <path d={`M${mx - 7},18 L${mx + 7},18`} {...line} />,
		shock: <ellipse cx={mx} cy={20} rx={8} ry={11} fill={ink} />,
		smug: <path d={`M${mx - 10},16 Q${mx + 2},24 ${mx + 12},12`} {...line} />,
		grin: <path d={`M${mx - 14},12 Q${mx},34 ${mx + 14},12 Z`} fill={ink} stroke={ink} strokeWidth={3} strokeLinejoin="round" />,
		frown: <path d={`M${mx - 10},24 Q${mx},14 ${mx + 10},24`} {...line} />,
		angry: <path d={`M${mx - 10},22 L${mx + 10},22`} {...line} strokeWidth={6} />,
		disgust: <path d={`M${mx - 12},20 Q${mx - 6},14 ${mx},20 Q${mx + 6},26 ${mx + 12},20`} {...line} />,
		sleepy: <path d={`M${mx - 5},18 L${mx + 5},18`} {...line} />,
	};
	return (
		<g>
			{eyes}
			{lashes && !blink ? ex.map((x) => <path key={'l' + x} d={`M${x + 4},${ey - 6} L${x + 11},${ey - 13} M${x - 1},${ey - 7} L${x + 2},${ey - 15}`} {...line} strokeWidth={4} />) : null}
			{brows[expr] ? <path d={brows[expr]} {...line} /> : null}
			{mouth[expr]}
		</g>
	);
};

const HatShape: React.FC<{hat: Hat; x: number; y: number; rot: number; theme: Theme}> = ({hat, x, y, rot, theme}) => {
	if (hat === 'none') return null;
	const s = {stroke: theme.ink, strokeWidth: theme.stroke * 0.5, strokeLinejoin: 'round' as const};
	let el: React.ReactNode = null;
	if (hat === 'tophat')
		el = (
			<g>
				<rect x={-34} y={-22} width={68} height={9} rx={3} fill={theme.ink} />
				<rect x={-21} y={-70} width={42} height={52} rx={4} fill={theme.ink} />
				<rect x={-21} y={-32} width={42} height={8} fill={theme.accent} />
			</g>
		);
	if (hat === 'crown' || hat === 'tiara')
		el = (
			<path
				d={hat === 'crown' ? 'M-24,-18 L-28,-52 L-12,-34 L0,-58 L12,-34 L28,-52 L24,-18 Z' : 'M-22,-20 L-12,-36 L0,-48 L12,-36 L22,-20 Z'}
				fill={theme.gold}
				{...s}
			/>
		);
	if (hat === 'cap')
		el = (
			<g>
				<path d="M-26,-14 Q0,-50 26,-14 Z" fill={theme.accent2} {...s} />
				<path d="M10,-16 L44,-12 L10,-10 Z" fill={theme.accent2} {...s} />
			</g>
		);
	if (hat === 'bandana')
		el = (
			<g>
				<path d="M-26,-8 Q0,-34 26,-8 L26,-2 Q0,-26 -26,-2 Z" fill={theme.accent} />
				<path d="M-24,-6 L-44,6 L-36,-10 Z" fill={theme.accent} />
			</g>
		);
	if (hat === 'mitre') el = <path d="M-20,-18 L-16,-58 L0,-74 L16,-58 L20,-18 Z" fill="#ffffff" {...s} />;
	if (hat === 'doctor')
		el = (
			<g>
				<path d="M-26,-10 L26,-10" stroke={theme.ink} strokeWidth={5} />
				<circle cx={0} cy={-14} r={11} fill="#d8e6f0" {...s} />
			</g>
		);
	if (hat === 'sailor')
		el = (
			<g>
				<path d="M-28,-14 Q0,-44 28,-14 Z" fill="#ffffff" {...s} />
				<rect x={-28} y={-18} width={56} height={7} fill={theme.accent2} />
			</g>
		);
	if (hat === 'helmet')
		el = (
			<g>
				<path d="M-27,-2 Q-27,-38 0,-38 Q27,-38 27,-2 L18,-2 L18,-12 L-8,-12 L-8,-2 Z" fill="#9aa3ad" {...s} />
				<path d="M-6,-38 Q4,-58 22,-52" stroke={theme.accent} strokeWidth={8} fill="none" strokeLinecap="round" />
			</g>
		);
	if (hat === 'laurel')
		el = <g>{[-150, -125, -100, -80, -55, -30].map((a) => <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 24} cy={Math.sin((a * Math.PI) / 180) * 24} rx={7} ry={4} transform={`rotate(${a + 90} ${Math.cos((a * Math.PI) / 180) * 24} ${Math.sin((a * Math.PI) / 180) * 24})`} fill="#5f9e3f" />)}</g>;
	if (hat === 'nemes')
		el = (
			<g>
				<path d="M-24,-12 Q-26,-30 0,-30 Q24,-30 22,-12 L26,22 L12,22 L12,-6 L-14,-6 L-20,30 L-34,30 Z" fill="#e8c34a" {...s} />
				{[-22, -14, -6].map((y) => <path key={y} d={`M-26,${y + 30} L-18,${y + 30}`} stroke="#2f5fa8" strokeWidth={4} />)}
			</g>
		);
	if (hat === 'veil') el = <path d="M-26,-8 Q-28,-30 0,-30 Q28,-30 24,-8 Q10,-20 -6,-18 Q-24,-14 -34,30 L-44,28 Q-36,0 -26,-8 Z" fill={theme.accent2} {...s} />;
	if (hat === 'chef') el = <path d="M-20,-14 L-20,-34 Q-34,-40 -24,-54 Q-14,-66 0,-58 Q14,-66 24,-54 Q34,-40 20,-34 L20,-14 Z" fill="#ffffff" {...s} />;
	return <g transform={`translate(${x},${y}) rotate(${rot}) scale(${L.head / 25})`}>{el}</g>;
};
