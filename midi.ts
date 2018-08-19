import * as midi from 'midi';
import { MIDIMessage } from './types';

export class Midi {

	// Singleton instance of class.
	private static readonly instance: Midi = new Midi();

	private portsOpen: boolean;

	private constructor(
		private readonly output = new midi.output(),
		private readonly input = new midi.input()
	) {
		this.setUpEventHandlers();
		this.portsOpen = false;
	}

	public static getInstance(): Midi {
		return this.instance;
	}

	public open(port: number): void {
		if (port < 0 || port >= this.output.getPortCount()) {
			throw new Error('Specified port number out of range.');
		}
		if (this.portsOpen) {
			throw new Error('Ports are already open.');
		}
		this.portsOpen = true;
		this.output.openPort(port);
		this.input.openPort(port);
	}

	public close(): void {
		this.portsOpen = false;
		this.output.closePort();
		this.input.closePort();
	}

	public send(message: MIDIMessage): void {
		this.output.sendMessage(this.MIDIMessageToArray(message));
	}

	private MIDIMessageToArray(message: MIDIMessage): number[] {
		return [
			message.status,
			message.data1,
			message.data2
		];
	}

	private setUpEventHandlers(): void {
		// Event handler for printing incoming messages to stdout
		this.input.on('message', (deltaTime: number, message: number[]): void => console.log('Message:', message, 'deltaTime:', deltaTime));
	}
}
