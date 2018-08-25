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
