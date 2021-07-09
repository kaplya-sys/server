const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/users.model');
const upload = require('../middleware/upload');

router.post('/:id',
    passport.authenticate("jwt", {session: false}),

    async (req, res) => {
        try {
            const profile = await User.findById(req.params.id);
            res.status(200).json({
                username: profile.username,
                email: profile.email,
                avatar: profile.imageSrc
            });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
})

router.patch('/:id',
    passport.authenticate('jwt', {session: false}),

    upload.single('avatar'),

    async (req, res) => {
        const {username, email, password} = req.body;
        let update = {}
        if (req.body) {
            if (username) {
                const newUsername = await User.findOne({username});
                if (newUsername) {
                    res.status(409).json({
                        message: 'Данный логин занят'
                    })
                } else {
                    update.username = username
                }
            }
            if (email) {
                const newEmail = await User.findOne({email});
                if (newEmail) {
                    res.status(409).json({
                        message: 'Данный email занят'
                    })
                } else {
                    update.email = email
                }
            }
            if (password) {
                const salt = bcrypt.genSaltSync(10);
                update.password = bcrypt.hashSync(password, salt)
            }
        }
        if (req.file) {
            update.imageSrc = req.file.path
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {$set: update}, {new: true})
            res.status(201).json({
                message: 'Данные пользователя изменены',
            });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
})

module.exports = router;