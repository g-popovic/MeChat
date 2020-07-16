const router = require("express").Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// Create a new post
router.post("/new-post", async (req, res) => {
	const myId = req.session.myId;

	if (!myId) {
		res.status(401).send("You need to login first.");
	}

	const newPost = new Post({
		content: req.body.content,
		author: myId
	});

	const result = await newPost.save();

	res.send(result);
});

// Like a post
router.post("/like/:postId", async (req, res) => {
	if (req.session.myId) {
		res.send(
			await Post.findByIdAndUpdate(req.params.postId, {
				$addToSet: { likes: req.session.myId }
			})
		);
	} else {
		res.status(401).send("You need to login");
	}
});

// Unlike a post
router.post("/unlike/:postId", async (req, res) => {
	if (req.session.myId) {
		res.send(
			await Post.findByIdAndUpdate(req.params.postId, {
				$pull: { likes: req.session.myId }
			})
		);
	} else {
		res.status(401).send("You need to login");
	}
});

// Get all posts from a specific user
router.get("/author/:userId", async (req, res) => {
	try {
		const result = await Post.find({ author: req.params.userId }).limit(20);

		if (!result) throw new Error(404, "User not found.");

		res.send(result);
	} catch (err) {
		res.send(err);
	}
});

// Get all posts
router.get("/all", async (req, res) => {
	const posts = await Post.find().limit(20);
	const authorIDs = posts.map(post => post.author);
	const authors = await User.find({ _id: { $in: authorIDs } });
	const postsAndAuthors = posts.map(post => {
		return {
			authorId: post.author,
			postId: post._id,
			authorName: authors.find(
				author => author._id.toString() === post.author.toString()
			).username,
			authorAvatar: authors.find(
				author => author._id.toString() === post.author.toString()
			).avatar,
			content: post.content,
			likes: post.likes,
			date: post.createdAt
		};
	});
	res.send(postsAndAuthors);
});

module.exports = router;
