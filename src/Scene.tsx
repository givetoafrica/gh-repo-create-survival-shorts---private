import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, random, staticFile} from 'remotion';
import {ACTIONS} from './rig/actions';
import {Expr, lerpPose, Stickman} from './rig/Stickman';

const ACT_EXPR: Record<string, Expr> = {
	shock: 'shock', scared: 'shock', jump: 'shock', sassy: 'smug', point: 'smug', pointUp: 'neutral', talk: 'smug', disgust: 'disgust',
	facepalm: 'frown', sad: 'frown', celebrate: 'grin', laugh: 'grin', flex: 'grin', present: 'grin', wave: 'grin', slam: 'angry',
	chew: 'neutral', eat: 'grin', craft: 'neutral', sit: 'sleepy', sneak: 'smug', write: 'angry', shrug: 'smug', brush: 'neutral', drink: 'grin',
};
import {Prop} from './props/Props';
import {CartoonHead} from './rig/CartoonHead';
import {withCast, CAST_HEADS} from './cast';
import {Theme} from './themes';
import {LightPool, SetBackdrop, tone} from './sets/Sets';
import {Emote, FigureSpec, PropSpec, SceneSpec, TextSpec, PhotoSpec} from './types';

const GROUND = 1180;

const Figure: React.FC<{f: FigureSpec; theme: Theme; t: number; fps: number; crowd?: number; order?: number}> = ({f: f0, theme, t, fps, crowd = 1, order = 0}) => {
	const f = withCast(f0);
	const acts = [...f.acts].sort((a, b) => a.t - b.t);
	let idx = 0;
	for (let i = 0; i < acts.length; i++) if (acts[i].t <= t) idx = i;
	const cur = acts[idx];
	let pose = ACTIONS[cur.a](t - cur.t);
	const blend = 0.14;
	if (idx > 0 && t - cur.t < blend) {
		const prev = acts[idx - 1];
		pose = lerpPose(ACTIONS[prev.a](t - prev.t), pose, (t - cur.t) / blend);
	}
	let x = 540 + (f.x - 540) * (crowd <= 1 ? 0.55 : 0.82); // big figures: pull toward centre so they stay in frame
	const enterDur = f.enterDur ?? 0.45;
	if (f.from !== undefined) {
		const k = spring({frame: t * fps, fps, durationInFrames: enterDur * fps, config: {damping: 16}});
		x = f.from + (f.x - f.from) * k;
	}
	if (f.exitAt !== undefined && t > f.exitAt) {
		const k = (t - f.exitAt) / 0.5;
		x = f.x + k * k * 900 * (f.flip ? -1 : 1);
		pose = ACTIONS.run(t);
	}
	// reference fills 65-90% of the frame with one character: solo figures go big, crowds shrink to fit
	const s = (f.scale ?? 1) * (crowd <= 1 ? 1.75 : crowd === 2 ? 1.45 : 1.3);
	const expr: Expr = (cur as any).e ?? ACT_EXPR[cur.a] ?? 'neutral';
	const blinkT = (t * 1000 + (f.x * 7) % 1700) % 2900;
	const blink = blinkT < 110;
	const y = f.y ?? GROUND;
	const isHero = f.head === 'hero';
	const headColor = isHero || f.head === 'ink' || !f.head ? undefined : f.head;
	const bodyColor = f.color ?? (isHero ? theme.accent : undefined);
	return (
		<g transform={`translate(${x},${y})`}>
			<g transform={`scale(${s * (f.flip ? -1 : 1)},${s})`}>
				<Stickman pose={pose} theme={theme} color={bodyColor} headColor={headColor} hat={f.hat} holding={f.holding} holdingScale={f.holdingScale} holdingRot={f.holdingRot} expr={expr} blink={blink} look={f.look} talking={f.talks ?? order === 0} />
			</g>
			{(f.emotes ?? []).map((e, i) => {
				const lt = t - e.t;
				if (lt < 0 || lt > (e.dur ?? 1.2)) return null;
				const k = spring({frame: lt * fps, fps, config: {damping: 9, stiffness: 180}});
				return (
					<g key={i} transform={`translate(${(f.flip ? -40 : 40) * s},${-560 * s}) scale(${k * s})`}>
						<EmoteShape e={e.e} theme={theme} t={lt} />
					</g>
				);
			})}
		</g>
	);
};

const EmoteShape: React.FC<{e: Emote; theme: Theme; t: number}> = ({e, theme, t}) => {
	const font = {fontFamily: theme.textFont, textAnchor: 'middle' as const};
	if (e === '!' || e === '!!' || e === '?')
		return (
			<text {...font} y={20} fontSize={110} fill={theme.accent} stroke={theme.bg} strokeWidth={6} paintOrder="stroke">
				{e}
			</text>
		);
	if (e === 'heart')
		return <path d="M0,30 C-60,-10 -40,-60 0,-30 C40,-60 60,-10 0,30 Z" fill={theme.accent} transform={`translate(0,${-t * 30}) scale(1.4)`} />;
	if (e === 'sweat')
		return <path d="M40,-20 Q20,10 40,20 Q60,10 40,-20 Z" fill="#6EC6FF" stroke={theme.ink} strokeWidth={3} transform={`translate(0,${t * 40}) scale(1.6)`} />;
	if (e === 'anger')
		return (
			<g stroke={theme.accent} strokeWidth={10} strokeLinecap="round">
				<path d="M-30,-10 Q-10,-10 -10,-30 M30,-10 Q10,-10 10,-30 M-30,10 Q-10,10 -10,30 M30,10 Q10,10 10,30" fill="none" />
			</g>
		);
	if (e === 'dots')
		return (
			<g>
				{[0, 1, 2].map((i) => (
					<circle key={i} cx={-40 + i * 40} cy={0} r={10} fill={theme.ink} opacity={t * 3 > i ? 1 : 0} />
				))}
			</g>
		);
	if (e === 'zzz')
		return (
			<text {...font} fontSize={70} fill={theme.ink} transform={`translate(0,${-t * 30})`}>
				z z
			</text>
		);
	// sparkle / stars
	return (
		<g transform={`rotate(${t * 90})`}>
			{[0, 1, 2, 3].map((i) => (
				<path key={i} d="M0,-50 L10,-10 L50,0 L10,10 L0,50 L-10,10 L-50,0 L-10,-10 Z" fill={theme.gold} transform={`translate(${[-60, 60, -30, 40][i]},${[-20, 10, 40, -50][i]}) scale(${0.4 + 0.15 * i})`} />
			))}
		</g>
	);
};

const PropEl: React.FC<{p: PropSpec; theme: Theme; t: number; fps: number}> = ({p, theme, t, fps}) => {
	const lt = t - (p.t ?? 0);
	if (lt < 0) return null;
	const PROP_SCALE = 1.65; // props sized to match the bold figures
	let x = 540 + (p.x - 540) * 0.88, sc = (p.scale ?? 1) * PROP_SCALE, rot = p.rot ?? 0, op = 1;
	// jail bars always stand on the ground
	let y = p.name === 'bars' ? GROUND - 260 * sc : p.y;
	const k = spring({frame: lt * fps, fps, config: {damping: 11, stiffness: 160}});
	switch (p.enter ?? 'pop') {
		case 'pop': sc *= k; break;
		case 'drop': y = y - (1 - k) * 1400; break;
		case 'slam': sc *= interpolate(lt, [0, 0.12], [2.4, 1], {extrapolateRight: 'clamp'}); op = interpolate(lt, [0, 0.06], [0, 1], {extrapolateRight: 'clamp'}); break;
		case 'slideL': x = p.x - (1 - k) * 1100; break;
		case 'slideR': x = p.x + (1 - k) * 1100; break;
	}
	switch (p.idle ?? 'wobble') {
		case 'wobble': rot += 4 * Math.sin(lt * 4); break;
		case 'bob': y += 10 * Math.sin(lt * 3); break;
		case 'spin': rot += lt * 120; break;
		case 'trot': y -= 14 * Math.abs(Math.sin(lt * 12)); rot += 3 * Math.sin(lt * 12); break;
		case 'shake': x += 6 * Math.sin(lt * 50); break;
	}
	if (p.exitAt !== undefined && t > p.exitAt) {
		const e = (t - p.exitAt) / 0.4;
		x += e * e * 1200;
	}
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${sc})`} opacity={op}>
			<Prop name={p.name} theme={theme} label={p.label} color={p.color} />
		</g>
	);
};

const BigText: React.FC<{tx: TextSpec; theme: Theme; t: number; fps: number}> = ({tx, theme, t, fps}) => {
	const lt = t - (tx.t ?? 0);
	if (lt < 0) return null;
	const style = tx.style ?? 'slam';
	let sc = 1, op = 1, rot = tx.rot ?? 0, shown = tx.text;
	if (style === 'slam') {
		sc = interpolate(lt, [0, 0.13], [3, 1], {extrapolateRight: 'clamp'});
		op = interpolate(lt, [0, 0.05], [0, 1], {extrapolateRight: 'clamp'});
	} else if (style === 'stamp') {
		sc = interpolate(lt, [0, 0.1], [1.7, 1], {extrapolateRight: 'clamp'});
		rot = (tx.rot ?? -8) + interpolate(lt, [0, 0.1], [-10, 0], {extrapolateRight: 'clamp'});
		op = interpolate(lt, [0, 0.06], [0, 1], {extrapolateRight: 'clamp'});
	} else if (style === 'pop') {
		sc = spring({frame: lt * fps, fps, config: {damping: 9, stiffness: 200}});
	} else if (style === 'type') {
		shown = tx.text.slice(0, Math.floor(lt * 22));
	}
	const color = tx.color === 'ink' ? theme.ink : tx.color === 'gold' ? theme.gold : !tx.color || tx.color === 'accent' ? theme.accent : tx.color;
	const size = tx.size ?? 190;
	return (
		<g transform={`translate(${tx.x ?? 540},${Math.min((tx.y ?? 520) * 0.3 + 10, 150)}) rotate(${rot}) scale(${sc})`} opacity={op}>
			{style === 'stamp' ? (
				<rect x={-(shown.length * size * 0.33) - 30} y={-size * 0.85} width={shown.length * size * 0.66 + 60} height={size * 1.08} rx={18} fill="none" stroke={color} strokeWidth={12} />
			) : null}
			<text textAnchor="middle" fontFamily={theme.textFont} fontSize={size} fill={color} stroke={theme.name === 'notebook' ? 'none' : color === theme.ink ? theme.bg : theme.ink} strokeWidth={theme.name === 'night' ? 0 : 10} paintOrder="stroke" style={theme.glow ? {filter: `drop-shadow(0 0 18px ${color})`} : undefined}>
				{shown}
			</text>
			{tx.sub ? (
				<text textAnchor="middle" y={size * 0.5} fontFamily={theme.textFont} fontSize={size * 0.32} fill={theme.ink}>
					{tx.sub}
				</text>
			) : null}
		</g>
	);
};

const SpeedLines: React.FC<{theme: Theme; frame: number}> = ({theme, frame}) => (
	<g opacity={0.35}>
		{new Array(28).fill(0).map((_, i) => {
			const a = (i / 28) * Math.PI * 2 + random(`a${i}${Math.floor(frame / 2)}`) * 0.2;
			const r1 = 520 + random(`r${i}${Math.floor(frame / 2)}`) * 200;
			return (
				<path key={i} d={`M${540 + Math.cos(a) * r1},${900 + Math.sin(a) * r1} L${540 + Math.cos(a) * 1300},${900 + Math.sin(a) * 1300}`} stroke={theme.ink} strokeWidth={6 + (i % 3) * 4} strokeLinecap="round" />
			);
		})}
	</g>
);

export const Scene: React.FC<{spec: SceneSpec; theme: Theme; dur: number; painted?: Record<string, string>}> = ({spec, theme, dur, painted}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const fx = spec.fx ?? [];
	const zoom = 1 + (spec.zoom ?? 0.05) * Math.min(1, t / Math.max(dur, 0.1));
	const punch = fx.includes('punch') ? interpolate(frame, [0, 8], [1.14, 1], {extrapolateRight: 'clamp'}) : 1;
	const shakeAmt = fx.includes('shake') ? interpolate(frame, [0, 12], [22, 0], {extrapolateRight: 'clamp'}) : 0;
	const sx = (random(`sx${frame}`) - 0.5) * shakeAmt;
	const sy = (random(`sy${frame}`) - 0.5) * shakeAmt;
	const flash = fx.includes('flash') ? interpolate(frame, [0, 5], [0.85, 0], {extrapolateRight: 'clamp'}) : 0;
	const props = spec.props ?? [];
	const cam = spec.cam ?? 'normal';
	const camZ = cam === 'normal' ? 1 : 1.1; // figures are already big: close-ups only nudge in
	const camX = cam === 'closeLeft' ? 330 : cam === 'closeRight' ? 750 : 540;
	const camY = cam === 'normal' ? 900 : 780;
	return (
		<>
			{spec.photo ? <PhotoShot p={spec.photo} t={t} dur={dur} punch={punch} sx={sx} sy={sy} /> : null}
			<g transform={`translate(${540 + sx},${1100 + sy}) scale(${zoom * punch * camZ}) translate(${-camX},${-camY})`}>
				{spec.photo ? null : spec.set && spec.set !== 'none' && painted?.[spec.set] ? (
					<>
						{/* AI-painted backdrop, 1080x1920 with the floor line ~72% down; drawn 20% oversize so push-ins never show an edge */}
						<image href={staticFile(painted![spec.set!])} x={-108} y={-332} width={1296} height={2304} preserveAspectRatio="xMidYMid slice" />
						{theme.name === 'night' ? <rect x={-300} y={-600} width={1700} height={2800} fill="#05060a" opacity={0.42} /> : null}
						{theme.name === 'notebook' ? <rect x={-300} y={-600} width={1700} height={2800} fill="#fbf8ef" opacity={0.3} /> : null}
					</>
				) : spec.set && spec.set !== 'none' ? (
					<>
						<SetBackdrop name={spec.set} theme={theme} />
						<rect x={-300} y={GROUND} width={1700} height={900} fill={tone(theme, theme.name === 'night' ? '#3a3a48' : '#b9a58a')} />
						<path d={`M-300,${GROUND} L1400,${GROUND}`} stroke={theme.ground} strokeWidth={7} />
					</>
				) : null}
				{spec.photo ? null : <LightPool theme={theme} />}
				{fx.includes('speedlines') ? <SpeedLines theme={theme} frame={frame} /> : null}
				{fx.includes('spotlight') ? <ellipse cx={540} cy={1000} rx={360} ry={420} fill={theme.glow ? '#2A2D3A' : '#FFF6D6'} opacity={0.8} /> : null}
				{props.filter((p) => p.behind).map((p, i) => <PropEl key={`b${i}`} p={p} theme={theme} t={t} fps={fps} />)}
				{(spec.photo ? [] : spec.figures ?? []).map((f, i) => <Figure key={i} f={f} theme={theme} t={t} fps={fps} crowd={(spec.figures ?? []).length} order={i} />)}
				{props.filter((p) => !p.behind).map((p, i) => <PropEl key={`f${i}`} p={p} theme={theme} t={t} fps={fps} />)}
				{(spec.texts ?? []).map((tx, i) => <BigText key={i} tx={tx} theme={theme} t={t} fps={fps} />)}
			</g>
			{fx.includes('rewind') ? (
				<g opacity={interpolate(frame, [0, 6, 22, 30], [0, 1, 1, 0], {extrapolateRight: 'clamp'})}>
					{new Array(12).fill(0).map((_, i) => (
						<rect key={i} x={0} y={((i * 160 + frame * 40) % 1920)} width={1080} height={10} fill={theme.ink} opacity={0.12} />
					))}
					<text x={120} y={300} fontFamily={theme.textFont} fontSize={90} fill={theme.accent}>◀◀</text>
				</g>
			) : null}
			{flash > 0 ? <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={flash} /> : null}
		</>
	);
};

const PhotoShot: React.FC<{p: PhotoSpec; t: number; dur: number; punch: number; sx: number; sy: number}> = ({p, t, dur, punch, sx, sy}) => {
	const z = (1 + (p.zoom ?? 0.06) * Math.min(1, t / Math.max(dur, 0.1))) * punch;
	const fxp = p.focusX ?? 540;
	const fyp = p.focusY ?? 800;
	return (
		<g transform={`translate(${fxp + sx},${fyp + sy}) scale(${z}) translate(${-fxp},${-fyp})`}>
			<image href={staticFile(p.src)} x={0} y={0} width={1080} height={1920} preserveAspectRatio="xMidYMid slice" />
			{p.heads.map((h, i) => {
				const st = h.who ? CAST_HEADS[h.who] : undefined;
				const blinkT = (t * 1000 + i * 1300) % 3100;
				const bob = Math.sin(t * 2.2 + i) * 3;
				return <CartoonHead key={i} x={h.x} y={h.y + bob} r={h.r} rot={(h.rot ?? 0) + Math.sin(t * 1.7 + i) * 2} style={st} talking={h.talks ?? i === 0} blink={blinkT < 120} look={h.look ?? 0} />;
			})}
		</g>
	);
};
