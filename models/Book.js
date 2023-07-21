import mongoose, { Schema, model } from "mongoose";
import User from "./User.js";

const bookShema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	genre: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	imageLink: {
		type: String,
		required: true,
	},
	exlusive: {
		type: Boolean,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},
	status: {
		type: String,
		required: true,
	},
	dateIssue: {
		type: mongoose.Schema.Types.Date,
		required: false,
	},
});

const Book = model("Book", bookShema);

export default Book;
