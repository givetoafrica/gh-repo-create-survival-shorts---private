import {ActionName} from './rig/actions';
import {Hat, Look} from './rig/Stickman';
import {SetName} from './sets/Sets';

export type Caption = {text: string; startMs: number; endMs: number};

export type FigureSpec = {
	id?: string;
	who?: string; // recurring character from src/cast.ts
	look?: Look; // outfit, hair, beard, cape
	x: number; // ground x (0-1080)
	y?: number; // ground y (default 1180)
	scale?: number;
	flip?: boolean; // face left
	from?: number; // x to enter from (runs in)
	enterDur?: number; // seconds
	acts: {t: number; a: ActionName; e?: 'neutral' | 'shock' | 'smug' | 'grin' | 'frown' | 'angry' | 'disgust' | 'sleepy'}[]; // t = seconds after scene start
	color?: string;
	head?: 'hero' | 'ink' | string; // 'hero' = theme accent
	hat?: Hat;
	holding?: string;
	holdingScale?: number;
	holdingRot?: number;
	emotes?: {t: number; e: Emote; dur?: number}[];
	exitAt?: number; // seconds: run off to the right
	talks?: boolean; // lip-syncs the narration (default: first figure in the scene)
};

export type Emote = '!' | '?' | '!!' | 'heart' | 'sweat' | 'anger' | 'dots' | 'sparkle' | 'stars' | 'zzz';

export type PropSpec = {
	name: string;
	x: number;
	y: number;
	scale?: number;
	rot?: number;
	t?: number; // delay in seconds
	enter?: 'pop' | 'drop' | 'slam' | 'slideL' | 'slideR' | 'none';
	idle?: 'wobble' | 'bob' | 'spin' | 'trot' | 'shake' | 'none';
	label?: string;
	color?: string;
	behind?: boolean; // draw behind figures
	exitAt?: number;
};

export type TextSpec = {
	text: string;
	x?: number;
	y?: number;
	size?: number;
	t?: number;
	style?: 'slam' | 'stamp' | 'type' | 'pop';
	color?: 'accent' | 'ink' | 'gold' | string;
	rot?: number;
	sub?: string; // small line under
};

export type PhotoSpec = {
	src: string; // painted realistic shot in public/ (1080x1920)
	heads: {x: number; y: number; r: number; rot?: number; who?: string; talks?: boolean; look?: number}[]; // face circles in screen px
	zoom?: number; // slow push-in, default 0.06
	era?: 'now' | 'sepia' | 'bw'; // flashback film look; default: sepia when nobody on screen talks
	focusX?: number; // push-in centre
	focusY?: number;
};

export type SceneSpec = {
	photo?: PhotoSpec;
	at: string; // phrase in the narration that starts this scene
	lead?: number; // seconds before the word (default 0.12)
	figures?: FigureSpec[];
	props?: PropSpec[];
	texts?: TextSpec[];
	fx?: ('shake' | 'flash' | 'speedlines' | 'punch' | 'rewind' | 'spotlight')[];
	zoom?: number; // slow push-in amount, default 0.05
	set?: SetName; // backdrop
	cam?: 'normal' | 'close' | 'closeLeft' | 'closeRight'; // framing
	sfx?: 'whoosh' | 'pop' | 'thud' | 'ding' | 'none';
	num?: number; // explainer: the countdown number shown in the corner from this scene on (10, 9, ... 1)
};

export type Episode = {
	id: string;
	title: string;
	theme: string;
	voice: string | null; // path in public/, e.g. episodes/toothbrush/voice.mp3
	captions: string; // path in public/
	duck: {at: string; x: number; y: number; dur: number; scale?: number; rot?: number};
	scenes: SceneSpec[];
	tailSec?: number;
	// 'explainer' = narrator voice only: nobody lip-syncs, photos stay in full colour, one big word at a time mid-screen, countdown number in the corner.
	format?: 'host' | 'explainer';
	painted?: Record<string, string>; // filled in at render time: set -> public/bg/<episode>/<set>.jpg or bg/<set>.jpg
};
