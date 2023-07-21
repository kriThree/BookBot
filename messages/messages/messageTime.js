import bot from "../../index.js";
import Admin from "../../models/Admin.js";

export default async function messageTime() {
	const time = new Date();
	if (time.getHours() > 22) {
		const admin = (await Admin.findOne({ time: true })) || "";
		if (admin.adminId)
			bot.sendMessage(
				admin.adminId,
				"Дорогой админстратор рабочее время уже закончилось и я прошу вас закрыть смену "
			);
	}
}
