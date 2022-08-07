const userModel = require('../../../DB/models/user');
const CryptoJS = require('crypto-js')
const viewProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
            res.status(200).json({ message: "done", user })
        
        
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

//view another user's profile
const viewUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select('-password');
        res.status(200).json({ message: "done", user })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const completeProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, faculty } = req.body;
        const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { firstName, lastName, phone , faculty, completed: true }, { new: true });
        if (user) {
            res.status(200).json({ message: "done", user })
        } else {
            res.status(400).json({ message: "an error occured please try again" })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const editProfile = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}



module.exports = {
    viewProfile,
    completeProfile,
    editProfile,
    viewUserProfile
}