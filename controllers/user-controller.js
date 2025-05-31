const bcrypt = require("bcrypt")
const jdenticon = require('jdenticon')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')

const UserModel = require('../models/user-model')
const UserDto = require('../dtos/user-dto')
const { handleServerError } = require('../utils/error-debug');
const MailController = require("./mail-controller");
const CoinGecko = require('./CoinGecko-controller');


class UserController {
    async register(req, res) {

        const { email, password, name } = req.body

        try {
            if (!email || !password || !name) {
                return res.status(400).json({
                    error: 'Все поля являются обязательными'
                })
            }

            const condidate = await UserModel.findOne({ email })
            if (condidate) {
                return res.status(400).json({
                    error: `Пользователь уже существует`
                })
            }
            //hash pass + avatar
            const hashedPass = await bcrypt.hash(password, 7)
            const png = jdenticon.toPng(`${name}_${Date.now()}`, 200)
            const avatarName = `${name}_${Date.now()}.png`
            const avatarPath = path.join(__dirname, '/../uploads', avatarName)
            fs.writeFileSync(avatarPath, png)

            //acvtivationLink 
            const activationLink = uuidv4();


            const user = await UserModel.create({
                name,
                email,
                password: hashedPass,
                activationLink,
                avatarUrl: `/uploads/${avatarName}`
            })

            await MailController.sendActivationMail(email, name, `${process.env.API_URL}/api/activate/${activationLink}`)

            const userDto = new UserDto(user)

            res.send({ user: userDto })

        } catch (error) {
            handleServerError(res, error, 'register')
        }
    }
    async login(req, res) {

        const { email, password } = req.body

        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                return res.status(400).json({ error: 'Неверный логин или пароль' })
            }
            if (!user.isActivated) {
                return res.status(400).json({ error: 'Вам нужно активировать аккаунт из сообщения на почте' })
            }
            const isPassValid = await bcrypt.compare(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({ error: 'Неверный логин или пароль' })
            }

            const userDto = new UserDto(user)
            const token = jwt.sign({ ...userDto }, process.env.JWT_SECRET)

            res.send({ user: userDto, token })

        } catch (error) {
            handleServerError(res, error, 'login')
        }
    }
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await UserModel.findOne({ _id: id })
            const userDto = new UserDto(user)

            res.send(userDto)
        } catch (error) {
            handleServerError(res, error, 'getUserById')
        }
    }
    async activate(req, res) {
        try {
            const { link } = req.params;

            const user = await UserModel.findOne({ activationLink: link })
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' })
            }


            user.isActivated = true;
            await user.save()
            res.redirect(process.env.CLIENT_URL + '/auth')

        } catch (error) {
            handleServerError(res, error, 'activate')
        }
    }
    async current(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.user.id })

            if (!user) {
                return res.status(400), json({ error: 'Не удалось найти пользователя' })
            }

            res.send(user)
        } catch (error) {
            handleServerError(res, error, 'current')
        }
    }
    async updateUser(req, res) {
        const { id } = req.params
        const { email, name, bio, location } = req.body
        if(req.user.id !== id) {
            return res.status(403).json({ error: 'Нет доступа' })
        }
        try {
            const user = await UserModel.findByIdAndUpdate(
                {_id: id},
                {
                    email: email || undefined,
                    name: name || undefined,
                    bio: bio || undefined,
                    location: location || undefined,
                }
            )
            const userDto = new UserDto(user)
            res.send(userDto)
        } catch (error) {
            handleServerError(res, error, 'updateUser')
        }
    }
    async addToWatchlist(req, res) {
        const { coin } = req.params

        const user = await UserModel.findOneAndUpdate({ _id: req.user.id }, 
            {$addToSet: {favoriteCoins: coin}}, 
            {new: true}
        )
        const userDto = new UserDto(user)
        res.send(userDto)
    }
    async deleteFromWatchlist(req, res) {
        const { coin } = req.params

        const user = await UserModel.findOneAndUpdate({ _id: req.user.id }, 
            {$pull: {favoriteCoins: coin}}, 
            {new: true}
        )
        const userDto = new UserDto(user)
        res.send(userDto)
    }
}
module.exports = new UserController()