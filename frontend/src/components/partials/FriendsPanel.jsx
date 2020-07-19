import React, { useState, useEffect } from "react";
import axiosApp from "../../utils/axiosConfig";
import { Link } from "react-router-dom";

import ChatBox from "./ChatBox";
import PageLoading from "./PageLoading";
import Friend from "./Friend";

function FriendsPanel(props) {
	const [friends, setFriends] = useState("loading");
	const [chatInfo, setChatInfo] = useState(null);

	useEffect(() => {
		updateFriends();
	}, []);

	async function updateFriends() {
		setFriends(
			(await axiosApp.get("/users/friends", { withCredentials: true })).data
		);
	}

	function openChat(friendData) {
		setChatInfo(friendData);
	}

	function closeChat() {
		setChatInfo(null);
	}

	return (
		<>
			<div
				className={`friends-container${
					props.panelOpen ? " friends-open" : " hide-mobile"
				}`}>
				<div className="friends-title hide-mobile">
					<h1>Inbox</h1>
				</div>
				<nav className="nav-mobile-friends nav-mobile hide-desktop">
					<img
						onClick={props.toggleFriendsPanel}
						src={require("../../images/assets/Back.svg")}
						alt="back icon"
					/>
					<h1>Inbox</h1>
				</nav>
				<ul>
					{friends === "loading" ? (
						<PageLoading />
					) : !friends.length ? (
						<div className="no-friends">
							<p>You don't have any friends. Bummer!</p>
							<Link to="/search">Add Friends</Link>
						</div>
					) : (
						friends.map(friend => (
							<Friend
								key={friend._id}
								id={friend._id}
								username={friend.username}
								avatar={friend.avatar}
								chatRoomId={friend.chatRoomId}
								openChat={openChat}
							/>
						))
					)}
				</ul>
			</div>

			{chatInfo ? (
				<ChatBox
					myData={props.myData}
					id={chatInfo.id}
					username={chatInfo.username}
					avatar={chatInfo.avatar}
					chatRoomId={chatInfo.chatRoomId}
					closeChat={closeChat}
				/>
			) : null}
		</>
	);
}

export default FriendsPanel;
