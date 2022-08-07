const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportComment: { type: String, required: true }
})
const foundSchema = new mongoose.Schema({
    foundBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    desc: { type: String },
    location: { type: String },
    image: String,
    reportedBy: [reportSchema],
    isBlocked: { type: Boolean, default: 'false' },
}, {
    timestamps: true
})
const foundModel = mongoose.model('Found', foundSchema);
module.exports = foundModel