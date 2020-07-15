import React from "react";

function Post(props) {
	return (
		<div className="post">
			<div className="author-info">
				<a href="/profile">
					<img
						className="post-author-image"
						src={require("../../images/uploads/" + props.avatar)}
					/>
				</a>
				<span>
					<p className="author">{props.author}</p>
					<p className="post-date">2 weeks ago</p>
				</span>
			</div>
			<p className="post-content">{props.content}</p>
			<div className="likes">
				<img
					className="unliked"
					src={require("../../images/assets/Like.svg")}
				/>
				<p>{props.likes.length} likes</p>
			</div>
		</div>
	);
}

export default Post;
