import React, { useState } from "react";
import axiosApp from "../../utils/axiosConfig";
import { Link } from "react-router-dom";

import PageLoading from "./PageLoading";
import RenderPosts from "./RenderPosts";

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
						src={
							"https://mechat-profile-images.s3.eu-west-2.amazonaws.com/" +
							props.myData.avatar
						}
						alt="my profile picture"
					/>
				</Link>
			</nav>
			{posts === "loading" ? (
				<PageLoading />
			) : (
				<RenderPosts posts={posts} myData={props.myData} />
			)}
		</div>
	);
}

export default PostsContainer;
