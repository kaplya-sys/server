const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/users.model');

router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Введины не корректные данные: пароль не менее 6 символов'
                });
            }

            const {username, email, password} = req.body;
            const newUser = await User.findOne({email});
            if (newUser) {
                res.status(409).json({
                    message: 'Такой пользователь уже существует.'
                })
            } else {
                const salt = bcrypt.genSaltSync(10);
                const user = new User({
                    username: username,
                    email: email,
                    password: bcrypt.hashSync(password, salt)
                });
                await user.save().then(() => console.log('Пользователь создан'))
                res.status(201).json(user)
            }
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Введины не корректные данные'
                });
            }

            const {email, password} = req.body;
            const candidate = await User.findOne({email});
            if (candidate) {
                const passwordResult = bcrypt.compareSync(password, candidate.password);
                if (passwordResult) {
                    const token = jwt.sign({
                        email: candidate.email,
                        userId: candidate._id
                    }, config.get('jwt'), {expiresIn: 60 * 60});
                    res.status(200).json({
                        token: `Bearer ${token}`,
                        userId: candidate._id
                    });
                } else {
                    res.status(401).json({
                        message: "Введен не правильный пароль"
                    });
                }
            } else {
                res.status(404).json({
                    message: 'Пользователь с таким email не найден'
                });
            }
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    })


module.exports = router;