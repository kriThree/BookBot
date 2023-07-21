import messageTime from "./messages/messageTime.js";

export default function messages() {
	const messages = [[messageTime, 2]];

	messages.forEach(([message, time]) => {
		setInterval(() => {
			message();
		}, 6000 * time);
	});
}
