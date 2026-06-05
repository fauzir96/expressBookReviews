const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here - Task 6
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({ message: "Customer successfully registered. Please login!" });
    } else {
      return res.status(404).json({ message: "Username already exists!" });
    }
  } 
  return res.status(404).json({ message: "Username or password cannot be empty!" });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here - Task 1 / 10
  try {
    const response = await axios.get('https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReviews/main/final_project/router/booksdb.js');
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here - Task 2 / 11
  const isbn = req.params.isbn;
  try {
    const getBook = () => Promise.resolve(books[isbn]);
    const book = await getBook();
    
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details" });
  }
  });

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const authorParam = req.params.author.toLowerCase();
    try {
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
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: `No books found for the author: '${req.params.author}'` });
      }
    } catch (error) {
      return res.status(500).json({ 
        message: "An internal server error occurred while fetching author details.", 
        error: error.message 
      });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const titleParam = req.params.title.toLowerCase();
  
    try {
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
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: `No books found with the title: '${req.params.title}'` });
      }
    } catch (error) {
      return res.status(500).json({ 
        message: "An internal server error occurred while fetching title details.", 
        error: error.message 
      });
    }
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
