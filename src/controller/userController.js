const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

// ======================== user register =============================
const createUser = async function(req, res){
    try {
        const data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }

        
        const titleData = data.title;
        if(!isValid(titleData)) return res.status(400).send({status:false, message:"title is mandatory in the request"})
        if (!["Mr", "Mrs", "Miss"].includes(titleData)) return res.status(400).send({status:false, message: "title should be Mr, Mrs, Miss" });

        const nameData = data.name;
        if(!isValid(nameData)) return res.status(400).send({status:false, message:"name is mandatory in the request"})
        if (!nameData.match(/^(?![\. ])[a-zA-Z\. ]+(?<! )$/)) return res.status(400).send({status:false, message: "name should be in alphabets" })
        
        const phone = data.phone;
        if(!isValid(phone)) return res.status(400).send({status:false, message:"phone number is mandatory in the request"})
        if (!phone.match(/^((0091)|(\+91)|0?)[6789]{1}\d{9}$/)) return res.status(400).send({status:false, message: "phone number should be of 10 digits" })

        const emailData = data.email;
        if(!isValid(emailData)) return res.status(400).send({status:false, message:"email is mandatory in the request"})
        if (!emailData.match(/^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/)) return res.send({status:false, message: "email is not valid" });

        const passwordData = data.password;
        if(!isValid(passwordData)) return res.status(400).send({status:false, message:"password is mandatory in the request"})
        if (!passwordData.match(/^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,99}$/)) return res.send({status:false, message: "password is mandatory in the request with alphanumerical,higher-lower case values" });


       
        let savedData = await userModel.create(data);
        res.status(201).send({ status: true, message:"Success", data: savedData})

} catch (error) {
    console.log(error); res.status(500).send({status:false, message: error.message });

}
}




// ================================= User Login ====================================

const loginUser = async function (req, res){
    try {

        let email = req.body.email;
        let password = req.body.password;
        if (!(email && password)){
            return res.status(400).send({ status: false, message: "please provide emailid and password" })
        }
        
        
        let user = await userModel.findOne({ email: email, password: password });
        if (!user){
            return res.status(404).send({ status: false, message: "user not found" })
        }
        const token = jwt.sign({
            userId: user._id.toString()
            
        },
            "JyotiVinayikaRajnigandha50groupsecretkey",
            {
                expiresIn: '24hr'
            }
        );
       res.status(201).send({ status: true, message:"Success", token: token});
    } catch (error) {
        res.status(500).send({status: false, error: error.message })
    }
};




module.exports = {createUser,loginUser}