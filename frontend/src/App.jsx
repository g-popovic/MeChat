import React from "react";
import Axios from "axios";

function App() {
	async function likePost() {
		Axios.post("http://localhost:5000/posts/like/5efe04bb50ba695678dd6200", {
			myId: "5efe0322a473a82a34fd44dc"
		});

		console.log("Liked!");
	}

	return (
		<>
			<h1>Testing Likes</h1>
			<button onClick={likePost}>Like!</button>
		</>
	);
}

export default App;
