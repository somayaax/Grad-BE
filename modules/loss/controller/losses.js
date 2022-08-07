const sendEmail = require('../../../common/services/sendEmail');
const lossModel = require('../../../DB/models/loss');
const userModel = require('../../../DB/models/user');

const addPost = async (req, res) => {
    try {
        const { title, desc, location } = req.body;
        if (req.user.completed) {
            if (!req.file) {
                res.status(400).json({ message: "add image" })
            } else {
                const imgURL = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;
                const newPost = new lossModel({ title, desc, location, image: imgURL, lostBy: req.user._id });
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
        const posts = await lossModel.find({ isBlocked: false }).populate([{ path: "lostBy", select: "firstName lastName" }]);
        res.status(200).json({ message: "done", posts });
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const viewYourPosts = async (req, res) => {
    try {
        const posts = await lossModel.find({ lostBy: req.user._id }).populate([{ path: "lostBy", select: "firstName lastName" }]);
        res.status(200).json({ message: 'done', posts, user: req.user })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const viewUsersPosts = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        if (user) {
            const posts = await lossModel.find({ lostBy: user._id, isBlocked: false }).populate([{ path: "lostBy", select: "firstName lastName" }]);
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
        const post = await lossModel.findOne({ _id: id, isBlocked: false }).populate([{ path: "lostBy", select: "firstName lastName" }]);
        if (post) {
            if (post.lostBy._id.toString() !== req.user._id.toString()) {
                const findUser = post.reportedBy.find((ele) => {
                    return ele.userID.toString() == req.user._id.toString()
                })
                if (findUser) {
                    res.status(400).json({ message: "reported" })
                } else {
                    post.reportedBy.push({ userID: req.user._id, reportComment });
                    const updatedPost = await lossModel.findByIdAndUpdate(post._id, { reportedBy: post.reportedBy }, { new: true }).populate([{ path: "lostBy", select: "firstName lastName" }]);
                    res.status(200).json({ message: "done", post: updatedPost })
                }
            } else {
                res.status(400).json({message:"cannot report your own post"})
            }
        } else {
            res.status(400).json({ message: "post not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const viewReportedPosts = async (req, res) => {
    try {
        //find posts that were reported by any number of users reportedBy.0 equivelant to reportedBy[0]
        const posts = await lossModel.find({ isBlocked: false, "reportedBy.0": { "$exists": true } }).populate([{ path: "lostBy", select: "firstName lastName" },{path:"reportedBy.userID", select: "firstName lastName"}]);
        res.status(200).json({ message: "done", posts })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const blockPosts = async (req, res) => {
    try {
        const { id } = req.params
        const post = await lossModel.findOneAndUpdate({ _id: id, isBlocked: false, "reportedBy.0": { "$exists": true } }, { isBlocked: true }, { new: true })
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
        const post = await lossModel.findOneAndDelete({ _id: id, lostBy: req.user._id })
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
        const post = await lossModel.findOne({ _id: id, isBlocked: false }).populate([{ path: "lostBy", select: "firstName lastName" }]);
        if (post) {
            res.status(200).json({ message: "done", post })
        } else {
            res.status(400).json({ message: "error" })
        }
    } catch (error) {
        res.status(400).json({ message: "err try again" })
    }
}

const foundIt = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await lossModel.findOne({ _id: id, isBlocked: false }).populate([{ path: "lostBy", select: "email firstName lastName" }]);
        if (post) {
            const dest = post.lostBy.email;
            // console.log(dest);
            const msg = `<p> ${req.user.firstName} ${req.user.lastName} found your lost item <br>
            contact them at: </p>
            <p>email: ${req.user.email}</p>
            <p>phone: ${req.user.phone}</p>`
            sendEmail(dest, msg);
            res.status(200).json({ message: "done", post, foundBy: req.user })
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
    foundIt,
    getPostByID
}