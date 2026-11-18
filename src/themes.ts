export type Theme = {
	name: string;
	bg: string;
	ink: string; // line colour
	accent: string; // hero colour / highlights
	accent2: string;
	gold: string;
	pink: string;
	paper: string; // fill for props
	stroke: number; // line weight
	boil: boolean; // hand-drawn "boiling line" wobble
	glow: boolean;
	captionFont: string;
	captionFill: string;
	captionStroke: string;
	captionActive: string;
	textFont: string; // big titles / year stamps
	ground: string;
	body: string; // default limb colour
	bodyBack?: string;
	skin: string; // head fill
	outlineColor: string;
	limb: number;
	outline: number;
};

export const THEMES: Record<string, Theme> = {
	// A: crisp white "animation desk" look, red hero
	classic: {
		name: 'classic', bg: '#F6F3EC', ink: '#141414', accent: '#E8412C', accent2: '#2F6FED', gold: '#F2B705', pink: '#F4A6A6',
		paper: '#FFFFFF', stroke: 11, boil: false, glow: false,
		captionFont: 'LuckiestGuy', captionFill: '#FFFFFF', captionStroke: '#141414', captionActive: '#FFD23F',
		textFont: 'LuckiestGuy', ground: '#141414',
		body: '#3B3B3B', skin: '#FFFFFF', outlineColor: '#141414', limb: 24, outline: 7,
	},
	// B: ballpoint doodle on lined notebook paper, wobbly hand-drawn lines
	notebook: {
		name: 'notebook', bg: '#FBF8EE', ink: '#1E3A8A', accent: '#E0245E', accent2: '#0E9F6E', gold: '#E8A800', pink: '#F7B2C4',
		paper: '#FFFDF6', stroke: 9, boil: true, glow: false,
		captionFont: 'PermanentMarker', captionFill: '#1E3A8A', captionStroke: '#FBF8EE', captionActive: '#E0245E',
		textFont: 'PermanentMarker', ground: '#1E3A8A',
		body: '#3E63C9', skin: '#FFFDF6', outlineColor: '#1E3A8A', limb: 20, outline: 6,
	},
	// C: dark stage, glowing white figures, orange hero
	night: {
		name: 'night', bg: '#0E0F14', ink: '#F4F4F6', accent: '#FF8A1F', accent2: '#3DD6F5', gold: '#FFC93C', pink: '#FF7AA2',
		paper: '#1B1D26', stroke: 11, boil: false, glow: true,
		captionFont: 'Bangers', captionFill: '#FFFFFF', captionStroke: '#000000', captionActive: '#FF8A1F',
		textFont: 'Bangers', ground: '#F4F4F6',
		body: '#5B6B8C', skin: '#FFFFFF', outlineColor: '#000000', limb: 24, outline: 6,
	},
};
