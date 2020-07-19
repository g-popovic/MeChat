const ChatRoom = require("../models/chatRoom.model");

module.exports = function (io) {
	io.on("connect", socket => {
		let currentRoom;

		socket.on("join", ({ name, room }) => {
			currentRoom = room;

			socket.join(currentRoom);
		});

		socket.on("sendMessage", message => {
			io.to(currentRoom).emit("message", {
				text: message.text,
				author: message.author
			});

			console.log(currentRoom);

			ChatRoom.findByIdAndUpdate(currentRoom, {
				$push: { messages: message }
			})
				.then()
				.catch(err => console.log(err));
		});

		socket.on("disconnect", () => {
			console.log("disconnected");
		});
	});
};
