const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createBook = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body

        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is Required" })
        let titleCheck = await bookModel.findOne({ title: title })
        if (titleCheck) return res.status(400).send({ status: false, message: "title already exists" })

        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "excerpt is Required" })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "userId is Required" })

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId must have 24 digits" })

        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN is Required" })
        let ISBNcheck = await bookModel.findOne({ ISBN: ISBN })
        if (ISBNcheck) return res.status(400).send({ status: false, message: "ISBN already exists" })

        if (!isValid(category)) return res.status(400).send({ status: false, message: "category is Required" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "subcategory is Required" })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "releasedAt is Required" })

        let userID = await userModel.findById(userId)
        if (!userID) {
            return res.status(404).send({ status: false, message: "userId is not valid" })
        }

        let savedData = await bookModel.create(data)
        res.status(201).send(savedData)



    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//====================getApi by Books=================

const getBooks = async function (req, res) {
    try {
        let data = req.query
        // let regexData = /[a-zA-Z]*/.test(check)

        const check = await bookModel.find({ data }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
       // let sortingtitle= check.sort(data.title)
        if (check.length == 0)
            return res.status(404).send({ status: false, message: "No books found" });
            let sortingtitle= check.sort(function (a,b){return a.title.localeCompare(b.title)})
        return res.status(200).send({ status: true, message: 'Books list',data:sortingtitle });
      
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


//   =================================get book by id ========================================

const getBooksbyId = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) { return res.status(404).send("KINDLY ADD Book ID") }
        
         let Booklist = await bookModel.findById( bookId )
        
        if (!Booklist) { return res.status(404).send("No Book Found") }
        //if (Booklist.isDeleted == true) return res.status(404).send("Book is deleted")
        const  { _id, reviewedBy, reviewedAt, rating, review } = Booklist
        const reviewData = await reviewModel.find({bookId,isDeleted:false})
        const Bookdetail = { _id, reviewedBy, reviewedAt, rating, review ,Booklist,reviewData}
        res.status(200).send({ status: true, message: 'Books list', data: Bookdetail })

        }
    catch (error) {
        res.status(500).send(error.message);
    }
}







// =============================== Update book =======================================

const updateBook = async (req, res) => {
    try {
        const data = req.body;
        const bookId = req.params.bookId
        const { title, excerpt, releasedAt, ISBN } = data;

        // ------------------------data present or not or extra in the body-------------------------
        const objKey = Object.keys(data).length

        if (objKey == 0)
            return res.status(400).send({ status: false, message: "Please fill the mandatory data on the body" })

        if (objKey > 4)
            return res.status(400).send({ status: false, message: "You can't update extra field" });

        if (Object.values(data) == "")
            return res.status(400).send({ status: false, message: "Please fill value" })

        if (Object.keys(data) == "")
            return res.status(400).send({ status: false, message: "Please fill at least one key" })

        //----------------------finding book by id through params------------------------
        const book = await bookModel.findById(bookId);

        if (Object.values(book) == 0 || book.isDeleted == true)
            return res.status(404).send({ status: false, message: "Book not found" });

        //---------------------------------------- updating book --------------------------------------
        const updatedBook = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { title, excerpt, releasedAt, ISBN } }, { new: true });

        return res.status(200).send({ status: true, message: updatedBook });
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}





module.exports = { createBook, updateBook, getBooks, getBooksbyId }