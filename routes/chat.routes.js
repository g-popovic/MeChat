const User = require("../models/user.model");
const ChatRoom = require("../models/chatRoom.model");
const router = require("express").Router();

router.get("/get-messages/:userId", async (req, res) => {
	roomId = (await User.findById(req.session.myId)).friends.find(
		friend => String(friend.userId) === req.params.userId
	).chatRoomId;

	const messages = await ChatRoom.findById(roomId).select("messages -_id");

	res.send(messages);
});

module.exports = router;
