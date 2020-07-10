import React from "react";

import Friend from "./Friend";

function FriendsPanel() {
	return (
		<div className="friends-container hide-mobile">
			<div className="friends-title hide-mobile">
				<h1>Inbox</h1>
			</div>
			<nav className="nav-mobile-friends nav-mobile hide-desktop">
				<img src={require("../../images/assets/Back.svg")} alt="back icon" />
				<h1>Inbox</h1>
			</nav>
			<ul>
				<Friend />
				<Friend />
				<Friend />
				<Friend />
				<Friend />
				<Friend />
				<Friend />
				<Friend />
				<Friend />
				<Friend />
			</ul>
		</div>
	);
}

export default FriendsPanel;
