import { Midi } from './midi'
import { Note } from './types';
import { EventEmitter } from 'events';
import { EVENT_QUEUE_NONEMPTY } from './constants';

export class Player {

	private queue: Note[] = [];
	private playing: boolean = false;
	private queueNonEmpty: EventEmitter = new EventEmitter();

	constructor(private readonly midi) {}

	// Start the Player dequeueing notes and playing them
	public begin(): void {
		this.playing = true;
		this.dequeue;
	}

	// Stop the Player dequeueing notes and playing them.
	public stop(): void {
		this.playing = false;
	}

	// Enqueue a note on the Player for playing.
	public play(note: Note): void {
		this.queue.push(note);
		if (this.queue.length === 1) {
			this.queueNonEmpty.emit(EVENT_QUEUE_NONEMPTY);
		}
	}

	// Private method responsible for dequeueing notes.
	// TODO Should the note playing logic and timeouts be refactored into
	// 	other methods? Think about how it's going to work.
	private dequeue(): void {
		if (this.playing) {
			if (!this.queue.length) {
				this.queueNonEmpty.on(EVENT_QUEUE_NONEMPTY, this.dequeue);
			} else {
				const noteToPlay = this.queue.shift();
				// Actually play the note.
				
				// Wait duration of note, then send note off message?

				// So we need a note duration time and a 
				// 	between-note duration time.
				setTimeout(this.dequeue, noteToPlay.duration);
			}
		}
	}
}