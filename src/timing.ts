import {Caption, Episode} from './types';

export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Caption words split into sub-tokens so "sweet-talks" matches "sweet talks".
const tokens = (caps: Caption[]) => caps.flatMap((c, i) => c.text.split(/[-\s]+/).map(norm).filter(Boolean).map((tok) => ({tok, i})));
const phraseToks = (p: string) => p.split(/[-\s]+/).map(norm).filter(Boolean);

// Find where each scene's anchor phrase is spoken. Scenes must be listed in script order.
export const resolveSceneStarts = (ep: Episode, caps: Caption[]): number[] => {
	const toks = tokens(caps);
	let cursor = 0;
	return ep.scenes.map((sc, i) => {
		if (i === 0) return 0;
		const want = phraseToks(sc.at);
		for (let w = cursor; w < toks.length; w++) {
			if (want.every((t, k) => toks[w + k]?.tok === t)) {
				cursor = w + 1;
				return Math.max(0, caps[toks[w].i].startMs / 1000 - (sc.lead ?? 0.12));
			}
		}
		throw new Error(`Scene ${i}: anchor phrase "${sc.at}" not found in narration after token ${cursor}`);
	});
};

export const findWordTime = (caps: Caption[], phrase: string): number => {
	const toks = tokens(caps);
	const want = phraseToks(phrase);
	for (let w = 0; w < toks.length; w++) if (want.every((t, k) => toks[w + k]?.tok === t)) return caps[toks[w].i].startMs / 1000;
	throw new Error(`phrase "${phrase}" not found`);
};

export type Page = {words: Caption[]; start: number; end: number};

// Group words into short punchy caption pages (1-3 words).
export const buildPages = (caps: Caption[]): Page[] => {
	const pages: Page[] = [];
	let cur: Caption[] = [];
	const flush = () => {
		if (cur.length) pages.push({words: cur, start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000});
		cur = [];
	};
	caps.forEach((c, i) => {
		const prev = caps[i - 1];
		if (cur.length && prev && c.startMs - prev.endMs > 350) flush();
		cur.push(c);
		const chars = cur.map((w) => w.text).join(' ').length;
		if (/[.?!,:]$|\.\.\.$/.test(c.text) || cur.length >= 2 || chars > 11) flush();
	});
	flush();
	// hold each page until the next one starts (small gaps feel jumpy)
	for (let i = 0; i < pages.length - 1; i++) {
		if (pages[i + 1].start - pages[i].end < 0.6) pages[i].end = pages[i + 1].start;
		else pages[i].end += 0.25;
	}
	return pages;
};
