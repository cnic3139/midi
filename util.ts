import { Key, MIDIMessage, Note } from './types';
import { BPM_MILLISEC_CONVERSION_FACTOR } from './constants';

export class Util {

	constructor(private readonly midi) {}

	// Swaps between milliseconds and BPM.
	// Given a BPM, returns milliseconds between notes.
	// Given milliseconds between notes, returns the bpm.
	public static bpmMsSwap(num: number): number {
		return BPM_MILLISEC_CONVERSION_FACTOR / num;
	}

	// Given a Note, returns the pitch number to send via midi
	public static noteToNum(note: Note): number {
		// Probably use Util.keyToScaleNo and multiplication by the octave.
		return null; // TODO
	}

	// Given a Key, returns it's number in the scale.
	private static keyToScaleNo(key: Key): number {
		switch(key) {
			case Key.A:
				return 0;
			case Key.As:
			case Key.Bb:
				return 1;
			case Key.B:
				return 2;
			case Key.C:
				return 3;
			case Key.Cs:
			case Key.Db:
				return 4;
			case Key.D:
				return 5;
			case Key.Ds:
			case Key.Eb:
				return 6;
			case Key.E:
				return 7;
			case Key.F:
				return 8;
			case Key.Fs:
			case Key.Gb:
				return 9
			case Key.G:
				return 10
			case Key.Gs:
			case Key.Ab:
				return 11;
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
}
