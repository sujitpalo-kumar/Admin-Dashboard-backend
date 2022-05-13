const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email:{
        type: String,
        required: true,
        min: 6,
        max: 25
    },
    address:{
        type: String,
        required: true,
        min: 6,
        max: 200
    },
    password:{
        type: String,
        required: true,
        min: 8,
        max: 20
    },
    confirmPassword:{
        type: String,
        required: true,
        min: 8,
        max: 20
    }
})


module.exports= mongoose.model('userLogin',userSchema)