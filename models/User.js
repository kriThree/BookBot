import mongoose, { Schema, model } from "mongoose";

const userShema = new Schema({
	userId: {
		type: Number,
		required: true,
	},
	userName: {
		type: String,
		required: false,
	},
	book: {
		type: mongoose.Schema.Types.ObjectId || undefined,
		required: false,
	},
});

const User = model("User", userShema);

export default User;
