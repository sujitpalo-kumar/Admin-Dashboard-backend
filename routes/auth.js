const router = require('express').Router()
const { request } = require('express')
const Controller = require('../controller/User')
const verify = require('./authVerify')
const cors = require('cors');
const express = require('express')

router.post('/register', cors(),Controller.signUp)

router.post('/login', cors(),Controller.logIn)

router.get('/get_all', cors(),verify, Controller.getAllUsers)
module.exports = router