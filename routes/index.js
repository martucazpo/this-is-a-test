
const router = require('express').Router();
//const User = require('../models/users');


router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;