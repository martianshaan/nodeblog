require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const cookieParser = require('cookie-parser');

const { checkForAuthenticationValue } = require('./middlewares/authentication');
const { Blog } = require('./models/blog');

const app = express();

mongoose.connect(process.env.MONGODB_URL).then(() => console.log('Mongodb connected'));
mongoose.set('strictPopulate', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationValue("token"));
app.use(express.static(path.resolve('./public')))


const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    const allComments = await Blog.find({})
    return res.render('home', {
        user: req.user,
        blogs: allBlogs,
        comments: allComments
    })
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => console.log(`SERVER STARTED AT PORT:${PORT}`))