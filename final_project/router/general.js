const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here - Task 6
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let userExist = users.filter((user) => user.username === username);
    
    if (userExist.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Regiter Succes. Please login!"});
    } else {
      return res.status(404).json({message: "Username is already used!"});
    }
  } 
  return res.status(404).json({message: "Username or password should not be empty!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here - Task 1 / 10
  const getAllBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Fail to load books data.");
    }
  });

  getAllBooks
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here - Task 2 / 11
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("The book with those ISBN is not found.");
    }
  });

  getBookByISBN
    .then((bookDetails) => {
      return res.status(200).json(bookDetails);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here - Task 3 / 12
  const authorParam = req.params.author.toLowerCase();

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchingBooks = [];

    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === authorParam) {
        matchingBooks.push({
          isbn: key,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("The books from the Author is not found.");
    }
  });

  getBooksByAuthor
    .then((booksFound) => {
      return res.status(200).json(booksFound);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here - Task 4 / 13
  const titleParam = req.params.title.toLowerCase();

  const getBooksByTitle = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchingBooks = [];

    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === titleParam) {
        matchingBooks.push({
          isbn: key,
          author: books[key].author,
          reviews: books[key].reviews
        });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No book found with the title.");
    }
  });

  getBooksByTitle
    .then((booksFound) => {
      return res.status(200).json(booksFound);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here - Task 5
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "The book is not found."});
  }
});

module.exports.general = public_users;
