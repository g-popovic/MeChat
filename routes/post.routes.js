const router = require("express").Router();
const Post = require("../models/post.model");

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
	await Post.findByIdAndUpdate(req.params.postId, {
		$addToSet: { likes: req.body.myId }
	});
	res.send("Liked!");
});

// Unlike a post
router.post("/unlike/:postId", async (req, res) => {
	await Post.findByIdAndUpdate(req.params.postId, {
		$pull: { likes: req.body.myId }
	});
	res.send("Unliked!");
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
	res.send(await Post.find().limit(20));
});

// Experiment
router.get("/test", async (req, res) => {
	const post = await Post.findOne();
	const author = await post.author;
	res.send(author);
});

module.exports = router;
