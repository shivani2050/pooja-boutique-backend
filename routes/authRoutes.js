const express = require("express")

const {RegisterUser,UserLogin}= require("../controllers/authController");
const router = express.Router()

router.post("/register", RegisterUser)
router.post('/login', UserLogin)

module.exports = router;


