const { Router } = require('express')
const passport = require('passport')
const { authToken } = require('../utils/jwt')
const UsersController = require('../controllers/usersControllers')

const sessionRouter = new Router()
const usersController = new UsersController()

sessionRouter.get('/', usersController.sessions.bind(usersController))
sessionRouter.post('/register', passport.authenticate('register',
  { failureRedirect:'/failregister', failureFlash: true }), usersController.register.bind(usersController))
sessionRouter.post('/login',  passport.authenticate('login',
  { failureRedirect: '/faillogin', failureFlash: true}), usersController.login.bind(usersController))
sessionRouter.post('/recovery_password', usersController.recoveryPassword.bind(usersController))
sessionRouter.get('/restore_password/:token', usersController.restorePassword.bind(usersController))
sessionRouter.post('/restore_password/:token', usersController.restorePassword.bind(usersController))
sessionRouter.get('/failregister', usersController.failRegister.bind(usersController))
sessionRouter.get('/faillogin', usersController.failLogin.bind(usersController))
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), usersController.github.bind(usersController))
sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), usersController.githubCallback.bind(usersController))
sessionRouter.get('/current', authToken, usersController.current.bind(usersController))

module.exports = sessionRouter
