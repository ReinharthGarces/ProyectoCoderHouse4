// const CartsManager = require('../dao/fs/cartsManager')
const passport = require('passport')
const userModel = require('../dao/models/userModel')
const passportLocal = require('passport-local')
const { createHash, isValidPassword } = require('../utils/passwordHash')
const { generateToken } = require('../utils/jwt')
const CartsManager = require('../dao/Db/cartsManagerDb')
const cartsManager = new CartsManager()
const LocalStrategy = passportLocal.Strategy
const GitHubStrategy = require('passport-github2');


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
          console.log('email ya registrado')
          return done(null, false)
        }  

        const body = req.body
        body.password = await createHash(body.password)
        
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

        const token = generateToken(user)
        user.token = token

        if (!user.cart) {
          const newCart = await cartsManager.createCart();
          await userModel.updateOne({ _id: user._id }, { cart: newCart._id });
        }

        return done(null, user)
      } catch (e) {
        return done(e)
      }
    }
  ))

  passport.serializeUser((user, done) => {
    try {
      done(null, user._id)
    } catch (error) {
      done(error);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id).populate('cart');
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initializePassport
