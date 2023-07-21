import TelegramApi from "node-telegram-bot-api";
import mongoose from "mongoose";
import userBehavior from "./bot_behavior/userBehavior.js";
import adminBehavior from "./bot_behavior/adminBehavior.js";
import godBehavior from "./bot_behavior/godBehavior.js";
import Admin from "./models/Admin.js";
import Book from "./models/Book.js";
import userDeff from "./components/userDeff.js";
import getUser from "./scripts/getUser.js";
import overwrite from "./components/overwrite.js";
import messages from "./messages/messages.js";
import getActiveAdmin from "./components/getActiveAdmin.js";
import { token, uri } from "./config/config.js";
const bot = new TelegramApi(token, { polling: true });

async function start() {
	try {
		await mongoose.connect(uri);
		console.log("e");
	} catch (e) {
		console.log("Ошибка в подключении к db " + e);
	}

	const admins = (await Admin.find()).map((e) => +e.adminId);

	console.log(admins);
	// 5887704592
	const god = 5887704592;
	bot.on("message", async (msg) => {
		console.log(msg);
		const text = msg.text;
		const chatId = msg.chat.id;
		const userId = msg.from.id;
		if (userId === god) {
			godBehavior(text, userId, chatId);
		} else if (admins.includes(userId)) {
			adminBehavior(msg, text, userId, chatId);
		} else {
			userBehavior(msg, text, userId, chatId, admins);
		}
	});
	bot.on("callback_query", async (data) => {
		console.log(data.data);
		const text = data.data;

		let [bookId, userId, ex] = text.match(/\((.*)\)/)[1].split("|");
		const user = await getUser(userId);
		const book = await Book.findById(bookId);
		//Запрос на бронирование книги
		if (/^reserved/.test(text)) {
			if (!user.book) {
				console.log(user, book);
				user.book = book.id;
				book.owner = user.id;
				book.status = "ПРОЦЕСС";
				if ((await user.save()) && (await book.save())) {
					await bot.sendMessage(
						userId,
						`Ожидаем вас в нашем пункте выдачи, чтобы получить книгу подойдите к стойке администратора и нажмите кнопку 'Забронированная книга'${
							book.exlusive
								? "\nТакже не забудьте, что книга является экслюзивом, и за нее требуется внести небольшую плату - 50 рублей"
								: ""
						} `
					);
					userDeff(userId, "Спасибо за помощь нашему антикафе❤️");
				} else {
					userDeff(userId, "Что-то пошло не так");
				}
			} else {
				bot.sendMessage(
					userId,
					"За вами уже закреплена книга, зайдите в главное меню"
				);
			}
		} else if (/^recoil/.test(text)) {
			book.status = "КЛИЕНТ";
			book.dateIssue = new Date();
			if (book.save()) {
				bot.sendMessage(await getActiveAdmin(), "Книга успешно передана");
				userDeff(userId, "Приятного чтения❤️");
			}
		} else if (/^return/.test(text)) {
			if (await overwrite(book, user)) {
				bot.sendMessage(await getActiveAdmin(), "Книга успешно передана");
				userDeff(userId, "Наслаждайтесь книгами с PROSTO");
			}
		}
	});
	messages();
}

start();
export default bot;
