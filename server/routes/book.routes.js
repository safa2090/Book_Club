const BookController = require("../controllers/book.controller");
const { authenticate, isLoggedIn } = require('../config/jwt.config');

module.exports = app => {
    app.get("/api/books",authenticate,BookController.getAllBook); 
    app.post("/api/books",authenticate,BookController.createBook);
    app.get("/api/books/:id",authenticate,BookController.findOneSingleBook)
    app.delete("/api/books/:id",authenticate,BookController.deleteBook) 
    app.put("/api/books/:id",authenticate,BookController.updateOneBook)
    app.put("/api/books/:id/favorite",authenticate,BookController.updateOneBookLike)
    app.put("/api/books/:id/unfavorite",authenticate,BookController.updateOneBookUnlike)
}