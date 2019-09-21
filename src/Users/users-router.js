const express = require('express')
const path = require('path')
const AuthService = require('../auth/auth-service')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
      const { password, user_name } = req.body
      
      for (const field of ['user_name', 'password'])
        if (!req.body[field])
            return res.status(400).json({
            error: `Missing '${field}' in request body`
        })

        const passwordError = UsersService.validatePassword(password)
        
        if (passwordError){
            return res.status(400).json({ error: passwordError })
        }

        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
        .then(
            hasUserWithUserName => {
            if (hasUserWithUserName)
                return res.status(400).json({ error: `Username already taken` })
                
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                    const newUser = {
                        user_name,
                        password: hashedPassword,
                        // full_name,
                        // date_created: 'now()',
                    }
                     
            return UsersService.insertUser(
                req.app.get('db'),
                newUser
            )
            .then(user => {
            const sub = user.user_name
            const payload = { user_id: user.id }
            res
            .status(201)
            // .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json({...UsersService.serializeUser(user),
                authToken: AuthService.createJwt(sub, payload)
            })
            })
         })
    })
    .catch(next)
})

module.exports = usersRouter