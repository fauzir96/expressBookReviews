const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => user.username === username);
  return userswithsamename.length > 0;
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => user.username === username && user.password === password);
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({message: "Username and password required!"});
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
          accessToken, username
      };

      return res.status(200).json({message: "Login Success!", token: accessToken});
  } else {
      return res.status(401).json({message: "Login Fail! Username or password wrong."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    
    const username = req.session.authorization['username']; 
  
    if (!reviewText) {
        return res.status(400).json({message: "Query should not empty!"});
    }
  
    if (books[isbn]) {
        let book = books[isbn];
        
        book.reviews[username] = reviewText;
        
        return res.status(200).json({
            message: `The review from ISBN ${isbn} is added.`,
            reviews: book.reviews
        });
    } else {
        return res.status(404).json({message: "The book with that ISBN is not found."});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
  
    if (books[isbn]) {
        let book = books[isbn];
        
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).json({message: `Review from '${username}' from book ISBN ${isbn} is deleted.`});
        } else {
            return res.status(404).json({message: "You are not leave a review for this book yet."});
        }
    } else {
        return res.status(404).json({message: "Book not Fo."});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
