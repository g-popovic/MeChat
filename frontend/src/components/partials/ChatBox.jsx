import React from "react";

function ChatBox() {
	return (
		<div className="chat-box-container">
			<nav className="nav-mobile-chat nav-mobile">
				<a className="hide-desktop">
					<img src={require("../../images/assets/Back.svg")} />
				</a>
				<a className="hide-mobile chat-minimize">
					<img src={require("../../images/assets/Minimize Icon.svg")} />
				</a>
				<span className="friend-chat">
					<p>Michael Jordan</p>
					<a className="mobile" href="/find-user">
						<img
							className="friend-chat-avatar"
							src={require("../../images/uploads/default-avatar.svg")}
						/>
					</a>
				</span>
			</nav>

			<div className="chat-container">
				<p>Fuck you</p>
				<p>Fuck you</p>
			</div>
		</div>
	);
}

export default ChatBox;
