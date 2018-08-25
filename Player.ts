import { Midi } from './midi'
import { Note } from './types';

export class Player {

	private queue = [];

	constructor(private readonly midi) {}

	public begin() {}

	public stop() {}

	public play(note: Note) {
		this.queue.push(note);
	}

	private dequeue() {
		const noteToPlay = this.queue.shift();
	}
}