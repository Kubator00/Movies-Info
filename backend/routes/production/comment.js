const Comment = require("../../database/models/CommentModel");
const User = require("../../database/models/UserModel");
const express = require("express");
const router = express.Router();
const userAuthorization = require('../../components/userAuthorization')

router.get('/', async (req, res) => {
    let {page = 1, pageSize = 4} = req.query;
    let result = [];
    try {
        const numberOfComments = await Comment.count({productionId: req.query.productionId});
        const comments = await Comment.find({productionId: req.query.productionId})
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(pageSize)
            .sort({'date': -1})
            .select("content date userId");
        for (let a of comments) {
            let user = await User.findById(a.userId).select("login");
            result.push({userLogin: user.login, ...a._doc});
        }
        res.send({comments: result, numberOfComments: numberOfComments});
    } catch (err) {
        console.error(err)
        res.status(500).send('Error occurred')
    }

})

//need authorization
router.use(userAuthorization)

router.delete('/', async (req, res) => {
    try {
        await Comment.deleteOne({_id: req.body.commentId});
    } catch (err) {
        res.status(500).send('Error occurred')
    }
    res.send('Success');
})


router.post('/add', async (req, res) => {
    const {userId} = req.headers;
    if(!userId)
        return;
    const comment = new Comment({
        productionId: req.body.productionId,
        userId: userId,
        content: req.body.content,
        date: new Date()
    });
    try {
        await comment.save();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred')
    }
    res.send('success');
})


module.exports = router;