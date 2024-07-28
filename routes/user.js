const { Router } = require('express');
const { User } = require('../models/user');
const { verifyToken } = require('../services/authentication');
const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin');
});

router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.post('/signup', async (req, res) => {
    console.log('body:', req.body);
    const { fullName, email, password } = req.body;

    console.log(fullName, email, password);
    try {
        await User.create({
            fullName,
            email,
            password
        });
        return res.redirect('/');
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.verifyPasswordandGenerateToken(email, password);
        console.log('sign in succesful');
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        console.error('Signin error:', error.message);
        return res.render("signin", {
            error: 'Incorrect Mail or Password'
        });
    }
});

router.get('/logout', (req, res) => {
    return res.clearCookie('token').redirect('/');
})

module.exports = router;
