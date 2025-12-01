declare global {
	namespace App {}
	type EventElements = Event & {
		currentTarget: EventTarget & (HTMLInputElement | HTMLTextAreaElement);
	};
}

export {};
