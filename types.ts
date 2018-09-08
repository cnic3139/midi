export interface MIDIMessage {
	status: number;
	data1: number;
	data2: number;
}

// Should a note have other elements? i.e. duration?
// Should we create sounds by pushing notes to a queue which is read by a
// method that just reads notes off of the queue and plays them?
export interface Note {
	octave: number;
	key: Key;
	duration: number;
}

export enum Key {
	C,
	Db,
	D,
	Eb,
	E,
	F,
	Gb,
	G,
	Ab,
	A,
	B,
	Bb
}

// the actual instrument
// should it have an api?
export interface Instrument {
	play: () => {}
}

export interface sequence {
	notes: Note[];
	// more than just notes? i.e. loop parmeter tweaks
}
