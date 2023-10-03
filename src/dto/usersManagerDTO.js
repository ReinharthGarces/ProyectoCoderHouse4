class UsersDTO {
  constructor(users) {
    this._id = users._id;
    this.name = users.name;
    this.lastname = users.lastname;
    this.role = users.role;
    this.token = users.token;
  }
}

module.exports = UsersDTO;