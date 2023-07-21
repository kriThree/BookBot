import bot from "../index.js";
export default function userDeff(userId, text) {
	bot.sendMessage(userId, text, {
		reply_markup: {
			keyboard: [
				[{ text: "Посмотреть каталог" }],
				[{ text: "Мы на карте" }],
				[{ text: "О нашем маленьком проекте" }],
				[{ text: "Я хочу отдать книгу" }],
				[{ text: "Забронированная книга" }],
			],
		},
	});
}
