const mongoose = require("mongoose");

const messageSchema = {
	text: String,
	sentByMe: Boolean
};

const friendSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	status: String,
	sentByMe: Boolean,
	chatRoomID: { type: String, default: null },
	messages: [messageSchema]
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		index: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
		default: "default-avatar.svg"
	},
	friends: {
		type: [friendSchema],
		default: []
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
