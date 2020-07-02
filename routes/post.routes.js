const router = require("express").Router();
const Post = require("../models/post.model");

// Create a new post
router.post("/new-post", async (req, res) => {
	const myId = req.body.myId;

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

// Get all posts
router.get("/all", async (req, res) => {
	const posts = await Post.find().limit(20);

	res.send(posts);
});

module.exports = router;
