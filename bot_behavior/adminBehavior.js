import genres from "../components/genres.js";
import bot from "../index.js";
import Book from "../models/Book.js";
import adminDeff from "../components/adminDeff.js";
import User from "../models/User.js";
import bookElement from "../components/bookElement.js";
import Admin from "../models/Admin.js";

const form = {};
let adminWork = {};
let behavior = "deffault";

// let genresButton =;
async function adminBehavior(msg, text, userId, chatId) {
	//Админы
	const time = (await Admin.findOne({ time: true })) || "";
	console.log(time);
	if (time && +userId !== +time.adminId)
		return bot.sendMessage(userId, "Смена открыта у другого администротора");
	if (behavior === "addBook") {
		if (adminWork[userId] === 0) {
			form[userId] = {};
			form[userId].name = text;
			bot.sendMessage(userId, "Теперь описание");
			adminWork[userId]++;
		} else if (adminWork[userId] === 1) {
			form[userId].description = text;
			bot.sendMessage(userId, "Теперь автора");
			adminWork[userId]++;
		} else if (adminWork[userId] === 2) {
			form[userId].author = text;
			bot.sendMessage(userId, "Теперь обложка");
			adminWork[userId]++;
		} else if (adminWork[userId] === 3) {
			if (!msg.photo) {
				bot.sendMessage(userId, "Повторите попытку");
			} else {
				form[userId].imageLink = msg.photo[0].file_id;
				bot.sendMessage(userId, "Теперь скажи будет ли эта книга экслюзивом", {
					reply_markup: {
						keyboard: [[{ text: "Да" }], [{ text: "Нет" }]],
					},
				});
				adminWork[userId]++;
			}
		} else if (adminWork[userId] === 4) {
			form[userId].exlusive = text === "Да";
			genres(userId, "Теперь жанр");
			adminWork[userId]++;
		} else if (adminWork[userId] === 5) {
			form[userId].genre = text;
			form[userId].status = "ДОМА";
			behavior = "deffault";

			const book = new Book(form[userId]);
			const req = await book.save();

			delete adminWork[userId];
			delete form[userId];

			console.log(req);
			if (req) {
				bot.sendMessage(userId, "Отлично, книга добавлена");
				adminDeff(userId, "Что-то еще?");
			} else {
				bot.sendMessage(userId, "Кажется что-то пошло не так");
			}
		}
	} else if (behavior === "watchCatalog") {
		const catalogToGenre = await Book.find(
			text === "Все жанры" ? {} : { genre: text }
		);
		if (catalogToGenre.length) {
			for (let g = 0; g < catalogToGenre.length; g++) {
				const element = catalogToGenre[g];
				await bookElement(userId, element);
			}
		} else {
			bot.sendMessage(userId, "Извините, данный каталог пока пуст :(");
		}
		adminDeff(userId, "Что-то еще?");
		behavior = "deffault";
	} else if (behavior === "time") {
		const admin = await Admin.findOne({ adminId: userId });
		switch (text) {
			case "Открыть смену":
				admin.time = true;
				if (await admin.save()) adminDeff(userId, "Приятной РАБоты");
				break;
			case "Закрыть смену":
				admin.time = false;
				if (await admin.save()) adminDeff(userId, "Приятного отдыха");
				break;
		}
		behavior = "deff";
	} else {
		switch (text) {
			case "/start":
				adminDeff(userId, "Добро пожаловать, дорогой админ!");

				break;

			case "Посмотреть каталог":
				genres(userId, "Введите жанр", [[{ text: "Все жанры" }]]);
				behavior = "watchCatalog";

				break;
			case "Добавить книгу":
				bot.sendMessage(userId, "Хорошо, теперь выберите название книги", {
					reply_markup: { remove_keyboard: true },
				});
				adminWork[userId] = 0;
				behavior = "addBook";
				break;
			case "Посмотреть забронированные книги":
				const reservedBooks = await Book.find({ status: "ПРОЦЕСС" });
				if (reservedBooks && reservedBooks.length) {
					for (let index = 0; index < reservedBooks.length; index++) {
						let e = reservedBooks[index];
						e = `${e.name}\n@${(await User.findById(e.owner)).userName}`;
						reservedBooks[index] = e;
					}
					bot.sendMessage(userId, reservedBooks.join("\n\n"));
				} else {
					bot.sendMessage(userId, "Забронированных книг пока нет");
				}

				break;
			case "Смена":
				behavior = "time";

				const admin = await Admin.findOne({ adminId: userId });

				await bot.sendMessage(
					userId,
					"Хорошо, вы хотите открыть или закрыть свою смену?",
					{
						reply_markup: {
							keyboard: [
								[{ text: admin.time ? "Закрыть смену" : "Открыть смену" }],
							],
						},
					}
				);
				break;
			default:
				bot.sendMessage(userId, "Не очень вас понял, повторите попытку");
		}
	}
}

export default adminBehavior;
