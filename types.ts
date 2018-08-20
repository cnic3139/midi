export interface MIDIMessage {
	status: number;
	data1: number;
	data2: number;
}

export interface Note {
	octave: number;
	key: Key;
}

export enum Key {
	Ab,
	A,
	As,
	Bb,
	B,
	C,
	Cs,
	Db,
	D,
	Ds,
	Eb,
	E,
	F,
	Fs,
	Gb,
	G,
	Gs,
}
