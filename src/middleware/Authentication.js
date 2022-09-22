const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel")


// =========================================== Authentication ================================

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "Enter token in header" });
        jwt.verify(token, "JyotiVinayikaRajnigandha50groupsecretkey", function (error, decoded) {
            if (error) return res.status(401).send({ status: false, msg: "Invalid Token" });
            else
                req.BookId = decoded.BookId;
            next()
        });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


// ================================ Authorization ================================


const authorization = async function (req, res, next) {
    try {
        let BookId = req.params.bookId;
        if (BookId) {
            let findBook = await bookModel.findById(BookId);
            if (!findBook)
                return res.status(403).send({ status: false, msg: "book is not available" });
            if (req.BookId != findBook.bookId)
                return res.status(403).send({ status: false, msg: "user is not authorized to access this book" });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, msg: error.message });
    }
};



module.exports = { authentication, authorization }