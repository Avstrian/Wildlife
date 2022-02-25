const { isUser, isGuest } = require('../middleware/guards');
const { register, login } = require('../services/user');
const { mapErrors } = require('../util/mappers');

const router = require('express').Router();

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Wildlife - Login' });
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        const errors = mapErrors(err)
        res.render('login', { title: 'Wildlife - Login', data: { email: req.body.email }, errors })
    }
})

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Wildlife - Register' });
});

router.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.password == '') {
            throw new Error('Password is required');
        }

        if (req.body.password != req.body.repass) {
            throw new Error('Passwords dont match');
        }

        const user = await register(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        };

        const errors = mapErrors(err)
        res.render('register', { title: 'Wildlife - Regiser', data, errors })
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
})

module.exports = router;