import { BIT_MAX_7, BIT_MIN_7 } from './constants';
import { MIDIMessage } from './types';

export class Filter {

	private fCurrent: number;
	private rCurrent: number;
	private fFlip: boolean;
	private rFlip: boolean;

	constructor(private readonly midi) {
		this.fCurrent = BIT_MIN_7;
		this.rCurrent = BIT_MAX_7;
		this.fFlip = true;
		this.rFlip = true;
	}

	// Send a filter cutoff message to the output.
	public filterSweep(): void {
		this.midi.send({
			status: 176,
			data1: 102,
			data2: this.fCurrent
		});
		this.midi.send({
			status: 176,
			data1: 104,
			data2: this.fCurrent
		});
		if (this.fCurrent < BIT_MIN_7 || this.fCurrent > BIT_MAX_7) {
			this.fFlip = !this.fFlip;
		}
		this.fFlip ? this.fCurrent++ : this.fCurrent--;
	}

	// Send a filter resonance message to the output.
	public resonanceSweep(): void {
		this.midi.send({
			status: 176,
			data1: 105,
			data2: this.rCurrent
		});
		this.midi.send({
			status: 176,
			data1: 107,
			data2: this.rCurrent
		});
		if (this.rCurrent < BIT_MIN_7 || this.rCurrent > BIT_MAX_7) {
			this.rFlip = !this.rFlip;
		}
		this.rFlip ? this.rCurrent-- : this.rCurrent++;
	}
}
