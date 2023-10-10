class MessagesDTO {
  constructor(message) {
    this.user = message.user;
    this.text = message.text;
  }
}

module.exports = MessagesDTO;