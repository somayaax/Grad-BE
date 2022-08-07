const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportComment: { type: String, required: true }
})
const lossSchema = new mongoose.Schema({
    lostBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    desc: { type: String, required: true  },
    location: { type: String, required: true  },
    image:  { type: String, required: true  },
    reportedBy: [reportSchema],
    isBlocked: { type: Boolean, default: 'false' },
}, {
    timestamps: true
})

const lossModel = mongoose.model('Loss', lossSchema);
module.exports = lossModel  