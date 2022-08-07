const express = require('express');
const path = require('path');
const cors = require('cors')
const { nanoid } = require('nanoid')
const multer = require('multer')
const connectDB = require('./DB/connectDB');
require('dotenv').config();
const userRouter = require('./modules/user/user.router')
const lossRouter = require('./modules/loss/loss.router')
const foundRouter = require('./modules/found/found.router');
const app = express()
const port = process.env.PORT;

app.use(express.json());

/////////////////////////////////handle images
app.use('/uploadImages', express.static(path.join(__dirname, 'uploadImages')))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadImages')
    },
    filename: function (req, file, cb) {

        cb(null, nanoid() + "_" + file.originalname)
    }
})
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)

    } else {
        cb('sorry invalid ex', false)
    }
}
const upload = multer({ dest: 'uploadImages/', fileFilter, storage })
app.use(upload.single('image'))
//////////////////////////////////////////////////////////////////////
app.use(cors())
app.use(userRouter, lossRouter, foundRouter)
connectDB()
app.listen(port, () => {
    console.log(`running on port ${port}`);
})