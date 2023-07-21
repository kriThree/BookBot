import User from "../models/User.js";

export default async function getUser(userId) {
	return (await User.find()).filter((e) => +e.userId === +userId)[0];
}
