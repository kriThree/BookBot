import bot from "../index.js";

export default function godDeff(userId, text) {
	bot.sendMessage(userId, text, {
		reply_markup: {
			keyboard: [[{ text: "Добавить админа" }]],
		},
	});
}
