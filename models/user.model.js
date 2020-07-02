const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		unique: true,
		ref: "User"
	},
	status: String,
	sentByMe: Boolean
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
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
