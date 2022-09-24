const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}



const addReview = async function (req, res) {
    try {
        let data = req.body
        bookId = req.params.bookId
        Book = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean().select({ __v: 0, ISBN: 0 })
        if (!Book) {
            return res.status(404).send({ status: false, messge: "book of this BookId not found" })
        }
        let reviewCount = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()
        console.log(reviewCount)
        data["reviewedAt"] = Date.now()
        data["bookId"] = bookId


        let reviewDetails = await reviewModel.create(data)

        let Object = {
            _id: reviewDetails._id, bookId: reviewDetails.bookId,
            reviewedBy: reviewDetails.reviewedBy, reviewedAt: reviewDetails.reviewedAt,
            rating: reviewDetails.rating, review: reviewDetails.review
        }

        Book["reviewsData"] = Object
        Book["reviews"] = reviewCount
        await bookModel.findOneAndUpdate({_id:bookId, isDeleted:false}, {$set:{reviews:reviewCount}})

        return res.status(201).send({ status: true, message:"Success", data: Book })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const updateReview = async function (req, res) {
    try {
        let reviewId = req.params.reviewId
        let bookId = req.params.bookId

        let data = req.body
        let { review, rating, reviewedBy } = data


        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId must have 24 digits" })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "book not found" })
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, mssg: "reviewId must have 24 digits" })
        }

        let reviewID = await reviewModel.findById(reviewId)
        if (!reviewID) {
            return res.status(404).send({ status: false, message: "reviewID is not valid " })
        }




        if (!isValid(review)) {
            return res.status(400).send({ status: false, mssg: "review is Required" })
        }
        if (!isValid(rating)) {
            return res.status(400).send({ status: false, mssg: "rating is Required" })
        }
        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, mssg: "reviewedBy is Required" })
        }



        let reviewCount = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { reviewedBy, rating, review } }, { new: true }).select({ __v: 0, isDeleted: 0, createdAt: 0, updatedAt: 0 })

        let updatedBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, ISBN: 0 }).lean()

        updatedBook["reviewsData"] = updatedReview

        updatedBook["reviews"] = reviewCount

        return res.status(200).send({ status: true, data: updatedBook })

    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const deletedReview = async function (req, res) {
    try {
        let reviewId = req.params.reviewId
        let bookId = req.params.bookId


        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId must have 24 digits" })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "book not found" })
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, mssg: "reviewId must have 24 digits" })
        }

        let reviewID = await reviewModel.findOne({_id:reviewId, isDeleted:false})
        if (!reviewID) {
            return res.status(404).send({ status: false, message: "review not found" })
        }

        await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted:false }, { $set: { isDeleted: true } })
        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
        return res.status(200).send({ status: true, message: "Review deleted successfully" })







    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }



}
module.exports = { addReview, updateReview, deletedReview }