const bcrypt = require("bcrypt")
const jdenticon = require('jdenticon')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const UserModel = require('../models/user-model')
const UserDto = require('../dtos/user-dto')
const {handleServerError} = require('../utils/error-debug')


const UserController = {
    register: async (req, res) => {
        try {
            const { email, password, name } = req.body

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

            const userDto = new UserDto(user)

            res.send({user: userDto})

        } catch (error) {
            handleServerError(res, error, 'register')
        }
    }
}

module.exports = UserController