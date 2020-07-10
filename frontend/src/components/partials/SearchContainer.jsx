import React from "react";

import User from "./User";

function SearchContainer() {
	return (
		<div className="search-user-container main-container">
			<nav className="nav-mobile-search nav-mobile">
				<a>
					<img
						src={require("../../images/assets/Back.svg")}
						className="hide-desktop"
					/>
				</a>
				<img
					src={require("../../images/assets/Search.svg")}
					className="hide-mobile"
				/>
				<input autocomplete="off" type="text" placeholder="Search" />
			</nav>

			<div className="users-container">
				<User userType="stranger" />
				<User userType="requested" />
				<User userType="friend" />
				<User userType="pending" />
				<User userType="stranger" />
				<User userType="stranger" />
				<User userType="stranger" />
				<User userType="stranger" />
				<User userType="stranger" />
				<User userType="stranger" />
			</div>
		</div>
	);
}

export default SearchContainer;
