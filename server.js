require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const postRoutes = require("./routes/post.routes");
const session = require("express-session");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const MemoryStore = require("memorystore")(session);
const cors = require("cors");
const aws = require("aws-sdk");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
require("./socket/messaging")(io);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(
	cors({
		credentials: true,
		origin:
			process.env.NODE_ENV === "production"
				? "https://me-chat.herokuapp.com"
				: "http://localhost:3000"
	})
);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MemoryStore({
			checkPeriod: 1000 * 60 * 60 * 24
		}),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 30 * 6
		}
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

// Set up AWS S3
aws.config.region = "eu-west-2";
app.get("/sign-s3", (req, res) => {
	const s3 = new aws.S3();
	const S3_BUCKET = process.env.S3_BUCKET;
	const fileName = req.query["file-name"];
	const fileType = req.query["file-type"];
	const s3Params = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: "public-read"
	};

	s3.getSignedUrl("putObject", s3Params, (err, data) => {
		if (err) {
			console.log(err);
			return res.end();
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		};
		res.write(JSON.stringify(returnData));
		res.end();
	});
});

// Connect routes
app.use("/users/", userRoutes);
app.use("/posts/", postRoutes);
app.use("/chat/", chatRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static("frontend/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
	});
}

// Run server
server.listen(process.env.PORT || 5000, () => {
	console.log("Server running on port " + (process.env.PORT || 5000));
});
