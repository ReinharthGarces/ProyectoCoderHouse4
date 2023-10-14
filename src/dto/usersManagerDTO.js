class UsersDTO {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.lastname = user.lastname;
    this.email = user.email;
    this.role = user.role;
  }
}

module.exports = UsersDTO;