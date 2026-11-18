import {Pose} from './Stickman';

// Procedural actions: each returns a pose for a local time t (seconds).
const S = Math.sin;
const base: Pose = {
	dx: 0, dy: 0, torso: 0, head: 0,
	lArm: -14, lFore: -8, rArm: 14, rFore: 8,
	lLeg: -9, lShin: -9, rLeg: 9, rShin: 9,
	sx: 1, sy: 1,
};
const P = (o: Partial<Pose>): Pose => ({...base, ...o});

export type ActionName =
	| 'idle' | 'talk' | 'sassy' | 'point' | 'pointUp' | 'shock' | 'run' | 'walk' | 'chew' | 'disgust'
	| 'facepalm' | 'shrug' | 'celebrate' | 'craft' | 'wave' | 'slam' | 'brush' | 'sad' | 'eat'
	| 'present' | 'write' | 'laugh' | 'sneak' | 'jump' | 'sit' | 'scared' | 'flex' | 'drink';

export const ACTIONS: Record<ActionName, (t: number) => Pose> = {
	idle: (t) => P({torso: 2 * S(t * 2), dy: 2 * S(t * 4), lArm: -14 + 3 * S(t * 2), rArm: 14 - 3 * S(t * 2)}),
	// narrator default: hand on hip + gesturing arm
	talk: (t) => P({
		torso: 4 + 3 * S(t * 3), head: 6 * S(t * 5),
		lArm: -48, lFore: 42,
		rArm: 80 + 30 * S(t * 7), rFore: 120 + 35 * S(t * 7 + 0.6),
		dy: 3 * S(t * 7),
	}),
	sassy: (t) => P({
		torso: -6, head: -12 + 8 * S(t * 6),
		lArm: -48, lFore: 42,
		rArm: 150, rFore: 165 + 18 * S(t * 14), // finger wag
		lLeg: -14, rLeg: 16, rShin: 4,
		dx: 6 * S(t * 3),
	}),
	point: (t) => P({torso: 6, head: 4, lArm: -48, lFore: 42, rArm: 96 + 2 * S(t * 6), rFore: 92 + 2 * S(t * 6), rLeg: 18, rShin: 12, lLeg: -12}),
	pointUp: (t) => P({torso: -4, head: -18, lArm: -48, lFore: 42, rArm: 160 + 3 * S(t * 8), rFore: 175, dy: -3 * Math.abs(S(t * 6))}),
	shock: (t) => {
		const hop = Math.max(0, S(Math.min(t, 0.5) * Math.PI * 2)) * 40;
		return P({
			torso: -14, head: -16,
			lArm: -140 + 6 * S(t * 30), lFore: -175, rArm: 140 - 6 * S(t * 30), rFore: 175,
			lLeg: -28, lShin: -12, rLeg: 24, rShin: 8,
			dy: -hop, dx: -6 * S(t * 40) * (t < 0.6 ? 1 : 0.2),
			sy: t < 0.1 ? 0.85 : 1, sx: t < 0.1 ? 1.12 : 1,
		});
	},
	run: (t) => {
		const p = t * 14;
		return P({
			torso: 18, head: 6,
			lLeg: 42 * S(p), lShin: 42 * S(p) - 40 - 25 * Math.max(0, -Math.cos(p)),
			rLeg: -42 * S(p), rShin: -42 * S(p) - 40 - 25 * Math.max(0, Math.cos(p)),
			lArm: -50 * S(p), lFore: -50 * S(p) + 90, rArm: 50 * S(p), rFore: 50 * S(p) + 90,
			dy: -10 * Math.abs(S(p)),
		});
	},
	walk: (t) => {
		const p = t * 8;
		return P({
			torso: 4,
			lLeg: 24 * S(p), lShin: 24 * S(p) - 12 * Math.max(0, -Math.cos(p)),
			rLeg: -24 * S(p), rShin: -24 * S(p) - 12 * Math.max(0, Math.cos(p)),
			lArm: -22 * S(p), lFore: -22 * S(p) + 20, rArm: 22 * S(p), rFore: 22 * S(p) + 20,
			dy: -4 * Math.abs(S(p)),
		});
	},
	chew: (t) => P({torso: 3, head: 6 * S(t * 18), rArm: 125, rFore: -92 + 6 * S(t * 18), lArm: -20, lFore: -10}),
	eat: (t) => P({torso: 10, head: 10 + 8 * S(t * 16), rArm: 120 + 10 * S(t * 8), rFore: -95, lArm: 60, lFore: 100, dy: 2 * S(t * 16)}),
	disgust: (t) => P({
		torso: -18, head: -22 + 4 * S(t * 20),
		rArm: 75, rFore: 128, lArm: 55, lFore: 100,
		lLeg: -26, lShin: -14, rLeg: 6, rShin: 2,
		dx: -4 * S(t * 25),
	}),
	facepalm: (t) => P({torso: 10, head: 22 + 4 * S(t * 3), rArm: 150, rFore: -62, lArm: -30, lFore: -10, dy: 2 * S(t * 3)}),
	shrug: (t) => {
		const k = 0.5 + 0.5 * S(t * 5);
		return P({torso: -2, head: 14 * S(t * 2.5), lArm: -62 - 6 * k, lFore: -140, rArm: 62 + 6 * k, rFore: 140, dy: -4 * k});
	},
	celebrate: (t) => {
		const j = Math.abs(S(t * 7));
		return P({
			torso: -4, head: -10,
			lArm: -150 - 12 * S(t * 14), lFore: -170, rArm: 150 + 12 * S(t * 14), rFore: 170,
			lLeg: -20 * j - 6, lShin: -6, rLeg: 20 * j + 6, rShin: 6,
			dy: -36 * j, sy: 1 + 0.06 * j,
		});
	},
	craft: (t) => P({
		torso: 32, head: 26,
		rArm: 60 + 26 * S(t * 16), rFore: 115 + 20 * S(t * 16),
		lArm: 48, lFore: 92,
		lLeg: -4, lShin: 20, rLeg: 30, rShin: -10, dy: 8,
	}),
	wave: (t) => P({lArm: -48, lFore: 42, rArm: 140, rFore: 170 + 25 * S(t * 12), head: -8}),
	slam: (t) => {
		const k = Math.min(1, t / 0.25);
		const up = k < 1 ? 160 - 120 * (k * k) : 40;
		return P({
			torso: 10 + 20 * k, head: 10,
			rArm: up + 30, rFore: up + 50, lArm: up, lFore: up + 20,
			lLeg: -26, lShin: -10, rLeg: 26, rShin: 10,
			dy: k >= 1 ? 12 : -10, sy: k >= 1 && t < 0.35 ? 0.88 : 1, sx: k >= 1 && t < 0.35 ? 1.08 : 1,
		});
	},
	brush: (t) => P({torso: 2, head: -4 + 3 * S(t * 30), rArm: 112, rFore: -88 + 16 * S(t * 30), lArm: -48, lFore: 42}),
	sad: (t) => P({torso: 16, head: 30, lArm: -4, lFore: 0, rArm: 4, rFore: 0, dy: 6 + 2 * S(t * 2)}),
	present: (t) => P({torso: 2, head: -6, lArm: -100, lFore: -120, rArm: 100 + 4 * S(t * 4), rFore: 120 + 4 * S(t * 4), dy: -2 * Math.abs(S(t * 4))}),
	write: (t) => P({torso: 22, head: 26, rArm: 50, rFore: 105 + 12 * S(t * 20), lArm: 40, lFore: 92, dx: 3 * S(t * 10)}),
	laugh: (t) => P({torso: -10 + 8 * S(t * 18), head: -26 + 10 * S(t * 18), lArm: -40, lFore: 50, rArm: 40, rFore: -50, dy: 4 * S(t * 18)}),
	sneak: (t) => {
		const p = t * 6;
		return P({torso: 26, head: 10, lArm: 70, lFore: 150, rArm: 40, rFore: 150, lLeg: 30 * S(p), lShin: 30 * S(p) - 30, rLeg: -30 * S(p), rShin: -30 * S(p) - 30, dy: 16});
	},
	jump: (t) => {
		const j = Math.abs(S(t * 5));
		return P({lArm: -120, lFore: -160, rArm: 120, rFore: 160, lLeg: -30, lShin: 10, rLeg: 30, rShin: -10, dy: -70 * j});
	},
	sit: (t) => P({torso: 4 + 2 * S(t * 2), lLeg: 88, lShin: 2, rLeg: 92, rShin: 4, dy: 52, lArm: 30, lFore: 90, rArm: 36, rFore: 92}),
	scared: (t) => P({torso: -10, head: -10, lArm: 150, lFore: -60, rArm: 160, rFore: -70, lLeg: -16, rLeg: 16, dx: 5 * S(t * 60), sy: 0.95}),
	flex: (t) => P({lArm: -95, lFore: -175 + 6 * S(t * 8), rArm: 95, rFore: 175 - 6 * S(t * 8), torso: -4, head: -8, lLeg: -20, rLeg: 20, dy: -2 * Math.abs(S(t * 8))}),
	drink: (t) => P({torso: -10, head: -30, rArm: 135, rFore: -80, lArm: -48, lFore: 42, dy: 2 * S(t * 10)}),
};
