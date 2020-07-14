import React from "react";
import { Link } from "react-router-dom";

import Post from "./Post";

function PostsContainer() {
	return (
		<div className="posts-container main-container">
			<nav className="nav-mobile-feed nav-mobile hide-desktop">
				<h1>Feed</h1>
				<a href="/profile">
					<img src={require("../../images/uploads/undefined-avatar.jpg")} />
				</a>
			</nav>
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
		</div>
	);
}

export default PostsContainer;
