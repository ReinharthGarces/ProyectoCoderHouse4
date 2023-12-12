const { Router } = require('express')
const passport = require('passport')
const { authToken } = require('../utils/jwt')
const UsersController = require('../controllers/usersControllers')
const multerMiddleware = require('../middlewares/multerMiddleware')
const { upload } = require('../middlewares/multerMiddleware')

const sessionRouter = new Router()
const usersController = new UsersController()

sessionRouter.get('/', usersController.sessions.bind(usersController))
sessionRouter.get('/allusers', usersController.getAllUsers.bind(usersController))
sessionRouter.post('/register', passport.authenticate('register',
  { failureRedirect:'/failregister?error=user_dataError', failureFlash: true }), usersController.register.bind(usersController))
sessionRouter.post('/login',  passport.authenticate('login',
  { failureRedirect: '/faillogin?error=invalid_credentials', failureFlash: true}), usersController.login.bind(usersController))
sessionRouter.post('/recovery_password', usersController.recoveryPassword.bind(usersController))
sessionRouter.get('/restore_password/:token', usersController.restorePassword.bind(usersController))
sessionRouter.post('/restore_password/:token', usersController.restorePassword.bind(usersController))
sessionRouter.get('/failregister', usersController.failRegister.bind(usersController))
sessionRouter.get('/faillogin', usersController.failLogin.bind(usersController))
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), usersController.github.bind(usersController))
sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), usersController.githubCallback.bind(usersController))
sessionRouter.get('/current', authToken, usersController.current.bind(usersController))
sessionRouter.put('/premium/:uid', multerMiddleware.upload, usersController.changeUserRole.bind(usersController));
sessionRouter.put('/modify_role/:uid',  usersController.changeUserRole.bind(usersController));
sessionRouter.post('/:uid/documents',  multerMiddleware.upload, usersController.uploadDocuments.bind(usersController));
sessionRouter.delete('/clean_inactive_users', usersController.cleanInactiveUsers.bind(usersController))
sessionRouter.delete('/delete_users', usersController.deleteUser.bind(usersController))



module.exports = sessionRouter
