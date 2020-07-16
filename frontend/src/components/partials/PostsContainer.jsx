import React, { useState } from "react";
import Axios from "axios";

import Post from "./Post";
import { Link } from "react-router-dom";

function PostsContainer(props) {
	const [posts, setPosts] = useState("loading");

	async function updatePosts() {
		setPosts((await Axios.get(props.ENDPOINT + "/posts/all")).data.reverse());
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
						src={require("../../images/uploads/" + props.myData.avatar)}
					/>
				</Link>
			</nav>
			{posts === "loading" ? (
				<img
					className="loading loading-search"
					src={require("../../images/assets/Loading.svg")}
					alt="loading"
				/>
			) : (
				posts.map(post => (
					<Post
						key={post.postId}
						myData={props.myData}
						ENDPOINT={props.ENDPOINT}
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
