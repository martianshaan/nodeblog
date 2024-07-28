const { Router } = require('express');
const { Blog } = require('../models/blog');
const multer = require('multer')
const router = Router();
const path = require('path');
const marked = require('marked');
const { Comment } = require('../models/comments');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension)
    }
});

const upload = multer({ storage: storage })


router.get('/', (req, res) => {
    return res.render('addblog', {
        user: req.user
    })
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdby");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
        "createdby"
      );
    console.log(blog.createdby);
    blog.bodyHtml = marked.parse(blog.body);
    return res.render('blog', {
        user: req.user,
        blog: blog,
        comments
    })
})

router.post('/comment/:blogId', async (req, res) => {
    const { comment } = req.body;
    console.log('comment', comment);
    const t = await Comment.create({
        comment,
        createdby: req.user._id,
        blogId: req.params.blogId
    })

    return res.redirect(`/blog/${req.params.blogId}`)
})

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const file = req.file
    console.log(title, body, file);

    try {
        const blog = await Blog.create({
            title,
            body,
            createdby: req.user._id,
            coverImage: `/uploads/${req.file.filename}`
        })
        console.log('blog', blog);
        return res.redirect(`blog/${blog._id}`);
    } catch (error) {
        console.error('blog error:', error.message);
        return res.render("addblog", {
            error: 'error'
        });
    }
});
module.exports = router 