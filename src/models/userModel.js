const mongoose =require("mongoose")

const userSchema =  mongoose.Schema({ 
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: true ,
        trim:true
    },
    name: {
        type:String,
        required: true,
        trim:true
        },
    phone: {
        type:String,
        required: true,
        unique: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
  address: {
      street: {type: String},
      city: {type: String},
      pincode: {type: String}
    
      
    }
  },{timestamps: true})

  module.exports = mongoose.model("User", userSchema);