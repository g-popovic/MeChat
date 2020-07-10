import React from "react";

function Post() {
	return (
		<div className="post">
			<div className="author-info">
				<a href="/profile">
					<img
						className="post-author-image"
						src={require("../../images/uploads/undefined-avatar.jpg")}
					/>
				</a>
				<span>
					<p className="author">Djoka</p>
					<p className="post-date">2 weeks ago</p>
				</span>
			</div>
			<p className="post-content">
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
				eirmod.
			</p>
			<div className="likes">
				<img className="unliked" src={require("../../images/assets/Like.svg")} />
				<p>15 likes</p>
			</div>
		</div>
	);
}

export default Post;
