
const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get one user

router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});


// create a user

router.post('/', async (req, res) => {
    const password = JSON.stringify(req.body.password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
        name: req.body.name,
        password: hashedPassword
    });
    try {
       const newUser = await user.save();
       res.json(newUser);
    } 
    catch (err){
        res.status(402).json({ message: err.message });
    }
});

// login

router.post('/login/:id', getUser, async (req, res) => {
    try{
      if (await bcrypt.compare(JSON.stringify(req.body.password), res.user.password)){
          res.send('Success!');
      } else {
          res.send('Not Allowed');
      }
    }
    catch (err) {
        res.json({ message: err.message })
    }
});

// update a user

router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name !== null){
        res.user.name = req.body.name;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete a user

router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'User removed'});
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user === null) {
            return res.status(404).json({ message: "Cannot find user"});
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}



module.exports = router;
