const bcrypt = require('bcrypt')

const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10)
  return bcrypt.hashSync(password, salts)
}

const isValidPassword = async (password, hashedPassword ) => {
  console.log( hashedPassword, password)
  return bcrypt.compare( password, hashedPassword)
}

module.exports = {
  createHash,
  isValidPassword
}