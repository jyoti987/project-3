const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//(User Apis)
// ====================== Register  API ====================
router.post("/register",userController.createUser)  

// ====================== Login API ====================
router.post("/login",userController.loginUser)

//(Books Apis)
// ====================== Create Book API ====================
router.post ("/books", bookController.createBook)  //authentication


// ====================== Get Book API ======================
router.get ("/books", bookController.getBooks) //authentication


// ====================== Get Books by Book ID API ====================
router.get ("/books/:bookId", bookController.getBooksbyId) //authentication


// ====================== Update Books by Book id API ====================
router.put("/books/:bookId", bookController.updateBook)  //authorisation


// ====================== Delete Book by book id API ====================
router.delete ("/books/:bookId", bookController.deleteBookById) //authorisation

//(Reviews Apis)
//============================= Add review api by books and book id ===========================
router.post("/books/:bookId/review",reviewController.addReview) //authentication


//================================ Update Review by books and book id =============================
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview) //authorisation


//================================ Delete Review by books and book id =============================
router.delete("/books/:bookId/review/:reviewId",) //authorisation


module.exports = router;
