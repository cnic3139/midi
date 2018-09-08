import { Midi } from './midi'
import { Instrument, Note } from './types';
import { EventEmitter } from 'events';
import { PLAYER_START, PLAYER_STOP, EVENT_QUEUE_EMPTY, EVENT_QUEUE_NONEMPTY } from './constants';
import { Promise } from 'es6-promise';
import { Util } from './util';

export class Player {

	private queue: Note[] = [];
	private playing: boolean = false;
	private queueEventEmitter: EventEmitter = new EventEmitter();
	private instrument: Instrument;

	constructor(private readonly midi) {}

	// Start the Player dequeueing notes and playing them
	public begin(finish: boolean = false): void {
		this.queueEventEmitter.emit(PLAYER_START);
		this.playing = true;
		if (finish) {
			this.queueEventEmitter.on(EVENT_QUEUE_EMPTY, () => {
				this.stop();
			});
		}
		this.dequeue();
	}

	// Stop the Player dequeueing notes and playing them.
	public stop(): void {
		this.queueEventEmitter.emit(PLAYER_STOP);
		this.playing = false;
	}

	// Enqueue a note on the Player for playing.
	public play(note: Note): void {
		this.queue.push(note);
		if (this.queue.length === 1) {
			this.queueEventEmitter.emit(EVENT_QUEUE_NONEMPTY);
		}
	}

	public awaitFinish(): Promise<void> {
		return new Promise((resolve) => {
			this.queueEventEmitter.on(PLAYER_STOP, () => {
				resolve();
			});
		});
	}

	// Private method responsible for dequeueing notes.
	// TODO Should the note playing logic and timeouts be refactored into
	// 	other methods? Think about how it's going to work.
	private dequeue(): void {
		if (this.playing) {
			if (!this.queue.length) {
				this.queueEventEmitter.emit(EVENT_QUEUE_EMPTY);
				this.queueEventEmitter.on(EVENT_QUEUE_NONEMPTY, this.dequeue);
			} else {
				const note: Note = this.queue.shift();
				// Actually play the note.
				this.midi.send({
					status: 144,
					data1: Util.noteToNum(note),
					data2: 127
				});
				// Wait duration of note, then send note off message?
				setTimeout(() => this.midi.send({
					status: 128,
					data1: Util.noteToNum(note),
					data2: 64
				}), note.duration);

				// So we need a note duration time and a 
				// 	between-note duration time.
				setTimeout(() => {this.dequeue()}, note.duration + 100/*note.duration*/);
			}
		}
	}

	// I want to make it so that incoming midi notes from instruments can
	// dynamically change what's happening.
	// i.e if a Player is playing a Loop, i want to be able to change the 
	// tonic note of the loop by pressing keys on the synth, for example.
}