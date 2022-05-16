const Joi = require('@hapi/joi')
const User = require('../model/signup-signin-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// const {check} = require('express-validator')

exports.setIndex = (req,res) =>{
    res.send('backend is running')
}

exports.signUp = async (req,res) =>{
    const emailExist = await User.findOne({email: req.body.email})

    if(emailExist){
        res.status(400).send("Email already exists")
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword,salt)

    const user = new User({
        username:req.body.username,
        email:req.body.email,
        adress:req.body.adress,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword
    })

    try {

        const registrationSchema = Joi.object({
            username: Joi.string().min(3).required(),
            email: Joi.string().min(3).required().email(),
            adress: Joi.string().min(3).required(),
            password: Joi.string().min(8).required(),
            confirmPassword: Joi.string().min(8).required()
        })

        const {error} = await registrationSchema.validateAsync(req.body)

        if(error){
            res.status(400).send(error.details[0].message)
            return;
        }else{
            if(hashedPassword === hashedConfirmPassword){
                const user = new userData({
                    username: req.body.name,
                    email: req.body.email,
                    adress: req.body.adress,
                    password: hashedPassword,
                    confirmPassword: hashedConfirmPassword
                })

            const saveUser = await user.save()
            res.status(200).send("user created successfully")
        }else{ 
            res.send('Password doesnot match ')
        }
    }


    } catch (error) {      // server error
        res.status(500).send(error)
    }

}


exports.logIn = async (req,res) => {
    // VERIFY WHETHER EMAIL EXISTS OR NOT
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send("Incorrect Email ID")

    // CHECKING IF USER PASSWORD MATCHES OR NOT
    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword) return res.status(400).send("Incorrect Password")

    // checking for confrim password
     
    // const confirmPassword = await (req.body.confirmPassword, user.confirmPassword)
    // if(password !== confirmPassword){
    //     throw new Error('Passwords must be same')
    //   }

    try{
        const loginSchema = Joi.object({
            email: Joi.string().min(3).required().email(),
            password: Joi.string().min(8).required()
           
        })

        const {error} = await loginSchema.validateAsync(req.body)

        if(error) return res.status(400).send(error.details[0].message)
        else{
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            
            res.header("auth-token", token).send(token)
            res.send("Logged in successfully")
        }
    }catch(error){
        res.status(500).send(error)
    }
}


exports.getAllUsers = async (req,res) => {
    const allUsers = await User.find()
    try{
        res.status(200).send(allUsers)
    }catch(error){
        res.status(500).send(error)
    }
}