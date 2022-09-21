const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

// ======================== user register =============================
const createUser = async function(req, res){
    try {
        const data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }

        
        const titleData = data.title;
        if (!data.title == "mr||mrs||miss") return res.status(400).send({ message: `title is mandatory in the request` });

        const NameData = data.name;
        if (!data.name.match(/^(?![\. ])[a-zA-Z\. ]+(?<! )$/)) return res.status(400).send({ message: "name is mandatory in the request" })
        
        const phone = data.phone;
        if (!data.phone.match(/^((0091)|(\+91)|0?)[6789]{1}\d{9}$/)) return res.status(400).send({ message: "phone is mandatory in the request" })

        const emailData = data.email;
        if (!data.email.match(/^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/)) return res.send({ message: "email is mandatory in the request" });

        const passwordData = data.password;
        if (!data.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,99}$/)) return res.send({ message: "password is mandatory in the request with alphanumerical,higher-lower case values" });


        const address = data.address;
        if (!data.address == "street"&&"city"&&"pincode") return res.status(400).send({ message: `address is mandatory in the request` });
        
        let savedData = await userModel.create(data);
        res.status(201).send({ status: true, data: savedData})

} catch (error) {
    console.log(error); res.status(500).send({ message: error.msg });

}
}




// ================================= User Login ====================================

const loginUser = async function (req, res){
    try {

        let email = req.body.email;
        let password = req.body.password;
        if (!(email && password))
            return res.status(400).send({ status: false, message: "please provide emailid and password", })
        if (!email.match(/^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/))
            return res.status(400).send({ status: false, message: "Wrong Email format" })
        if (!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,99}$/))
            return res.status(400).send({ status: false, message: "Wrong passowrd" })

        let user = await userModel.findOne({ email: email, password: password });
        if (!user)
            return res.status(400).send({ status: false, message: "email or the password is not corerct", });
        const token = jwt.sign({
            userId: user._id.toString(),
            // iat: Math.floor(Date.now() / 1000), // to get time in second
            // exp: Math.floor(Date.now() / 1000)+(60 * 60),// expire in hour
            email: user.email,
        },
            "JyotiVinayikaRajnigandha50groupsecretkey",
            {
                expiresIn: "24h"
            }
        );
       res.status(200).send({ status: true, message: 'Success', data: {token}});
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};




module.exports = {createUser,loginUser}
