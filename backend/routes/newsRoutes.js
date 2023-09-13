const express = require('express')
const router = express.Router()
const newsController = require('../controllers/newsController')
const verifyJWT = require('../middleware/verifyJWT')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../images/`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
  },
})

const upload = multer({ storage: storage })

router
  .route('/')
  .get(newsController.getAllNews)
  .post(verifyJWT, upload.single('file'), newsController.createNewNews)
  .patch(verifyJWT, upload.single('file'), newsController.updateNews)
  .delete(verifyJWT, newsController.deleteNews)

module.exports = router
