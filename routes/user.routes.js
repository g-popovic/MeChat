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
		req.session.myAvatar = newUser.avatar;

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
	if (!user) res.status(401).send("Incorrect username.");

	if (await bcrypt.compare(password, user.password)) {
		req.session.myId = user._id;
		req.session.myAvatar = user.avatar;

		res.status(200).send("Logged in as " + username);
	} else {
		res.status(401).send("Incorrect password.");
	}
});

// Get someonse profile info
router.get("/profile/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) res.status(404).send("User not found.");
		user.password = undefined;
		res.send(user);
	} catch (err) {
		res.send(err);
	}
});

// Get ID & Avatar of currently logged in user
router.get("/status", (req, res) => {
	const data = {
		id: req.session.myId,
		avatar: req.session.myAvatar
	};
	if (data.id === undefined || data.avatar === undefined) {
		res.status(401).send("You need to login.");
	} else {
		res.send(data);
	}
});

// Send friend request
router.post("/send-request/:userId", async (req, res) => {
	const myId = req.session.myId;
	const otherUserId = req.params.userId;

	// Check if users are already friends or pending
	const me = await User.findById(myId);
	if (
		Boolean(me.friends.find(friend => String(friend.userId) === otherUserId))
	) {
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
	const myId = req.session.myId;
	const otherUserId = req.params.userId;

	// Validate friend request
	const me = await User.findById(myId);
	const otherUser = me.friends.find(
		friend => String(friend.userId) === otherUserId
	);

	if (
		!Boolean(otherUser) ||
		otherUser.sentByMe ||
		otherUser.status !== "pending"
	) {
		res.status(400).send("Can't accept request.");
		return;
	}

	// If request is valid, update Me & otherUsers friends fields
	const chatRoomId = otherUserId + "." + myId;

	const result = await Promise.all([
		User.updateOne(
			{ _id: otherUserId, "friends.userId": myId },
			{
				$set: {
					"friends.$.status": "friends",
					"friends.$.chatRoomId": chatRoomId
				}
			}
		),
		User.updateOne(
			{ _id: myId, "friends.userId": otherUserId },
			{
				$set: {
					"friends.$.status": "friends",
					"friends.$.chatRoomId": chatRoomId
				}
			}
		)
	]);

	res.send(result);
});

// Delete friend
router.post("/unfriend/:userId", async (req, res) => {
	const myId = req.session.myId;

	const [user, me] = await Promise.all([
		User.updateOne(
			{ _id: req.params.userId },
			{ $pull: { friends: { userId: myId } } }
		),
		User.updateOne(
			{ _id: myId },
			{ $pull: { friends: { userId: req.params.userId } } }
		)
	]);

	if (user.nModified === 0 || me.nModified === 0) {
		res.status(404).send("User not in friends list.");
		return;
	}

	res.send("Deleted.");
});

// Get a list of friends: each friend containing a username, avatar and id
router.get("/friends", async (req, res) => {
	const myId = req.session.myId;

	res.send(
		removeUserPassword(
			await User.find({
				_id: {
					$in: (await User.findById(myId)).friends.map(friend =>
						String(friend.userId)
					)
				}
			})
		)
	);
});

// Get pending friend requests
router.get("/requests", async (req, res) => {
	const myId = req.session.myId;

	if (!myId) {
		res.status(401).send("You need to login.");
	}

	res.send(
		removeUserPassword(
			await User.find({
				_id: {
					$in: (await User.findById(myId)).friends
						.reduce((result, friend) => {
							if (friend.status === "pending" && !friend.sentByMe) {
								result.push(friend);
							}
							return result;
						}, [])
						.map(request => String(request.userId))
				}
			})
		)
	);
});

// Search for users by name
router.get("/find/:username", async (req, res) => {
	const regex = new RegExp(
		req.params.username.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\&&"),
		"gi"
	);
	const users = await User.find({ username: regex });
	res.send(removeUserPassword(users));
});

// Upload an avatar for a user
router.post("/avatar", upload.single("avatar"), async (req, res) => {
	const result = await User.updateOne(
		{ _id: req.session.id },
		{ avatar: req.file.path }
	);
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

// Processes an array of users and returns them without a password (for security)
function removeUserPassword(users) {
	return users.map(user => {
		user.password = undefined;
		return user;
	});
}

module.exports = router;
