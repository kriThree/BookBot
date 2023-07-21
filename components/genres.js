import bot from "../index.js";
const genresDeffault = [
	"классика",
	"детектив",
	"фантастика",
	"фэнтези",
	"приключение",
	"сказки",
	"психология",
];
console.log(genresDeffault.map((e) => [{ text: e }]));
export default function genres(userId, text, genres = []) {
	bot.sendMessage(userId, text, {
		reply_markup: {
			keyboard: [...genres, ...genresDeffault.map((e) => [{ text: e }])],
		},
	});
}
