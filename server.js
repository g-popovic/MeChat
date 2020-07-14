require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const session = require("express-session");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(
	cors({
		credentials: true,
		origin:
			process.env.NODE_ENV === "production"
				? "http://localhost:3000"
				: "http://localhost:3000"
	})
);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);

// Connect to MongoDB Atlas
mongoose.connect(process.env.ATLAS_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});
mongoose.connection.on("open", err => {
	if (err) console.log(err);
	else console.log("Connected to MongoDB successful.");
});

// Session authentication test route
app.get("/profile", (req, res) => {
	if (req.session.myId) {
		res.send("Welcome aboard, captain. All systems online.");
	} else {
		res.send("Access denied.");
	}
});

// Web sockets for live chat
io.on("connect", socket => {
	socket.on("join", ({ room }) => {
		console.log("connected");
	});
});

// Connect routes
app.use("/users/", userRoutes);
app.use("/posts/", postRoutes);

// Run server
server.listen(process.env.PORT || 5000, () => {
	console.log("Server running on port " + (process.env.PORT || 5000));
});
