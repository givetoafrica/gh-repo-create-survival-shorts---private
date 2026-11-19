import React from 'react';
import {Caption} from '../types';

// Mouth shape from word timings (no audio analysis needed, so it works anywhere).
// Each word is split into rough syllables; the mouth opens and closes once per syllable.
export type Viseme = {open: number; round: boolean; wide: boolean};
export const CLOSED: Viseme = {open: 0, round: false, wide: false};

const syllables = (w: string) => {
	const m = w.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g);
	return Math.max(1, m ? m.length : 1);
};

export const visemeAt = (caps: Caption[], ms: number): Viseme => {
	// binary search would be nicer; captions are ~150 words, linear is fine
	for (const c of caps) {
		if (ms < c.startMs - 30) break;
		if (ms > c.endMs) continue;
		const n = syllables(c.text);
		const p = Math.min(1, Math.max(0, (ms - c.startMs) / Math.max(60, c.endMs - c.startMs)));
		const seg = Math.min(n - 1, Math.floor(p * n));
		const local = p * n - seg;
		const open = Math.sin(Math.PI * Math.min(1, local * 1.15)) * (c.text === c.text.toUpperCase() && c.text.length > 2 ? 1 : 0.8);
		const vowels = (c.text.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g) ?? ['a'])[Math.min(seg, 9)] ?? 'a';
		return {open: Math.max(0, open), round: /^[ou]/.test(vowels), wide: /^[ei]/.test(vowels)};
	}
	return CLOSED;
};

export const MouthContext = React.createContext<Viseme>(CLOSED);
