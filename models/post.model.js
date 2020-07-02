const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			minlength: 1,
			maxLength: 280
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
