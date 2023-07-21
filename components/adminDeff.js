import bot from "../index.js";

export default function adminDeff(userId, text) {
	bot.sendMessage(userId, text, {
		reply_markup: {
			keyboard: [
				[{ text: "Посмотреть каталог" }],
				[{ text: "Добавить книгу" }],
				[{ text: "Посмотреть забронированные книги" }],
				[{ text: "Смена" }],
			],
		},
	});
}
