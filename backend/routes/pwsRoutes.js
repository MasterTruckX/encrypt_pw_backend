const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getAllPws, getPwById, setPw, updatePw, deletePw } = require('../controllers/pwsControllers')

router.route('/').get(protect, getAllPws).post(protect, setPw)
router.route('/:id').get(protect , getPwById).put(protect, updatePw).delete(protect, deletePw)
module.exports = router