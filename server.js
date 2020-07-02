require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const session = require("express-session");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
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
	useCreateIndex: true
});
mongoose.connection.on("open", err => {
	if (err) console.log(err);
	else console.log("Connected to MongoDB successful.");
});

// Session test route
app.get("/profile", (req, res) => {
	if (req.session.userId) {
		res.send("Welcome aboard, captain. All systems online.");
	} else {
		res.send("Access denied.");
	}
});

// Connect routes
app.use("/users/", userRoutes);

// Run server
app.listen(process.env.PORT || 5000, (req, res) => {
	console.log("Server running on port " + (process.env.PORT || 5000));
});
