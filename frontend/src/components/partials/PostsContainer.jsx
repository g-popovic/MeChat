import React, { useState } from "react";
import axiosApp from "../../utils/axiosConfig";
import { Link } from "react-router-dom";

import PageLoading from "./PageLoading";
import Post from "./Post";

function PostsContainer(props) {
	const [posts, setPosts] = useState("loading");

	async function updatePosts() {
		setPosts((await axiosApp.get("/posts/all")).data.reverse());
	}

	useState(() => {
		updatePosts();
	}, []);

	return (
		<div className="posts-container main-container">
			<nav className="nav-mobile-feed nav-mobile hide-desktop">
				<h1>Feed</h1>
				<Link to={"/profile/" + props.myData.id}>
					<img
						src={require("../../images/uploads/" +
							props.myData.avatar)}
						alt="my profile picture"
					/>
				</Link>
			</nav>
			{posts === "loading" ? (
				<PageLoading />
			) : (
				posts.map(post => (
					<Post
						key={post.postId}
						myData={props.myData}
						authorId={post.authorId}
						id={post.postId}
						author={post.authorName}
						avatar={post.authorAvatar}
						content={post.content}
						likes={post.likes}
						date={post.date}
					/>
				))
			)}
		</div>
	);
}

export default PostsContainer;
