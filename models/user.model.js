const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	status: String,
	sentByMe: Boolean,
	chatRoomId: { type: String, default: null }
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
		default: "default-avatar.jpg"
	},
	friends: {
		type: [friendSchema],
		default: []
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
