const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	//returns boolean
	if (!username || username.trim() === "") {
		return false;
	}

	// Check if username already exists
	const userExists = users.find((user) => user.username === username);
	return !userExists; // Returns true if username doesn't exist (is available)
};

const authenticatedUser = (username, password) => {
	//returns boolean
	let validusers = users.filter((user) => {
		return (user.username === username && user.password === password);
	});
	if (validusers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username) {
		return res.status(400).json({ message: "Username is required" });
	}

	if (!password) {
		return res.status(400).json({ message: "Password is required" });
	}

	if (authenticatedUser(username, password)) {
		// Generate JWT token
		let accessToken = jwt.sign({ data: username }, "access", {
			expiresIn: 60 * 60,
		});

		req.session.authorization = {
			accessToken: accessToken,
			username: username,
		};

		return res.status(200).json({
			message: "User successfully logged in",
			token: accessToken,
		});
	} else {
		return res.status(401).json({ message: "Invalid username or password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const review = req.body.review;
	const username = req.session.authorization?.username;

	if (!username) {
		return res.status(401).json({ message: "User not authenticated" });
	}

	if (!review) {
		return res.status(400).json({ message: "Review is required" });
	}

	if (!books[isbn]) {
		return res.status(404).json({ message: "Book not found" });
	}

	books[isbn].reviews[username] = review;

	return res.status(200).json({
		message: `Review for ISBN ${isbn} added\\updated successfully`,
		book: books[isbn]
	});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization?.username;

	if (!username) {
		return res.status(401).json({ message: "User not authenticated" });
	}

	if (!books[isbn]) {
		return res.status(404).json({ message: "Book not found" });
	}

	if (!books[isbn].reviews[username]) {
		return res.status(404).json({ message: "No review found for this user and book" });
	}

	delete books[isbn].reviews[username];

	return res.status(200).json({
		message: `Review for ISBN ${isbn} deleted successfully`,
		book: books[isbn]
	});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
