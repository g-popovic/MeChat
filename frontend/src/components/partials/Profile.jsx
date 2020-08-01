import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosApp from "../../utils/axiosConfig";
import axios from "axios";

import PageLoading from "./PageLoading";
import RenderPosts from "./RenderPosts";

function Profile(props) {
	const { userId } = useParams();
	const [profileData, setProfileData] = useState("loading");
	const [posts, setPosts] = useState("loading");
	const [notFound, setNotFound] = useState(false);
	const [userType, setUserType] = useState(null);

	const [uploadOpen, setUploadOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	async function getProfileData() {
		try {
			setNotFound(false);
			const [userData, postsData] = await Promise.all([
				axiosApp.get("/users/profile/" + userId),
				axiosApp.get("/posts/author/" + userId)
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

			setPosts(
				postsData.data
					.map(post => {
						post.authorAvatar = data.avatar;
						post.authorName = data.username;
						post.authorId = props.myData.id;
						post.postId = post._id;
						return post;
					})
					.reverse()
			);
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
			await axiosApp.post("/users/logout", {}, { withCredentials: true });
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
				await axiosApp.post(
					"/users/unfriend/" + userId,
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
		if (props.myData.id === userId) setUploadOpen(prevVal => !prevVal);
	}

	function handleFileSelect(e) {
		setSelectedFile(e.target.files[0]);
	}

	async function updateAvatar(e) {
		if (selectedFile) {
			if (selectedFile.size > 1024 * 1024) {
				alert("File too large. Please select a file under 1MB");
				return;
			}
			try {
				getSignedRequest(selectedFile);
			} catch (err) {
				console.log(err);
				setUploadOpen(false);
				alert("Oops! Something went wrong.");
			}
		}
		e.preventDefault();
	}

	async function getSignedRequest(file) {
		try {
			const result = await axiosApp.get(
				`/users/sign-s3?file-name=${file.name}&file-type=${file.type}`,
				{ withCredentials: true }
			);
			uploadFile(selectedFile, result.data.signedRequest, result.data.url);
		} catch (err) {
			console.log(err);
			alert("Oops! There was an unexpected error.");
		}
	}

	async function uploadFile(file, signedRequest, url) {
		try {
			var options = {
				headers: {
					"Content-Type": file.type,
					"x-amz-acl": "public-read",
					"Cache-Control": "no-cache"
				}
			};
			await axios.put(signedRequest, file, options);
			await axiosApp.patch(
				"/users/update-user-avatar",
				{},
				{ withCredentials: true }
			);
			props.onLogout(); // Refreshes the page so the user sees the Avatar change
			alert(
				"Profile photo updated! You may need to wait a minute to see the changes."
			);
		} catch (err) {
			console.log(err);
			alert("There was an error uploading the file.");
		}
	}

	return (
		<>
			<div className="profile-container main-container">
				{notFound ? (
					<h2 className="search-message">User not found</h2>
				) : profileData === "loading" ? (
					<PageLoading />
				) : (
					<nav className="nav-mobile-profile">
						<div className="profile-background">
							<div className="blur"></div>
						</div>
						<img
							onClick={toggleUploadOpen}
							className="profile-avatar"
							src={
								"https://mechat-profile-images.s3.eu-west-2.amazonaws.com/" +
								profileData.avatar
							}
							alt="profile picture"
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
						<RenderPosts posts={posts} myData={props.myData} />
					</div>
				)}
			</div>

			<div className={"new-post-container" + (uploadOpen ? "" : " hide")}>
				<div className="new-post center-screen upload-avatar">
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
