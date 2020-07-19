import React, { useState, useEffect } from "react";
import axiosApp from "../../utils/axiosConfig";

import PageLoading from "./PageLoading";
import User from "./User";

function SearchContainer(props) {
	const [username, setUsername] = useState("");
	const [users, setUsers] = useState("loading");
	const [searchMessage, setSearchMessage] = useState("");

	useEffect(() => {
		// Display all pending friend requests
		async function getRequests() {
			const result = await axiosApp.get("/users/requests", {
				withCredentials: true
			});

			if (result.data.length) {
				setSearchMessage("");
				setUsers(result.data);
			} else {
				setSearchMessage("You don't have any new friend requests");
			}
		}

		getRequests();
	}, []);

	// Find users by their name
	async function inputChange(e) {
		setUsername(e.target.value);
		setUsers("loading");

		if (e.target.value.length) {
			const result = await axiosApp.get("/users/find/" + e.target.value);

			if (result.data.length) {
				setSearchMessage("");
				setUsers(result.data);
			} else {
				setSearchMessage("User not found");
			}
		} else {
			setUsers([]);
			setSearchMessage("");
		}
	}

	return (
		<div className="search-user-container main-container">
			<nav className="nav-mobile-search nav-mobile">
				<img src={require("../../images/assets/Search.svg")} alt="" />
				<input
					onChange={inputChange}
					value={username}
					autoComplete="off"
					type="text"
					placeholder="Search"
				/>
			</nav>

			<div className="users-container">
				{searchMessage.length ? (
					<p className="search-message">{searchMessage}</p>
				) : !users.length ? null : users === "loading" ? (
					<PageLoading />
				) : (
					users.map(user => {
						const meAsFriend = user.friends.find(
							friend => friend.userId === props.myData.id
						);

						return (
							<User
								key={user._id}
								name={user.username}
								avatar={user.avatar}
								id={user._id}
								userType={
									user._id === props.myData.id
										? null
										: meAsFriend === undefined
										? "stranger"
										: meAsFriend.status === "friends"
										? "friend"
										: meAsFriend.sentByMe
										? "requested"
										: "pending"
								}
							/>
						);
					})
				)}
			</div>
		</div>
	);
}

export default SearchContainer;
