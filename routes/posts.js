const express = require('express');
const Comments = require('../schemas/comment.js');
const Post = require('../schemas/post.js');
const router = express.Router();

router.get('/', async (req, res) => {
    let posts = await Post.find();
    const { postTitle, postAuthor, postDate, order } = req.query

    if (postTitle) {
        posts = posts.filter((post) => post.postTitle === postTitle);
    }
    if (postAuthor) {
        posts = posts.filter((post) => post.postAuthor === postAuthor);
    }
    if (postDate) {
        posts = posts.filter((post) => post.postDate === Number(postDate));
    }
    if (order === '1') {
        posts.sort((prev, present) => prev.postDate - present.postDate
        );
    }

    console.log(posts);
    //제목, 작성자명, 작성 날짜를 조회하기

    if (posts.length) {
        return res.json(posts);
    }

    res.status(400).json({
        success: false,
        errorMessage: '해당 조건의 게시글이 없습니다.'
    });
});

// /post/write
router.post('/write', async (req, res) => {
    const post = await Post.find();
    const postId = post[post.length - 1].postId + 1;
    const { postAuthor, postTitle, postBody } = req.body;

    const today = new Date();
    const month = today.getMonth() > 9 ? `${today.getMonth() + 1}` : `0${today.getMonth() + 1}`;
    const day = today.getDate() > 9 ? `${today.getDate()}` : `0${today.getDate()}`;
    const postDate = Number(`${today.getFullYear()}${month}${day}`);

    await Post.create({
        postId,
        postAuthor,
        postTitle,
        postBody,
        postDate
    });

    res.json({ success: true });
});

router.put('/write/:postId', async (req, res) => {
    const { postId } = req.params;
    const { postTitle, postAuthor, postBody } = req.body;

    await Post.updateOne({ postId: Number(postId) }, {
        $set: {
            postTitle,
            postAuthor,
            postBody
        }
    });
    res.json({ success: true })
});

router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    const [post] = await Post.find({ postId: Number(postId) });

    if (post) {
        return res.json(post);
    }
    res.status(400).json({
        success: false,
        errorMessage: '해당 게시글은 존재하지 않습니다.'
    });
});

module.exports = router;