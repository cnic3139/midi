import { Key, MIDIMessage, Note } from './types';
import { BPM_MILLISEC_CONVERSION_FACTOR, OCTAVE } from './constants';
import { Midi } from './midi';

export class Util {

	private static readonly midi = Midi.getInstance();

	public static incrementNote(note: Note, interval: number): Note {
		const num: number = Util.keyToScaleNo(note.key);
		return {
			...note,
			octave: ((oct) => {
				if (interval === 0) {
					return oct;
				}
				if (interval > 0) {
					if (Util.mod(num + interval, OCTAVE) - num < 0) {
						return oct + 1;
					} else {
						return oct;
					}
				} else {
					if (Util.mod(num + interval, OCTAVE) - num > 0) {
						return oct - 1;
					} else {
						return oct;
					}
				}
			})(note.octave),
			key: Util.scaleNoToKey(
				Util.mod(num + interval, OCTAVE)
			)
		};
	}

	// Swaps between milliseconds and BPM.
	// Given a BPM, returns milliseconds between notes.
	// Given milliseconds between notes, returns the bpm.
	public static bpmMsSwap(num: number): number {
		return BPM_MILLISEC_CONVERSION_FACTOR / num;
	}

	// Given a Note, returns the pitch number to send via midi
	public static noteToNum(note: Note): number {
		// Probably use Util.keyToScaleNo and multiplication by the octave.
		return note.octave * OCTAVE + Util.keyToScaleNo(note.key);
	}

	// Given a number, returns a note with zero duration corresponding to 
	// that number.
	public static numToNote(num: number): Note {
		return {
			octave: Math.floor(num / OCTAVE),
			key: Util.mod(num, OCTAVE),
			duration: 0
		};
	}

	// Given a Key, returns it's number in the scale.
	public static keyToScaleNo(key: Key): number {
		switch(key) {
			case Key.C:
				return 0;
			case Key.Db:
				return 1;
			case Key.D:
				return 2;
			case Key.Eb:
				return 3;
			case Key.E:
				return 4;
			case Key.F:
				return 5;
			case Key.Gb:
				return 6;
			case Key.G:
				return 7;
			case Key.Ab:
				return 8;
			case Key.A:
				return 9
			case Key.B:
				return 10
			case Key.Bb:
				return 11;
		}
	}

	// Given a number, returns a key in the scale corresponding to that number.
	public static scaleNoToKey(num: number): Key {
		switch (num) {
			case 0:
				return Key.C;
			case 1:
				return Key.Db;
			case 2:
				return Key.D;
			case 3:
				return Key.Eb;
			case 4:
				return Key.E;
			case 5:
				return Key.F;
			case 6:
				return Key.Gb;
			case 7:
				return Key.G;
			case 8:
				return Key.Ab;
			case 9:
				return Key.A;
			case 10:
				return Key.B;
			case 11:
				return Key.Bb;
		}
	}

	// Sends a 'note off' message to all notes in the high/low boundary
	// so that no notes will be left with a continuous 'note on' playing
	// after the program terminates.
	//
	// If a 'quit' param is passed to the function, the program will terminate.
	public static killall(from: number, to: number, quit?: boolean): void {
		for (let j = from; j <= to; j++) {
			this.midi.send({
				status: 128,
				data1: j,
				data2: 64
			});
		}
		if (quit) {
			process.exit(0);
		}
	}

	// Because Javascript is stupid :/
	public static mod(a: number, b: number): number {
		return (((a % b) + b) % b);
	}
}
