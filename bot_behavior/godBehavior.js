import mongoose from "mongoose";
import bot from "../index.js";
import Admin from "../models/Admin.js";
import godDeff from "../components/godDeff.js";

let godWork = 0;
function godBehavior(text, userId, chatId) {
	if (godWork) {
		const admin = new Admin({ adminId: text, time: false });
		admin.save();
		godWork = 0;
		godDeff(userId, "Еще что-нибудь всеотец?");
	} else {
		switch (text) {
			case "/start":
				godDeff(userId, "ЗДРАВСТВУЙ ГОСПОДЬ");
				break;
			case "Добавить админа":
				bot.sendMessage(userId, "ОТЛИЧНОЕ РЕШЕНИЕ ВСЕОТЕЦ, введи id админа", {
					reply_markup: { remove_keyboard: true },
				});
				godWork = 1;
				break;
			default:
				bot.sendMessage(
					userId,
					"Извнинте всеотец, не очень вас понял повторите попытку"
				);
		}
	}
}

export default godBehavior;
