const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  const bookKeys = Object.keys(books);
  const booksByAuthor = {};
  
  bookKeys.forEach(key => {
    if (books[key].author.toLowerCase().includes(author.toLowerCase())) {
      booksByAuthor[key] = books[key];
    }
  });
  
  // Check if any books were found
  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  
  // Get all the keys for the 'books' object
  const bookKeys = Object.keys(books);
  
  // Iterate through the books and check if title matches (partial search)
  const booksByTitle = {};
  
  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle[key] = books[key];
    }
  });
  
  // Check if any books were found
  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).json(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    return res.status(200).json(JSON.stringify(reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
