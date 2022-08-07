const auth = require('../../common/middleware/auth');
const handleValidation = require('../../common/middleware/validation');
const { addPost, getAllPosts, viewYourPosts, viewUsersPosts, viewReportedPosts, reportPosts, blockPosts, deletePost, foundIt, getPostByID } = require('./controller/losses');
const endPoint = require('./endPoint');
const { newPostValidator, idValidator, reportValidator } = require('./loss.validator');
const router = require('express').Router();

//add new post
router.post('/loss/post', auth(endPoint.addNewPost), newPostValidator, handleValidation(), addPost)
//get all posts
router.get('/loss/posts', getAllPosts)
//view your posts
router.get('/loss/posts/me', auth(endPoint.getAll), viewYourPosts);
//view another user's post by user id
router.get('/loss/posts/:id', auth(endPoint.getAll), idValidator, handleValidation(), viewUsersPosts);

//report any post by id
router.patch('/loss/report/:id', auth(endPoint.reportPosts), reportValidator, handleValidation(), reportPosts)
//view all reported posts (only by admin)
router.get('/loss/reported', auth(endPoint.getReported), viewReportedPosts)
//block reported post (only by admin)
router.patch('/loss/block/:id', auth(endPoint.blockPosts), idValidator, handleValidation(), blockPosts)
//delete your post
router.delete('/loss/delete/:id', auth(endPoint.delete), idValidator, handleValidation(), deletePost)

//get post by id
router.get('/loss/:id', auth(endPoint.getAll), idValidator, handleValidation(), getPostByID)
//i found your item
router.post('/loss/found/item/:id', auth(endPoint.found), idValidator, handleValidation(), foundIt)

module.exports = router