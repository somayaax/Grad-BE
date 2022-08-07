const resemble = require('resemblejs')
const lossModel = require('../../../DB/models/loss');
const foundModel = require('../../../DB/models/found');

const comparePics = async (req, res) => {
    try {
        const { id } = req.params;
        const foundPost = await foundModel.findOne({ _id: id, isBlocked: false, foundBy: req.user._id }).populate([{ path: "foundBy", select: "firstName lastName" }]);
        if (foundPost) {
            let cartona = [];
            const img = foundPost.image;
            const lostPosts = await lossModel.find({ isBlocked: false, lostBy: { $ne: req.user._id } }).populate([{ path: "lostBy", select: "firstName lastName" }]);
            lostPosts.forEach((post, i) => {
                let diff = resemble(img)
                    .compareTo(post.image).ignoreAntialiasing()
                    .onComplete(function (data) {
                        data.getBuffer()
                        cartona.push({
                            mismatch: data.misMatchPercentage,
                            postID: post._id,
                            img: post.image,
                            title: post.title,
                            desc: post.desc,
                            location: post.location,
                            firstName: post.lostBy.firstName,
                            lastName: post.lostBy.lastName,
                            userID: post.lostBy._id
                        })
                        if (i === lostPosts.length - 1) {
                            res.status(200).json({ message: "done", cartona })
                        }
                    });
                diff.scaleToSameSize()
            })
        } else {
            res.status(400).json({ message: 'post err' })
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}


module.exports = { comparePics }

      // for (let i = 0; i < lostPosts.length; i++) {
        //     const diff = resemble(img).compareTo(lostPosts[i].image)
        //             .onComplete(function (data) {
        //                 data.getBuffer()
        //                 // console.log(data);
        //                 cartona.push({
        //                     mismatch: data.misMatchPercentage,
        //                     postID: lostPosts[i]._id,
        //                     img: lostPosts[i].image,
        //                     title: lostPosts[i].title,
        //                     desc: lostPosts[i].desc,
        //                     location: lostPosts[i].location,
        //                     firstName: lostPosts[i].lostBy.firstName,
        //                     lastName: lostPosts[i].lostBy.lastName,
        //                     userID: lostPosts[i].lostBy._id
        //                 })
        //                 if (i == lostPosts.length - 1) {
        //                     res.status(200).json({ cartona })
        //                 }
        //             });
        //     diff.scaleToSameSize();
        // }