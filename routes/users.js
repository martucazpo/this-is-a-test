const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');


router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.get('/dashboard', (req, res) => res.render('dashboard'));

router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all fields'
        });
    }

    //check passwords match
    if (password !== password2) {
        errors.push({
            msg: 'Password do not match'
        });
    }

    //check password length
    if (password.length < 6) {
        errors.push({
            msg: 'Please make password at least 6 characters long'
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation passes
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    //user exists
                    errors.push({
                        msg: 'Email is already registered'
                    });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //hash password

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hashed
                            newUser.password = hash;
                            //save user
                            console.log(newUser);
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg','You have joined us and are invited to log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                        });
                    })
                }
            });

    }

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;