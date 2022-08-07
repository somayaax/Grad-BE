const sendEmail = require('../../../common/services/sendEmail');
const foundModel = require('../../../DB/models/found');
const userModel = require('../../../DB/models/user');
const addPost = async (req, res) => {
    try {
        const { title, desc, location } = req.body;
        if (req.user.completed) {
            if (!req.file) {
                res.status(400).json({ message: "add image" })
            } else {
                const imgURL = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;
                const newPost = new foundModel({ title, desc, location, image: imgURL, foundBy: req.user._id });
                const savePost = await newPost.save()
                res.status(201).json({ message: "done", savePost })
            }
        } else {
            res.status(400).json({ message: "complete your profile first" })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}
const getAllPosts = async (req, res) => {
    try {
        const posts = await foundModel.find({ isBlocked: false }).populate([{ path: "foundBy", select: "firstName lastName" }]);
        res.status(200).json({ message: "done", posts });
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}
const viewYourPosts = async (req, res) => {
    try {
        const posts = await foundModel.find({ foundBy: req.user._id, isBlocked: false }).populate([{ path: "foundBy", select: "firstName lastName" }]);
        res.status(200).json({ message: 'done', posts })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const viewUsersPosts = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        if (user) {
            const posts = await foundModel.find({ foundBy: user._id, isBlocked: false }).populate([{ path: "foundBy", select: "firstName lastName" }]);
            res.status(200).json({ message: 'done', posts })
        } else {
            res.status(400).json({ message: "id incorrect" })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}
const reportPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportComment } = req.body;
        const post = await foundModel.findOne({ _id: id, isBlocked: false }).populate([{ path: "foundBy", select: "firstName lastName" }]);
        if (post) {
            if (post.foundBy._id.toString() !== req.user._id.toString()) {
                const findUser = post.reportedBy.find((ele) => {
                    return ele.userID.toString() == req.user._id.toString()
                })
                if (findUser) {
                    res.status(400).json({ message: "reported" })
                } else {
                    post.reportedBy.push({ userID: req.user._id, reportComment });
                    const updatedPost = await foundModel.findByIdAndUpdate(post._id, { reportedBy: post.reportedBy }, { new: true }).populate([{ path: "foundBy", select: "firstName lastName" }]);
                    res.status(200).json({ message: "done", post: updatedPost })
                }
            } else {
                res.status(400).json({message:"cannot report your own post"})
            }
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const viewReportedPosts = async (req, res) => {
    try {
        //find posts that were reported by any number of users reportedBy.0 equivelant to reportedBy[0]
        const posts = await foundModel.find({ isBlocked: false, "reportedBy.0": { "$exists": true } }).populate([{ path: "foundBy", select: "firstName lastName" },{path:"reportedBy.userID", select: "firstName lastName"}]);
        res.status(200).json({ message: "done", posts })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}
const blockPosts = async (req, res) => {
    try {
        const { id } = req.params
        const post = await foundModel.findOneAndUpdate({ _id: id, isBlocked: false, "reportedBy.0": { "$exists": true } }, { isBlocked: true }, { new: true })
        if (post) {
            res.status(200).json({ message: "done", post })
        } else {
            res.status(400).json({ message: "failed to block post" })
        }

    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await foundModel.findOneAndDelete({ _id: id, foundBy: req.user._id })
        if (post) {
            res.status(200).json({ message: "done" })
        } else {
            res.status(400).json({ message: "cant delete" })
        }

    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const getPostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await foundModel.findOne({ _id: id, isBlocked: false }).populate([{ path: "foundBy", select: "firstName lastName" }]);
        if (post) {
            res.status(200).json({ message: "done", post })
        } else {
            res.status(400).json({ message: "error" })
        }
    } catch (error) {
        res.status(400).json({ message: "err try again" })
    }
}

const myItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { desc } = req.body
        const post = await foundModel.findOne({ _id: id, isBlocked: false }).populate([{ path: "foundBy", select: "email firstName lastName" }]);
        if (post) {
            const dest = post.foundBy.email;
            if (req.file) {
                const imgURL = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;
                const msg = `<h2> ${req.user.firstName} ${req.user.lastName} thinks you have his/her item </h2>
                <p><strong>description:</strong> ${desc} <br>
                <strong>image:</strong> ${imgURL} <br>
                contact them if the item you have matches the description</p>
                <p><strong>email:</strong> ${req.user.email}<br>
                <strong>phone:</strong> ${req.user.phone}</p>`
                sendEmail(dest, msg);
                res.status(200).json({ message: "done", post, belongsTo: req.user })
            }else{
                const msg = `<h2> ${req.user.firstName} ${req.user.lastName} thinks you have his/her item </h2>
                <p><strong>description:</strong> ${desc} <br>
                contact them if the item you have matches the description</p>
                <p><strong>email:</strong> ${req.user.email}<br>
                <strong>phone:</strong> ${req.user.phone}</p>`
                sendEmail(dest, msg);
                res.status(200).json({ message: "done", post, belongsTo: req.user })
            }
           
        } else {
            res.status(400).json({ message: "err try again" })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

module.exports = {
    addPost,
    viewYourPosts,
    viewUsersPosts,
    getAllPosts,
    viewReportedPosts,
    reportPosts,
    blockPosts,
    deletePost,
    getPostByID,
    myItem
}