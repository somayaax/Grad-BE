const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: String,
    phone: String,
    faculty: String,
    completed: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    profileLink: String,
    gender: { type: String, enum: ['male', 'female'] },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS));
    next();
})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel