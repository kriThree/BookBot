import Admin from "../models/Admin.js";

export default async function getActiveAdmin() {
	const admin = await Admin.findOne({ time: true });
	return admin ? admin.adminId : "1152213104";
}
