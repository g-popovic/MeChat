import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosApp from "../../utils/axiosConfig";
import moment from "moment";

function Post(props) {
	const [liked, setLiked] = useState(props.likes.includes(props.myData.id));
	const [loading, setLoading] = useState(false);
	const [likeCount, setLikeCount] = useState(props.likes.length);

	async function likeUnlike() {
		if (!loading) {
			try {
				if (liked) {
					// Unlike the post
					setLiked(false);
					setLikeCount(prevVal => prevVal - 1);

					await axiosApp.post(
						"/posts/unlike/" + props.id,
						{},
						{ withCredentials: true }
					);
				} else {
					// Like the post
					setLiked(true);
					setLikeCount(prevVal => prevVal + 1);

					await axiosApp.post(
						"/posts/like/" + props.id,
						{},
						{ withCredentials: true }
					);
				}
			} catch (err) {
				console.log(err);
				window.location.reload();
			}
		}
	}

	return (
		<div className="post">
			<div className="author-info">
				<Link to={"/profile/" + props.authorId}>
					<img
						className="post-author-image"
						src={require("../../images/uploads/" + props.avatar)}
						alt="profile picture"
					/>
				</Link>
				<span>
					<Link to={"/profile/" + props.authorId}>
						<p className="author">{props.author}</p>
					</Link>
					<p className="post-date">{moment(props.date).fromNow()}</p>
				</span>
			</div>

			<p className="post-content">{props.content}</p>
			<div className="likes" onClick={likeUnlike}>
				<img
					className={liked ? "liked" : ""}
					src={require(`../../images/assets/Like${
						liked ? "" : " Gray"
					}.svg`)}
					alt="like icon"
				/>
				<p>{likeCount} likes</p>
			</div>
		</div>
	);
}

export default Post;
