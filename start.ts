// Imports.
import { Midi } from './midi';
import { Filter } from './filter';
import { Util } from './util';
import { MIDIMessage } from './types';

// Objects.
const midi = Midi.getInstance(); // Only allow one instance of midi.
const filter = new Filter(midi);
const utilities = new Util(midi);
midi.open(0);

// Set up constants.

// Bounds.
const low: number = 57;
const high: number = 69;

// Note tempo and length.
const tempo: number = 360; // In beats per minute.
const interval: number = Util.bpmMsSwap(tempo); // Note intervals.
const hold: number = interval / 2;

// Number of times the notes will cycle between bounds.
const turns: number = 5;

// Set up variables.

// Counter for number of times the notes have cycled between bounds.
let counter: number = 0;

// Notes.
let nCurrent: number = low;
let nFlip: boolean = true;

// Start function - This is where the program will commence.
function start(): void {
	// Set note on.
	setInterval(() => on({
	 	status: 144,
		data1: nCurrent,
		data2: 127
	}), interval);

	// Set off, just after note on.
	setTimeout(() => setInterval(() => off({
	 	status: 128,
		data1: nCurrent,
		data2: 64
	}), interval), hold);

	// Set filter cutoff sweeping.
	setInterval(() => filter.filterSweep(), hold / 2);

	// Set filter resonance sweeping.
	setInterval(() => filter.resonanceSweep(), hold / 3);
}

// Send a 'note on' message to the output.
function on(message: MIDIMessage): void {
	midi.send(message);

}

// Send a 'note off' message to the output.
function off(message: MIDIMessage): void {
	midi.send(message);
	nextNote();
}



// Function responsible for:
// 	- Incrementing the note played.
//  - Flipping the direction of notes once it reaches the high/low boundaries.
//  - Calling the 'killall' cleanup function when done, terminating program. 
function nextNote(): void {
	nFlip ? nCurrent++ : nCurrent--;
	if (nCurrent > high) {
		nFlip = !nFlip;
	} else if (nCurrent < low) {
		nFlip = !nFlip;
		if (++counter > turns) {
			utilities.killall(low, high, true);
		}
	}
}

// Call the start method to start the program.
start();
