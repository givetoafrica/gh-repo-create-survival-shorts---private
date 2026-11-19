import {FigureSpec} from './types';

// The recurring cast. Each character is defined ONCE here; episodes just say {"who": "queen"}.
// Same file in, same character out, in every video. Men: knee tunic, legs showing, short hair/beard.
// Women: long A-line dress, long hair/bun/veil, eyelashes.
export const CAST: Record<string, Partial<FigureSpec>> = {
	hero: {head: 'hero', look: {hair: 'short'}},
	king: {color: '#B3261E', hat: 'crown', look: {outfit: 'robe', cape: '#6A1B9A', beard: 'beard', hair: 'short', hairColor: '#5a3a1a'}},
	queen: {color: '#7B3FB0', hat: 'crown', look: {outfit: 'gown', cape: '#B3261E', hair: 'long', hairColor: '#3a2614', lashes: true}},
	princess: {color: '#E86FA6', hat: 'tiara', look: {outfit: 'gown', hair: 'long', hairColor: '#d9a441', lashes: true}},
	roman: {color: '#F2EEE3', hat: 'laurel', look: {outfit: 'toga', trim: '#B3261E', hair: 'short', hairColor: '#2b2b2b'}},
	romanWoman: {color: '#7FA7D9', look: {outfit: 'dress', hair: 'bun', hairColor: '#2b2b2b', lashes: true}},
	pharaoh: {color: '#F2EEE3', hat: 'nemes', look: {outfit: 'tunic', trim: '#E8C34A'}},
	egyptianWoman: {color: '#F2EEE3', look: {outfit: 'dress', hair: 'long', hairColor: '#111111', lashes: true}},
	soldier: {color: '#B3261E', hat: 'helmet', look: {outfit: 'armor', beard: 'moustache', hairColor: '#3a2614'}},
	peasant: {color: '#8B6B4A', look: {outfit: 'tunic', trim: '#5a3a1a', hair: 'short', beard: 'beard', hairColor: '#6b4423'}},
	peasantWoman: {color: '#5E8C4A', look: {outfit: 'dress', hair: 'braids', hairColor: '#8a4b20', lashes: true}},
	monk: {color: '#6B4A2E', look: {outfit: 'robe', trim: '#3a2614', hair: 'none', beard: 'beard', hairColor: '#9a9a9a'}},
	nun: {color: '#2b2b2b', hat: 'veil', look: {outfit: 'robe', trim: '#ffffff', lashes: true}},
	doctor: {color: '#2b2b2b', hat: 'tophat', look: {outfit: 'suit', beard: 'moustache', hairColor: '#3a2614'}},
	cook: {color: '#C9A27A', hat: 'chef', look: {outfit: 'apron', beard: 'moustache'}},
	caveman: {color: '#A0703C', look: {outfit: 'tunic', trim: '#6b4423', hair: 'curly', beard: 'beard', hairColor: '#3a2614'}},
	cavewoman: {color: '#A0703C', look: {outfit: 'dress', trim: '#6b4423', hair: 'long', hairColor: '#5a3a1a', lashes: true}},
	gentleman: {color: '#2F4F6F', hat: 'tophat', look: {outfit: 'suit', hairColor: '#3a2614'}},
	jailer: {color: '#4A4A4A', hat: 'cap', look: {outfit: 'tunic', trim: '#2b2b2b', beard: 'beard', hairColor: '#2b2b2b'}},
	noble: {color: '#2E7D5B', look: {outfit: 'tunic', cape: '#B3261E', hair: 'short', beard: 'moustache', hairColor: '#3a2614'}},
	bishop: {color: '#F2EEE3', hat: 'mitre', look: {outfit: 'robe', trim: '#E8C34A', beard: 'beard', hairColor: '#bdbdbd'}},
	sailor: {color: '#2F5FA8', hat: 'sailor', look: {outfit: 'tunic', trim: '#ffffff', beard: 'beard', hairColor: '#6b4423'}},
	medic: {color: '#2b2b2b', hat: 'doctor', look: {outfit: 'suit', hair: 'short', beard: 'moustache', hairColor: '#5a3a1a'}},
	lady: {color: '#2F6F9F', look: {outfit: 'gown', trim: '#ffffff', hair: 'bun', hairColor: '#8a4b20', lashes: true}},
};

export const withCast = (f: FigureSpec): FigureSpec => {
	const base = f.who ? CAST[f.who] : undefined;
	if (!base) return f;
	return {...base, ...f, look: {...(base.look ?? {}), ...(f.look ?? {})}} as FigureSpec;
};

// Cartoon heads for "photo" scenes (cartoon head on a painted realistic body). One entry per character.
import type {HeadStyle} from './rig/CartoonHead';
export const CAST_HEADS: Record<string, HeadStyle> = {
	host: {skin: '#F6D2B0', hair: '#C0392B', hairStyle: 'bun', lashes: true, brow: 1},
	caveman: {skin: '#E8B48A', hair: '#3a2614', hairStyle: 'wild', beard: 'full'},
	cavewoman: {skin: '#E8B48A', hair: '#5a3a1a', hairStyle: 'long', lashes: true},
	gentleman: {skin: '#F3D0B0', hair: '#3a2614', hairStyle: 'short', beard: 'moustache'},
	jailer: {skin: '#E9BE98', hair: '#2b2b2b', hairStyle: 'short', beard: 'stubble', brow: -1},
	galileoLike: {skin: '#F1C9A5', hair: '#9a9a9a', hairStyle: 'wild', beard: 'full'},
};
CAST_HEADS.ming = {skin: '#EFC79E', hair: '#151515', hairStyle: 'bun', beard: 'moustache'};
CAST_HEADS.addis = {skin: '#F3D0B0', hair: '#E8E4DA', hairStyle: 'short', brow: 1};
CAST_HEADS.chemist = {skin: '#F1CDA8', hair: '#8f8f8f', hairStyle: 'short', beard: 'moustache'};
CAST_HEADS.teddy = {skin: '#F1C6A0', hair: '#6b4423', hairStyle: 'short', beard: 'moustache', glasses: 'pince-nez', brow: 1};
CAST_HEADS.schrank = {skin: '#E8C2A0', hair: '#2b2b2b', hairStyle: 'short', beard: 'stubble', brow: -1};
CAST_HEADS.doctor1912 = {skin: '#F1CDA8', hair: '#bdbdbd', hairStyle: 'short', beard: 'full', glasses: 'round'};
// Ancient Rome (10 weird things about the Romans)
CAST_HEADS.romanMan = {skin: '#E9BC93', hair: '#2b2b2b', hairStyle: 'short'};
CAST_HEADS.romanMan2 = {skin: '#D9A578', hair: '#3a2614', hairStyle: 'short', beard: 'stubble'};
CAST_HEADS.romanWoman = {skin: '#F0C8A2', hair: '#3a2614', hairStyle: 'bun', lashes: true};
CAST_HEADS.romanCook = {skin: '#E2B088', hair: '#5a3a1a', hairStyle: 'short', beard: 'full'};
CAST_HEADS.bather = {skin: '#DDA77C', hair: '#2b2b2b', hairStyle: 'short', beard: 'stubble', brow: 1};
CAST_HEADS.fuller = {skin: '#D79F72', hair: '#4a3020', hairStyle: 'wild', brow: -1};
CAST_HEADS.vespasian = {skin: '#EDC09A', hair: '#8f8f8f', hairStyle: 'none', brow: 1};
CAST_HEADS.poet = {skin: '#EFC6A0', hair: '#3a2614', hairStyle: 'wild', beard: 'full'};
// Romans v3: the ONE bewildered Roman who appears in every scene (moods escalate per scene).
CAST_HEADS.romanHero = {skin:'#E6B48C', hair:'#2b2b2b', hairStyle:'short', brow:1};
