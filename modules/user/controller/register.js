const userModel = require('../../../DB/models/user');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../../common/services/sendEmail');
const bcrypt = require('bcrypt')
const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, gender } = req.body;
        const emailExists = await userModel.findOne({ email });
        if (emailExists) {
            res.status(400).json({ message: "email already exists!" })
        } else {
            const newUser = new userModel({ email, password, gender });
            const saveUser = await newUser.save();
            const token = jwt.sign({ id: saveUser._id }, process.env.SECRET_KEY, { expiresIn: 120 });
            const refreshToken = jwt.sign({ id: saveUser._id }, process.env.SECRET_KEY);
            const msg = `<a href = "${req.protocol}://${req.headers.host}/user/confirm/${token}">Confirm Email</a><br>
            <a href = "${req.protocol}://${req.headers.host}/user/resend/${refreshToken}">Resend Confirmation Link</a>`
            sendEmail(saveUser.email, msg);
            res.status(201).json({ message: "done", saveUser })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}
const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token || token == null || token == undefined) {
            res.status(400).json({ message: "token error" })
        } else {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await userModel.findOneAndUpdate({ _id: decoded.id, isVerified: false }, { isVerified: true }, { new: true });
            if (user) {
                res.status(200).json({ message: "done" })
            } else {
                if (user.isVerified) {
                    res.status(400).json({ message: "user already verified" })
                } else {
                    res.status(400).json({ message: "link invalid" })
                }
            }
        }

    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const resendEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token || token == null || token == undefined) {
            res.status(400).json({ message: "token error" })
        } else {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await userModel.findOne({ _id: decoded.id })
            if (user) {
                if (user.isVerified) {
                    res.status(400).json({ message: "user already verified" })
                } else {
                    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: 120 });
                    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
                    const msg = `<a href = "${req.protocol}://${req.headers.host}/user/confirm/${token}">Confirm Email</a><br>
                <a href = "${req.protocol}://${req.headers.host}/user/resend/${refreshToken}">Resend Confirmation Link</a>`
                    sendEmail(user.email, msg);
                    res.status(201).json({ message: "done" })
                }
            } else {
                res.status(400).json({ message: "link invalid" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await userModel.findOne({ email });
        if (findUser) {
            if (findUser.isVerified) {
                const match = await bcrypt.compare(password, findUser.password);
                if (match) {
                    const token = jwt.sign({ id: findUser._id , role: findUser.role}, process.env.SECRET_KEY)
                    res.status(200).json({ message: "done", token })
                } else {
                    res.status(400).json({ message: "password incorrect" })
                }
            } else {
                res.status(400).json({ message: "please verify your email" })
            }
        } else {
            res.status(400).json({ message: "email incorrect" })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}

module.exports = {
    signUp,
    confirmEmail,
    resendEmail,
    signIn
}