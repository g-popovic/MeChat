const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");

// Image uploading
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		console.log(path.extname(file.originalname));

		cb(null, req.session.userId + "-avatar" + path.extname(file.originalname));
	}
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
const upload = multer({
	storage: storage,
	limits: { fileFilter: 1024 * 1024 },
	fileFilter: fileFilter
});

// ################################# ROUTES #################################

// TODO: Add authentication check for routes that require it

// Register a new user
router.post("/register", async (req, res) => {
	try {
		const username = req.body.username;
		const password = await bcrypt.hash(req.body.password, 10);

		const newUser = new User({
			username: username,
			password: password
		});

		await newUser.save();

		req.session.myId = newUser._id;
		req.session.avatar = newUser.avatar;

		res.status(200).send("Logged in as " + username);
	} catch (err) {
		if (err.code === 11000) res.status(400).send("Username already taken.");
		else res.send(err);
	}
});

// Login
router.post("/login", async (req, res) => {
	username = req.body.username;
	password = req.body.password;

	const user = await User.findOne({ username: username });
	if (!user) res.status(404).send("Incorrect username.");

	if (await bcrypt.compare(password, user.password)) {
		req.session.myId = user._id;
		req.session.userAvatar = user.avatar;

		res.status(200).send("Logged in as " + username);
	} else {
		res.status(401).send("Incorrect password.");
	}
});

router.get("/profile/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) res.status(404).send("User not found.");
		res.send(user);
	} catch (err) {
		res.send(err);
	}
});

// Send friend request
router.post("/send-request/:userId", async (req, res) => {
	const myId = req.body.myId;
	const otherUserId = req.params.userId;

	// Check if users are already friends or pending
	const me = await User.findById(myId);
	if (Boolean(me.friends.find(friend => String(friend.userId) === otherUserId))) {
		res.status(400).send("Can't send request.");
		return;
	}

	// Send request
	await Promise.all([
		User.findByIdAndUpdate(myId, {
			$push: {
				friends: {
					userId: otherUserId,
					status: "pending",
					sentByMe: true
				}
			}
		}),
		User.findByIdAndUpdate(otherUserId, {
			$push: {
				friends: {
					userId: myId,
					status: "pending",
					sentByMe: false
				}
			}
		})
	]);

	res.send("Friend request sent!");
});

// Accept friend request
router.post("/accept/:userId", async (req, res) => {
	const myId = req.body.myId;
	const otherUserId = req.params.userId;

	// Validate friend request
	const me = await User.findById(myId);
	const otherUser = me.friends.find(friend => String(friend.userId) === otherUserId);

	if (!Boolean(otherUser) || otherUser.sentByMe || otherUser.status !== "pending") {
		res.status(400).send("Can't accept request.");
		return;
	}

	// If request is valid, update Me & otherUsers friends fields
	const result = await Promise.all([
		User.updateOne(
			{ _id: otherUserId, "friends.userId": myId },
			{ $set: { "friends.$.status": "friends" } }
		),
		User.updateOne(
			{ _id: myId, "friends.userId": otherUserId },
			{ $set: { "friends.$.status": "friends" } }
		)
	]);

	res.send(result);
});

// Delete friend
router.post("/unfriend/:userId", async (req, res) => {
	const myId = req.body.myId;

	const [user, me] = await Promise.all([
		User.updateOne({ _id: req.params.userId }, { $pull: { friends: { userId: myId } } }),
		User.updateOne({ _id: myId }, { $pull: { friends: { userId: req.params.userId } } })
	]);

	if (user.nModified === 0 || me.nModified === 0) {
		res.status(404).send("User not in friends list.");
		return;
	}

	res.send("Deleted.");
});

// Get friends list
router.get("/friends", async (req, res) => {
	const myId = req.body.myId;

	const friendIds = (await User.findById(myId)).friends;

	// const friends = await User.find({
	// 	_id: { $in: [friendIds.map(friendId => friendId.userId)] },
	// 	status: "friends"
	// });

	res.send(friendIds);
});

// Search for a user
router.get("/find/:userId", async (req, res) => {
	const regex = new RegExp(
		req.params.userId.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\&&"),
		"gi"
	);
	const users = await User.find({ username: regex }).limit(10);
	res.send(users);
});

// Upload an avatar for a user
router.post("/avatar", upload.single("avatar"), async (req, res) => {
	const result = await User.updateOne({ _id: req.session.id }, { avatar: req.file.path });
	res.send(result);
});

// Remove profile picture
router.delete("/avatar", async (req, res) => {
	const result = await User.updateOne(
		{ _id: req.session.id },
		{ avatar: "default-avatar.svg" }
	);
	res.send(result);
});

// Get all users in the database
router.get("/all", (req, res) => {
	User.find()
		.then(users => res.send(users))
		.catch(err => res.send(err));
});

module.exports = router;
