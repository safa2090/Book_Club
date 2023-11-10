const Book=require('../models/book.model');
const jwt = require("jsonwebtoken");

//Read AllBooks
module.exports.getAllBook = (request, response) => {
    Book.find({})
        .then(Books => {
            console.log(Books); 
            response.json(Books);
        })
        .catch(err => {
            console.log(err)
            response.json(err)
        })
}

// Get One Book
module.exports.findOneSingleBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(Book => res.json(Book))
        .catch((err) => {
            res.status(400).json({ message: 'Something went wrong', error: err })
        });
    }

//Create a new Book
module.exports.createBook = (request, response) => { 
    console.log(request.Token.firstName);  
    Book.create({...request.body, 
        addedBy:request.Token.firstName, 
        likedBy:request.Token.firstName })        
        .then(Book => response.json(Book))
        .catch(err => response.status(400).json(err))
    }

//Update One Book 
module.exports.updateOneBook = (req,res)=>{
    Book.findByIdAndUpdate(req.params.id, req.body,{ new: true, runValidators: true })
    .then(updatedBook=>{
        console.log("UPDATED ✅✅");
        res.json(updatedBook)
    })
    .catch(err=>{
        console.log("FAILED TO UPDATE ❌❌❌");
        res.json(err)
    })
}
//To add like 
module.exports.updateOneBookLike = (req, res) => {
    Book.findByIdAndUpdate(
      req.params.id,
      { $push: { likedBy: req.Token.firstName} },
      { new: true, runValidators: true }
    )
      .then((updatedBook) => {
        console.log("UPDATED ✅✅");
        res.json(updatedBook);
      })
      .catch((err) => {
        console.log("FAILED TO UPDATE ❌❌❌");
        res.json(err);
      });
  };

// to remove a like 
module.exports.updateOneBookUnlike = (req, res) => {
    const bookId = req.params.id;
    const userFirstName = req.Token.firstName;
  
    // Find the book by ID
    Book.findById(bookId)
      .then((book) => {
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
  
        // Remove the user from the book's likedBy array
        const updatedLikedBy = book.likedBy.filter((user) => user !== userFirstName);
        book.likedBy = updatedLikedBy;

        // Save the updated book
        return book.save();
      })
      .then((updatedBook) => {
        res.json(updatedBook);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while unfollowing the book' });
      });
  };
  
//Delete One Book 
module.exports.deleteBook = (request, response) => {
    Book.deleteOne({ _id: request.params.id }) 
        .then(deleteConfirmation => 
            {console.log(_id);
            response.json(deleteConfirmation);
        }
            )
        .catch(err => response.json(err))
}







