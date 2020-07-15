import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

import Post from "./Post";

function Profile(props) {
	const { userId } = useParams();
	const [profileData, setProfileData] = useState("loading");
	const [posts, setPostData] = useState("loading");
	const [notFound, setNotFound] = useState(false);
	const [userType, setUserType] = useState(null);

	const [uploadOpen, setUploadOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	async function getProfileData() {
		try {
			const [userData, postsData] = await Promise.all([
				Axios.get(props.ENDPOINT + "/users/profile/" + userId),
				Axios.get(props.ENDPOINT + "/posts/author/" + userId)
			]);

			const data = {
				username: userData.data.username,
				avatar: userData.data.avatar,
				friendCount: userData.data.friends.length,
				postCount: postsData.data.length
			};

			// Determines if the user in question is me, a friend, or stranger
			// (Used to display Logout or Unfriend buttons)
			setUserType(
				userData.data.friends.find(
					friend => friend.userId === props.myData.id
				)
					? "friend"
					: userData.data._id === props.myData.id
					? "me"
					: null
			);

			setProfileData(data);

			setPostData(postsData.data.reverse());
		} catch (err) {
			console.log("Cought error: ", err);
			setNotFound(true);
		}
	}

	useEffect(() => {
		getProfileData();
	}, [userId]);

	async function logout() {
		if (window.confirm("Are you sure you want to logout?")) {
			await Axios.post(
				props.ENDPOINT + "/users/logout",
				{},
				{ withCredentials: true }
			);
			props.onLogout();
		}
	}

	async function unfriend() {
		if (
			window.confirm(
				`Are you sure you want to remove "${profileData.username}" from friends?`
			)
		) {
			try {
				await Axios.post(
					props.ENDPOINT + "/users/unfriend/" + userId,
					{},
					{ withCredentials: true }
				);

				setUserType(null);
			} catch (err) {
				console.log(err);
			}
		}
	}

	function toggleUploadOpen() {
		setUploadOpen(prevVal => !prevVal);
	}

	function handleFileSelect(e) {
		setSelectedFile(e.target.files[0]);
	}

	async function updateAvatar(e) {
		if (selectedFile) {
			try {
				const fd = new FormData();
				fd.append("avatar", selectedFile, selectedFile.name);

				await Axios.post(props.ENDPOINT + "/users/avatar", fd, {
					withCredentials: true
				});

				props.onLogout();
			} catch (err) {
				console.log(err);
				setUploadOpen(false);
				alert("Oops! Something went wrong.");
			}
		}
		e.preventDefault();
	}

	return (
		<>
			<div className="profile-container main-container">
				{notFound ? (
					<h2 className="search-message">User not found</h2>
				) : profileData === "loading" ? (
					<img
						className="loading loading-search"
						src={require("../../images/assets/Loading.svg")}
						alt="loading"
					/>
				) : (
					<nav className="nav-mobile-profile">
						<div className="profile-background">
							<div className="blur"></div>
						</div>
						<img
							onClick={toggleUploadOpen}
							className="profile-avatar"
							src={require("../../images/uploads/" +
								profileData.avatar)}
						/>
						<div className="profile-name-container">
							<h1 className="profile-name">
								{profileData.username}
							</h1>
							{userType === "me" ? (
								<button
									onClick={logout}
									className="logout tooltip">
									<span className="tooltip-text">Logout</span>
									<img
										src={require("../../images/assets/Logout D.svg")}
									/>
								</button>
							) : userType === "friend" || userType === "pending" ? (
								<button
									onClick={unfriend}
									className="logout unfriend tooltip">
									<span className="tooltip-text">Un-friend</span>
									<img
										src={require("../../images/assets/Remove Friend.svg")}
									/>
								</button>
							) : (
								<span className="logout" />
							)}
						</div>

						<div className="profile-stats">
							<div className="friends-count">
								<p className="count">{profileData.friendCount}</p>
								<p className="label">friends</p>
							</div>
							<div className="post-count">
								<p className="count">{profileData.postCount}</p>
								<p className="label">posts</p>
							</div>
						</div>
					</nav>
				)}

				{posts === "loading" ? null : !posts.length ? (
					<p className="search-message">This user has not posts</p>
				) : (
					<div className="posts-container profile-posts">
						{posts.map(post => (
							<Post
								key={post._id}
								author={profileData.username}
								avatar={profileData.avatar}
								likes={post.likes}
								content={post.content}
							/>
						))}
					</div>
				)}
			</div>
			<div className={"new-post-container" + (uploadOpen ? "" : " hide")}>
				<div className="new-post upload-avatar">
					<h1>Upload Photo</h1>
					<p htmlFor="avatar" className="file-chosen">
						{selectedFile ? selectedFile.name : "No file chosen"}
					</p>
					<label className="choose-img-btn" htmlFor="avatar">
						Choose Image
					</label>
					<input
						onChange={handleFileSelect}
						id="avatar"
						className="avatar-input"
						type="file"
					/>
					<button
						onClick={updateAvatar}
						className={
							"new-post-btn push-effect" +
							(selectedFile ? "" : " file-not-chosen")
						}>
						UPLOAD
					</button>
					<button onClick={toggleUploadOpen} className="cancel-post-btn">
						DISCARD
					</button>
				</div>
			</div>
		</>
	);
}

export default Profile;
