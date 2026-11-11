const express = require('express')

const {creatLeads,getLead, updateLeadStatus} = require('../controllers/leadController')
const {protect, adminOnly}= require("../middleware/authMiddleware")
const router = express.Router()


router.post('/',creatLeads)
router.get("/",protect,adminOnly, getLead);
router.patch("/:id/status" ,  protect, adminOnly, updateLeadStatus)

module.exports = router;