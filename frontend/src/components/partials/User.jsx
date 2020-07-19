import React, { useState } from "react";
import axiosApp from "../../utils/axiosConfig";
import { Link } from "react-router-dom";

function User(props) {
	const [userType, setUserType] = useState(props.userType);

	async function sendRequest() {
		setUserType("loading");
		try {
			await axiosApp.post(
				"/users/send-request/" + props.id,
				{},
				{ withCredentials: true }
			);
			setUserType("pending");
		} catch (err) {
			console.log(err);
		}
	}

	async function accept() {
		setUserType("loading");
		try {
			await axiosApp.post(
				"/users/accept/" + props.id,
				{},
				{ withCredentials: true }
			);
			setUserType("friend");
		} catch (err) {
			console.log(err);
		}
	}

	async function decline() {
		setUserType("loading");
		try {
			await axiosApp.post(
				"/users/unfriend/" + props.id,
				{},
				{ withCredentials: true }
			);
			setUserType("stranger");
			return null;
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="user">
			<Link to={"/profile/" + props.id}>
				<img
					className="user-avatar"
					src={require("../../images/uploads/" + props.avatar)}
					alt="user profile"
				/>
			</Link>
			<div>
				<Link to={"/profile/" + props.id}>
					<p className="user-name">{props.name}</p>
				</Link>
				{userType === "stranger" ? (
					<div>
						<button
							onClick={sendRequest}
							className="friend-action-btn profile-action user-add-friend push-effect">
							<img
								src={require("../../images/assets/Add S D.svg")}
								alt=""
							/>
							<p>ADD</p>
						</button>
					</div>
				) : userType === "pending" ? (
					<div>
						<button className="friend-action-btn profile-action user-request-pending">
							<p>PENDING</p>
						</button>
					</div>
				) : userType === "friend" ? (
					<div>
						<button className="friend-action-btn profile-action user-send-message">
							<p>FRIENDS</p>
						</button>
					</div>
				) : userType === "requested" ? (
					<div>
						<button
							onClick={accept}
							className="friend-action-btn profile-action user-add-friend accept-btn push push-effect">
							<p>ACCEPT</p>
						</button>
						<button
							onClick={decline}
							className="friend-action-btn profile-action user-decline-request push">
							<p>DECLINE</p>
						</button>
					</div>
				) : userType === "loading" ? (
					<div>
						<button className="friend-action-btn profile-action action-loading">
							<img
								className="loading"
								src={require("../../images/assets/Loading White.svg")}
								alt="loading"
							/>
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
}

export default User;
