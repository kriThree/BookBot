import bot from "../index.js";

export default async function bookElement(userId, element, options) {
	return await bot.sendPhoto(userId, element.imageLink, {
		caption: `Название: ${element.name}\n\nАвтор: ${element.author}\n\nОписание: ${element.description}`,

		...options,
	});
}
