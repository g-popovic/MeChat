import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

import Post from "./Post";

function Profile(props) {
	const { userId } = useParams();
	const [profileData, setProfileData] = useState("loading");

	useEffect(() => {
		async function getProfileData() {
			const [userData, postsData] = await Promise.all([
				Axios.get(props.ENDPOINT + "/users/profile/" + userId),
				Axios.get(props.ENDPOINT + "/posts/author/" + userId)
			]);
			console.log(userData.data, postsData.data);
		}

		getProfileData();
	}, []);

	return (
		<div className="profile-container main-container">
			<nav className="nav-mobile-profile">
				<div className="profile-background hide-mobile">
					<div className="blur"></div>
				</div>
				<img
					className="profile-avatar"
					src={require("../../images/uploads/undefined-avatar.jpg")}
				/>
				<div className="profile-name-container">
					<h1 className="profile-name">George Popovic</h1>
					<button className="logout">
						<img src={require("../../images/assets/Logout D.svg")} />
					</button>
				</div>

				<button className="profile-action profile-new-post">
					<img src={require("../../images/assets/Add M D.svg")} />
					<p>NEW POST</p>
				</button>

				{/* <button className="profile-action profile-add-friend">
					<img src={require("../../images/assets/Add Friend S.svg")} />
					<p>ADD FRIEND</p>
				</button>

				<button className="profile-action profile-send-message">
					<img src={require("../../images/assets/Message S D.svg")} />
					<p>SEND MESSAGE</p>
				</button>

				<button className="profile-action profile-request-pending">
					<p>REQUEST PENDING</p>
				</button> */}

				<div className="profile-stats">
					<div className="friends-count">
						<p className="count">256</p>
						<p className="label">friends</p>
					</div>
					<div className="post-count">
						<p className="count">29</p>
						<p className="label">posts</p>
					</div>
				</div>
			</nav>

			<div className="posts-container profile-posts">
				<Post />
				<Post />
				<Post />
				<Post />
			</div>
		</div>
	);
}

export default Profile;
