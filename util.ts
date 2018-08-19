import { MIDIMessage } from './types';

export class Util {

	constructor(private readonly midi) {}

	// Swaps between milliseconds and BPM.
	// Given a BPM, returns milliseconds between notes.
	// Given milliseconds between notes, returns the bpm.
	public static bpmMsSwap(num: number): number {
		return 60000 / num;
	}

	// Sends a 'note off' message to all notes in the high/low boundary
	// so that no notes will be left with a continuous 'note on' playing
	// after the program terminates.
	//
	// If a 'quit' param is passed to the function, the program will terminate.
	public killall(from: number, to: number, quit?: boolean): void {
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