import React from "react";

import Post from "./Post";

function RenderPosts(props) {
	const posts = props.posts;

	return posts.map(post => (
		<Post
			key={post.postId}
			id={post.postId}
			myData={props.myData}
			authorId={post.authorId}
			author={post.authorName}
			avatar={post.authorAvatar}
			content={post.content}
			likes={post.likes}
			date={post.date}
		/>
	));
}

export default RenderPosts;
