export default async function overwrite(book, user) {
	book.overwrite({
		name: book.name,
		description: book.description,
		author: book.author,
		imageLink: book.imageLink,
		exlusive: book.exlusive,
		genre: book.genre,
		status: "ДОМА",
	});
	user.overwrite({
		userId: user.userId,
		userName: user.userName,
	});
	return (await book.save()) && (await user.save());
}
