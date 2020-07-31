import React from "react";

function Friend(props) {
	return (
		<li onClick={() => props.openChat(props)} className="friend">
			<img
				src={
					"https://mechat-profile-images.s3.eu-west-2.amazonaws.com/" +
					props.avatar
				}
				alt="user avatar"
			/>
			<span>
				<p className="friend-name">{props.username}</p>
				<p className="last-message">Open Chat</p>
			</span>
		</li>
	);
}

export default Friend;
