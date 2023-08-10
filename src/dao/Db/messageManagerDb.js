const message = require('../models/messageModel'); 

async function saveMessage(user, messageContent) {
  try {
    const newMessage = new message({
      user,
      message: messageContent,
    });
    await newMessage.save();
  } catch (error) {
    console.error(error);
  }
}

async function getAllMessages() {
  try {
    const messageLogs = await message.find({});
    return messageLogs;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = {
  saveMessage,
  getAllMessages,
};
