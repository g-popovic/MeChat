import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

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
				await Axios.post(
					props.ENDPOINT + "/posts/new-post",
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
					<img src={require("../../images/assets/Logo.svg")} />
				</Link>
				<ul>
					<li className="nav-home">
						<Link className="navbar-link" to="/">
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Home.svg")}
							/>
							<p className="hide-mobile">HOME</p>
						</Link>
					</li>
					<li className="nav-new-post">
						<a onClick={toggleNewPost}>
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Add Post.svg")}
							/>
							<p className="hide-mobile">NEW POST</p>
						</a>
					</li>
					<li className="nav-add-friend">
						<Link className="navbar-link" to="/search">
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Add Friend.svg")}
							/>
							<p className="hide-mobile">ADD FRIEND</p>
						</Link>
					</li>
					<li className="nav-chat hide-desktop">
						<a>
							<img
								src={require("../../images/assets/Mobile Bottom Nav/Chat L.svg")}
							/>
						</a>
					</li>
					<Link
						className="nav-avatar hide-mobile"
						to={"/profile/" + props.myData.id}>
						<img
							src={require("../../images/uploads/" +
								props.myData.avatar)}
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
