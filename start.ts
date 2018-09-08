// Imports.
import { Filter } from './filter';
import { Midi } from './midi';
import { Player } from './Player';
import { Key, MIDIMessage, Note } from './types';
import { Util } from './util';
import { majorScale } from './scales';

const readline = require('readline');

// Objects.
const midi = Midi.getInstance(); // Only allow one instance of midi.
const filter = new Filter(midi);
// midi.open(0); // FOR NOW

// There needs to be some sort of user interface to see whilst performing
// So this can be where that is set up maybe?

// Set up constants. TODO: Move to constants.ts when finalised

// To read user input.
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

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
	let prompt = 'Choose a midi instrument: \n';

	for (let i = 0; i < midi.getOutput().getPortCount(); i++) {
		prompt += i.toString() + ': ' + midi.getOutput().getPortName(i) + '\n';
	}
	

	rl.question(prompt, (answer: string) => {
		const port = parseInt(answer);
		if (port < 0 || port > midi.getOutput().getPortCount()) {
			throw "Invalid selection";
		}
		midi.open(port);

		const player = new Player(midi);
		let note: Note = {
			octave: 5,
			key: Key.C,
			duration: 500
		};

		player.play(note);

		majorScale.forEach(interval => {
			note = Util.incrementNote(note, interval);
			player.play(note);
		});
		majorScale.reverse().forEach(interval => {
			note = Util.incrementNote(note, -interval);
			player.play(note);
		});

		player.begin(true);

		player.awaitFinish().then(() => {
			rl.close();
			Util.killall(low, high, true);
		});
	});

	// // Set note on.
	// setInterval(() => on({
	//  	status: 144,
	// 	data1: nCurrent,
	// 	data2: 127
	// }), interval);

	// // Set off, just after note on.
	// setTimeout(() => setInterval(() => off({
	//  	status: 128,
	// 	data1: nCurrent,
	// 	data2: 64
	// }), interval), hold);

	// // Set filter cutoff sweeping.
	// setInterval(() => filter.filterSweep(), hold / 2);

	// // Set filter resonance sweeping.
	// setInterval(() => filter.resonanceSweep(), hold / 3);
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
			Util.killall(low, high, true);
		}
	}
}

function playScaleUpAndDown(scale: number[], startNote: Note) {
	const player = new Player(midi);
	let i: Note = startNote;
	player.begin();
	scale.forEach(interval => {
		//TODO
		player.play(i);
		i = Util.incrementNote(i, interval);
	});
	scale.reverse().forEach(interval => {
		//TODO
		player.play(i);
	});
	player.stop();
}

// Call the start method to start the program.
start();
