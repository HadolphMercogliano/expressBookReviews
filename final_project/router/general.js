const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username) {
		return res.status(400).json({ message: "Username is required" });
	}

	if (!password) {
		return res.status(400).json({ message: "Password is required" });
	}
	const userExists = users.find((user) => user.username === username);

	if (userExists) {
		return res
			.status(409)
			.json({
				message: "Username already exists. Please choose a different username.",
			});
	}

	users.push({ username: username, password: password });

	return res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the book list available in the shop using Promise callbacks
public_users.get("/", function (req, res) {
	// Using Promise to simulate async operation
	const getBooksPromise = new Promise((resolve, reject) => {
		try {
			resolve(books);
		} catch (error) {
			reject(error);
		}
	});

	getBooksPromise
		.then((booksData) => {
			return res.status(200).json(JSON.stringify(booksData, null, 4));
		})
		.catch((error) => {
			return res
				.status(500)
				.json({ message: "Error retrieving books", error: error.message });
		});
});

// Task 11: Get book details based on ISBN using async-await
public_users.get("/isbn/:isbn", async function (req, res) {
	const isbn = req.params.isbn;

	try {
		const getBookPromise = new Promise((resolve, reject) => {
			if (books[isbn]) {
				resolve(books[isbn]);
			} else {
				reject(new Error("Book not found"));
			}
		});

		const book = await getBookPromise;
		return res.status(200).json(JSON.stringify(book, null, 4));
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}
});

// Task 12: Get book details based on author using Promise callbacks
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author;

	// Using Promise callbacks
	const getBooksByAuthorPromise = new Promise((resolve, reject) => {
		try {
			const bookKeys = Object.keys(books);
			const booksByAuthor = {};

			bookKeys.forEach((key) => {
				if (books[key].author.toLowerCase().includes(author.toLowerCase())) {
					booksByAuthor[key] = books[key];
				}
			});

			if (Object.keys(booksByAuthor).length > 0) {
				resolve(booksByAuthor);
			} else {
				reject(new Error("No books found by this author"));
			}
		} catch (error) {
			reject(error);
		}
	});

	getBooksByAuthorPromise
		.then((booksByAuthor) => {
			return res.status(200).json(JSON.stringify(booksByAuthor, null, 4));
		})
		.catch((error) => {
			return res.status(404).json({ message: error.message });
		});
});

// Task 13: Get all books based on title using async-await
public_users.get("/title/:title", async function (req, res) {
	const title = req.params.title;

	try {
		// Using async/await with Promise
		const getBooksByTitlePromise = new Promise((resolve, reject) => {
			
				const bookKeys = Object.keys(books);
				const booksByTitle = {};

				bookKeys.forEach((key) => {
					if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
						booksByTitle[key] = books[key];
					}
				});

				if (Object.keys(booksByTitle).length > 0) {
					resolve(booksByTitle);
				} else {
					reject(new Error("No books found with this title"));
				}
		});

		const booksByTitle = await getBooksByTitlePromise;
		return res.status(200).json(JSON.stringify(booksByTitle, null, 4));
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;

	if (books[isbn]) {
		const reviews = books[isbn].reviews;
		return res.status(200).json(JSON.stringify(reviews, null, 4));
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

module.exports.general = public_users;
