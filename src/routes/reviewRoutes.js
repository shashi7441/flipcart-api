
const express = require('express')

const reviewRoutes = express.Router()
const{addReview} = require('../controller/reviewController') 
const {roleCheack} = require('../utility/role')
const{sellerTokenVarify} = require('../service/adminService')
const roles = "user"
reviewRoutes.post('/review' , sellerTokenVarify , roleCheack(roles), addReview )





module.exports = reviewRoutes