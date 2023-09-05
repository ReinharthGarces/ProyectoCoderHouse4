const passport = require('passport')
const passportLocal = require('passport-local')
const userModel = require('../dao/models/userModel')
const { createHash, isValidPassword } = require('../utils/passwordHash')
const GitHubStrategy = require('passport-github2');
const LocalStrategy = passportLocal.Strategy
// require('dotenv').config();

const initializePassport = () => {
  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile);

    try{
    let user = await userModel.findOne({ login: profile._json.login })

    if (user) {
      console.log('Usuario ya existe')
      return done(null, user)
    }
    const newUser = await userModel.create({
      email: profile._json.login,
      name: profile._json.name,
    })
    console.log(user)
    console.log(newUser)
    return done(null, newUser);
  } catch (e) {
    return done(e);
  }
}));

  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username })
  
        if (user) {
          console.log('Usuario ya existe')
          return done(null, false)
        }  

        const body = req.body
        body.password = createHash(body.password)
        console.log({ body })
        
        const newUser = await userModel.create(body)
  
        return done(null, newUser)
      } catch (e) {
        return done(e)
      }
    }
  ))

  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        let user = await userModel.findOne({ email: email })

        if (!user) {
          console.log('El usuario no existe en el sistema')
          return done(null, false, { message: 'El usuario no existe en el sistema' })
        }

        if (!isValidPassword(password, user.password)) {
          return done(null, false, { message: 'Datos incorrectos' })
        }

        user = user.toObject()
        delete user.password

        done(null, user)
      } catch (e) {
        return done(e)
      }
    }
  ))

  passport.serializeUser((user, done) => {
    try {
      console.log('serializeUser')
      done(null, user._id)
    } catch (error) {
      done(error);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initializePassport


