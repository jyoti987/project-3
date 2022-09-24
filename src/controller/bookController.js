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

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is Required" })
        let titleCheck = await bookModel.findOne({ title: title })
        if (titleCheck) return res.status(400).send({ status: false, message: "title already exists" })

        if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "excerpt is Required" })
        if (!isValid(userId)) return res.status(400).send({ status: false, msg: "userId is Required" })

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "userId is invalid" })

        if (!isValid(ISBN)) return res.status(400).send({ status: false, msg: "ISBN is Required" })
        if (ISBN.length > 13 || ISBN.length < 13) return res.status(400).send({ status: false, message: "ISBN no must be of 13 digits" })
        let ISBNcheck = await bookModel.findOne({ ISBN: ISBN })
        if (ISBNcheck) return res.status(400).send({ status: false, message: "ISBN already exists" })

        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is Required" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, msg: "subcategory is Required" })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, msg: "releasedAt is Required" })

        let userID = await userModel.findById(userId)
        if (!userID) {
            return res.status(404).send({ status: false, msg: "userId is not valid" })
        }
        let savedData = await bookModel.create(data)
        res.status(201).send({status:true, message:"Success", savedData})



    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//====================getApi by Books=================

const getBooks = async function (req, res) {
    try {
        let data = req.query
        if (!isValidObjectId(data.userId)) return res.status(400).send({ status: false, msg: "userId is Invalid" })
        
        if (data.title || data.excerpt || data.ISBN || data.review || data.isDeleted) {
            return res.status(400).send({ status: false, message: "Only userId, category and subcategory are accepted" })

        }
        const check = await bookModel.find(data).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })

        

        if (check.length == 0)
            return res.status(404).send({ status: false, message: "No books found" });
        let sortingtitle = check.sort(function (a, b) { return a.title.localeCompare(b.title) })
       
        return res.status(200).send({ status: true, message: 'Books list', data: sortingtitle });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


//   =================================get book by id ========================================

const getBooksbyId = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) { return res.status(404).send({status:false, message:"Not a valid Book Id"}) }
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "bookId is invalid" })

        let Books = await bookModel.findById(bookId)

        if (!Books) { return res.status(404).send("No Book Found") }

        const reviewData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ __v: 0, isDeleted: 0, createdAt:0, updatedAt:0})

        const { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt } = Books
        let Output = {
            _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt, reviewData
        }
        res.status(200).send({ status: true, message: 'Books list', data: Output })

    }
    catch (error) {
        res.status(500).send({status:false, message:error.message});
    }
}


const updateBook = async function (req, res) {
    try {
        const data = req.body

        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "please provide a bookId" })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "bookId is invalid" })

        let books = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!books) return res.status(404).send({ status: false, message: "book not found" })


        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: "Body should not be empty" })

        titleInfo = await bookModel.findOne({ title: data.title })
        if (titleInfo) return res.status(400).send({ status: false, message: "title already used" })

        ISBNinfo = await bookModel.findOne({ ISBN: data.ISBN })
        if (ISBNinfo) return res.status(400).send({ status: false, message: "ISBN already used" })
        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: data }, { new: true });

        return res.status(200).send({ status: true, msg: updatedBook });
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


const deleteBookById = async function (req, res) {
    try {
        let BookId = req.params.bookId
        if (!BookId) { return res.status(404).send({status:false, message:"Kindly add Book ID"}) }

        if (!isValidObjectId(BookId)) return res.status(400).send({ status: false, msg: "bookId is invalid" })

        let Book = await bookModel.findOne({ _id: BookId, isDeleted: false })
        if (!Book) { return res.status(404).send({status:false, message:" Book not found"}) }

        await bookModel.findOneAndUpdate({ _id: BookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } })
        return res.status(200).send({ status: true, message: "book deleted successfully" })

    }
    catch (error) {
        res.status(500).send({status:false, message:error.message})
    }
}







module.exports = { createBook, getBooks, getBooksbyId, updateBook, deleteBookById }