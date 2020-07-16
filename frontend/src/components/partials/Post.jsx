import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
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

					console.log("Unliking the post");

					console.log(
						await Axios.post(
							props.ENDPOINT + "/posts/unlike/" + props.id,
							{},
							{ withCredentials: true }
						)
					);
				} else {
					// Like the post
					setLiked(true);
					setLikeCount(prevVal => prevVal + 1);

					console.log("Liking the post");

					console.log(
						await Axios.post(
							props.ENDPOINT + "/posts/like/" + props.id,
							{},
							{ withCredentials: true }
						)
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
				/>
				<p>{likeCount} likes</p>
			</div>
		</div>
	);
}

export default Post;
