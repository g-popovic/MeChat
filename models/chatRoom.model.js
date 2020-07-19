const mongoose = require("mongoose");

const messageSchema = {
	text: String,
	author: String
};

const chatRoomSchema = new mongoose.Schema({
	messages: [messageSchema]
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
