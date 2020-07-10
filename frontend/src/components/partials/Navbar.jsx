import React from "react";

function Navbar(props) {
	return (
		<nav className="navbar">
			<a className="logo hide-mobile" href="/profile">
				<img src={require("../../images/assets/Logo.svg")} />
			</a>
			<ul>
				<li className="nav-home">
					<a>
						<img
							src={require("../../images/assets/Mobile Bottom Nav/Home.svg")}
						/>
						<p className="hide-mobile">HOME</p>
					</a>
				</li>
				<li className="nav-new-post">
					<a>
						<img
							src={require("../../images/assets/Mobile Bottom Nav/Add Post.svg")}
						/>
						<p className="hide-mobile">NEW POST</p>
					</a>
				</li>
				<li className="nav-add-friend">
					<a>
						<img
							src={require("../../images/assets/Mobile Bottom Nav/Add Friend.svg")}
						/>
						<p className="hide-mobile">ADD FRIEND</p>
					</a>
				</li>
				<li className="nav-chat hide-desktop">
					<a>
						<img
							src={require("../../images/assets/Mobile Bottom Nav/Chat L.svg")}
						/>
					</a>
				</li>
				<a className="nav-avatar hide-mobile" href="/profile">
					<img src={require("../../images/uploads/undefined-avatar.jpg")} />
				</a>
			</ul>
		</nav>
	);
}

export default Navbar;
