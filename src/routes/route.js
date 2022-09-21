const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")


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
router.post ("/books", bookController.createBook)


// ====================== Get Book API ======================
router.get ("/books",bookController.getBooks)


// ====================== Get Books by Book ID API ====================
router.get ("/books/:bookId",bookController.getBooksbyId )


// ====================== Update Books by Book id API ====================
router.put("/books/:bookId",bookController.updateBook)


// ====================== Delete Book by book id API ====================
router.delete ("/books/:bookId",)

//(Reviews Apis)
//============================= Add review api by books and book id ===========================
router.post("/books/:bookId/review",)


//================================ Update Review by books and book id =============================
router.put("/books/:bookId/review/:reviewId",)


//================================ Delete Review by books and book id =============================
router.delete("/books/:bookId/review/:reviewId",)


module.exports = router;
