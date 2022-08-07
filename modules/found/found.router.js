const auth = require('../../common/middleware/auth');
const handleValidation = require('../../common/middleware/validation');
const { addPost, getAllPosts, viewYourPosts, viewUsersPosts, reportPosts, viewReportedPosts, blockPosts, deletePost, getPostByID, myItem } = require('./controller/found');
const { comparePics } = require('./controller/searchImg');
const endPoint = require('./endPoint');
const { newPostValidator, idValidator, belongsToValidator, reportValidator } = require('./found.validator');
const router = require('express').Router();

//add new post
router.post('/found/post', auth(endPoint.addNewPost), newPostValidator, handleValidation(), addPost)

//get all posts
router.get('/found/posts', getAllPosts)
//view your posts
router.get('/found/posts/me', auth(endPoint.getAll), viewYourPosts);
//view another user's post by id
router.get('/found/posts/:id', auth(endPoint.getAll), idValidator, handleValidation(), viewUsersPosts);

//report any post by id
router.patch('/found/report/:id', auth(endPoint.reportPosts), reportValidator, handleValidation(), reportPosts)
//view all reported posts (only by admin)
router.get('/found/reported', auth(endPoint.getReported), viewReportedPosts)
//block reported post (only by admin)
router.patch('/found/block/:id', auth(endPoint.blockPosts), idValidator, handleValidation(), blockPosts)
//delete your post
router.delete('/found/delete/:id', auth(endPoint.delete), idValidator, handleValidation(), deletePost)

//get post by id
router.get('/found/:id',auth(endPoint.getAll), idValidator,handleValidation(), getPostByID)
//this item belongs to me
router.post('/my/item/:id', auth(endPoint.found), belongsToValidator, handleValidation(), myItem)

//compare image
router.post('/found/compare/:id',auth(endPoint.searchImgs),idValidator, handleValidation(),comparePics)


module.exports = router