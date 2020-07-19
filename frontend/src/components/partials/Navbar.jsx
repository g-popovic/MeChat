import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosApp from "../../utils/axiosConfig";

function Navbar(props) {
	const [newPostOpen, setNewPostOpen] = useState(false);
	const [postContent, setPostContent] = useState("");

	function toggleNewPost() {
		setPostContent("");
		setNewPostOpen(prevVal => !prevVal);
	}

	async function submitPost() {
		if (postContent) {
			try {
				await axiosApp.post(
					"/posts/new-post",
					{ content: postContent },
					{ withCredentials: true }
				);
				setNewPostOpen(false);
			} catch (err) {
				console.log(err);
			}
		}
	}

	return (
		<>
			<nav className="navbar">
				<Link className="logo hide-mobile" to="/">
					<img
						src={require("../../images/assets/Logo.svg")}
						alt="logo"
					/>
				</Link>
				<ul>
					<li className="nav-home">
						<Link className="navbar-link" to="/">
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Home.svg")}
								alt="home icon"
							/>
							<p className="hide-mobile">HOME</p>
						</Link>
					</li>
					<li className="nav-new-post">
						<a onClick={toggleNewPost}>
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Add Post.svg")}
								alt="new post button"
							/>
							<p className="hide-mobile">NEW POST</p>
						</a>
					</li>
					<li className="nav-add-friend">
						<Link className="navbar-link" to="/search">
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Add Friend.svg")}
								alt="add friend button"
							/>
							<p className="hide-mobile">ADD FRIEND</p>
						</Link>
					</li>
					<li className="nav-chat hide-desktop">
						<a onClick={props.toggleFriendsPanel}>
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Chat L.svg")}
								alt="chat button"
							/>
						</a>
					</li>
					<Link
						className="nav-avatar hide-mobile"
						to={"/profile/" + props.myData.id}>
						<img
							src={require("../../images/uploads/" +
								props.myData.avatar)}
							alt="my profile picture"
						/>
					</Link>
				</ul>
			</nav>

			<div
				className={
					newPostOpen ? "new-post-container" : "new-post-container hide"
				}>
				<div className="new-post">
					<h1>New Post</h1>
					<textarea
						onChange={e => setPostContent(e.target.value)}
						autoFocus
						placeholder="Compose post"
					/>
					<button
						onClick={submitPost}
						className="new-post-btn push-effect">
						POST
					</button>
					<button onClick={toggleNewPost} className="cancel-post-btn">
						DISCARD
					</button>
				</div>
			</div>
		</>
	);
}

export default Navbar;
