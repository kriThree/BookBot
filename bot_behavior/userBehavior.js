import bookElement from "../components/bookElement.js";
import genres from "../components/genres.js";
import getActiveAdmin from "../components/getActiveAdmin.js";
import overwrite from "../components/overwrite.js";
import userDeff from "../components/userDeff.js";
import bot from "../index.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import getUser from "../scripts/getUser.js";
let userWork = {};
let userCods = {};
async function userBehavior(msg, text, userId, chatId) {
	//Пользователи
	console.log(text);
	bot.setMyCommands([
		{ command: "/start", description: "Начать работу с ботом" },
	]);
	if (userWork[userId]) {
		if (userWork[userId] === 1) {
			console.log(text);

			const catalogToGenre = await Book.find(
				text === "Все жанры" ? {} : { genre: text }
			);
			const userHave = (await User.findOne({ userId: userId })).book;

			console.log(userHave);
			if (catalogToGenre.length) {
				for (let g = 0; g < catalogToGenre.length; g++) {
					const element = catalogToGenre[g];
					await bookElement(userId, element, {
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: userHave
											? "У вас уже есть книга😊"
											: element.status === "ДОМА"
											? `Забронировать${element.exlusive ? "(Экслюзив)" : ""}`
											: "В обращении😔",
										callback_data:
											!userHave && element.status === "ДОМА"
												? `reserved(${element.id}|${userId}${
														element.exlusive ? "|ex" : "|st"
												  })`
												: "d",
									},
								],
							],
						},
					});
				}
			} else {
				await bot.sendMessage(
					userId,
					"К сожалению, книг по данному жанру еще нет:("
				);
			}
			delete userWork[userId];
			userDeff(userId, "Что-то еще?");
		} else if (userWork[userId] === 2) {
			const userServer = await User.findOne({ userId: userId });
			const book = await Book.findById(userServer.book);
			switch (text) {
				case "Отменить бронирование":
					// console.log(userServer, book);
					if (await overwrite(book, userServer)) {
						userDeff(userId, "Готово");
					} else {
						userDeff(userId, "Произошла ошибка");
					}
					delete userWork[userId];
					break;
				case "Получить кингу(Нажимать строго на пункте выдачи!)":
					userCods[userId] = Math.round(Math.random() * 100000);

					bot.sendMessage(
						userId,
						`Прочтите этот код админстратору,${
							book.exlusive ? "И передайте 50 рублей " : ""
						} чтобы получить книгу ${userCods[userId]}`
					);
					bot.sendMessage(
						await getActiveAdmin(),
						`Пользователь хочет забрать книгу,'${
							book.name
						}', если прочтенный им код совпадет с вашим${
							book.exlusive ? ", и он передал вам 50 рублей," : ""
						} то выдайте ему книгу и нажмите кнопку снизу
						${userCods[userId]}`,
						{
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "СЮДЫ",
											callback_data: `recoil(${book.id}|${userId})`,
										},
									],
								],
							},
						}
					);
					delete userWork[userId];

					break;
			}
		}
	} else {
		switch (text) {
			case "/start":
				await bot.sendPhoto(
					chatId,
					"https://i.ibb.co/tKd9LRs/photo-2023-06-01-20-16-47.jpg"
				);
				await userDeff(
					userId,
					"Добро пожаловать в самый простой бот для обмена книжками!"
				);
				if (!(await User.findOne({ userId }))) {
					const user = new User({ userId, userName: msg.from.username });
					console.log(await user.save());
				}

				break;
			case "Посмотреть каталог":
				userWork[userId] = 1;
				genres(userId, "Хорошо, введи жанры по которым хочешь получить книги", [
					[{ text: "Все жанры" }],
				]);
				break;
			case "Мы на карте":
				userDeff(userId, "https://yandex.ru/maps/-/CCUwjYAC8D");
				break;
			case "О нашем маленьком проекте":
				userDeff(
					userId,
					`📓📌Антикафе PROSTO совместно с Ариной Вайнер запускает принципиально новый проект по обмену книгами в г. Канаш! 

				📖📌Буккросинг как способ взаимодействия между людьми и попытка разнообразить читательский опыт существует уже довольно долгое время. В рамках этого движения, люди оставляют книги прямо в общественных местах и наблюдают за их увлекательным путешествием. Казалось бы, зачем вообще заменять его чем-то схожим с библиотеками? Однако, стоит вспомнить ситуацию, знакомую всем книголюбам. Вообразите, вы в магазине и видите невероятно манящие обложки, тысячи названий, увлекательных историй... Взгляд нервно бегает от стеллажа к стеллажу, и, в какой-то момент, вы ловите себя на том, что спускаете все деньги на книги, половина которых повергнет вас в уныние и сожаление от потраченных времени и средств! Знакомо? Наш же проект позволяет взять небиблиотечные издания “напрокат” и оценить их содержание в уютной обстановке антикафе или же у себя дома, и понять, подходит ли эта книга именно вам. 
				
				📲📌Как это работает? Мы создали ТГ-бот, который позволит каждому выбрать книжную новинку или ретро-экземпляр прямо в формате онлайн, а забрать её можно будет у администратора антикафе PROSTO, которое расположено по адресу: 
				г. Канаш, Городской Парк (брусчатка возле скейт-площадки, левая тропа, кафе “”). Такая система позволяет быстро и без лишних затрат изучить интересующее издание и доступную информацию по нему, а также упрощает взаимодействия между клиентами антикафе и его сотрудниками. Кроме того, буккросинг - это ещё и очень экологично, ведь любой желающий может оставить ненужные, приевшиеся книги у нас, вместо того, чтобы выбрасывать их, и подарить другим людям незабываемые впечатления от прочтения! 
				
				🧾Ссылка на Бот -@prosto_books_bot
				
				Страницы организаторов:
				
				📕Арина Вайнер - https://t.me/rudeemodudelovesyoukid
				
				🤍Антикафе PROSTO - https://t.me/anticafeprosto`
				);
				break;
			case "Я хочу отдать книгу":
				const userServ = await User.findOne({ userId });
				const userHave = userServ.book;
				if (userHave) {
					const book = await Book.findById(userServ.book);
					console.log(book);
					if (book.status === "КЛИЕНТ") {
						userDeff(
							userId,
							"Мы уведомим об этом администраторов и будем ожидать вас в течении всего рабочего дня"
						);
						bot.sendMessage(
							await getActiveAdmin(),
							`Дорогой администратор, пользователь\n${
								msg.from.username
									? "c ником @" + msg.from.username
									: "с id" + userId
							}\nхочет отдать книгу '${
								book.name
							}', когда книга будет у вас, нажмите кнопку внизу для окончания операции`,
							{
								reply_markup: {
									inline_keyboard: [
										[
											{
												text: "СЮДЫ",
												callback_data: `return(${book.id}|${userId})`,
											},
										],
									],
								},
							}
						);
					} else {
						userDeff(
							userId,
							"Забронированная книга пока не у вас, мы ожидаем вас в пункте выдачи"
						);
					}
				} else {
					userDeff(userId, "У вас пока нет книги");
				}
				break;
			case "Забронированная книга":
				const userServer = await User.findOne({ userId });
				const book = await Book.findById(userServer.book);
				console.log(book);
				if (userServer.book && book.status === "ПРОЦЕСС") {
					bookElement(userId, book, {
						reply_markup: {
							keyboard: [
								[{ text: "Отменить бронирование" }],
								[
									{
										text: "Получить кингу(Нажимать строго на пункте выдачи!)",
									},
								],
							],
						},
					});
					userWork[userId] = 2;
				} else if (userServer.book && book.status === "КЛИЕНТ") {
					userDeff(
						userId,
						"Книга уже у вас, наслаждайтесь чтением. В случае прочтения книги и желания ее отдать, нажмите на 'Я хочу отдать книгу'"
					);
				} else {
					userDeff(userId, "У вас пока нет книги");
				}

				break;
			default:
				bot.sendMessage(userId, "Не очень вас понял, повторите попытку");
		}
	}
}

export default userBehavior;
