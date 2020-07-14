import React, { useState } from "react";
import Axios from "axios";

function User(props) {
	const [userType, setUserType] = useState(props.userType);

	async function sendRequest() {
		setUserType("loading");
		try {
			await Axios.post(
				props.ENDPOINT + "/users/send-request/" + props.id,
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
			await Axios.post(
				props.ENDPOINT + "/users/accept/" + props.id,
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
			await Axios.post(
				props.ENDPOINT + "/users/unfriend/" + props.id,
				{},
				{ withCredentials: true }
			);
			setUserType("stranger");
			return null;
		} catch (err) {
			console.log(err);
		}
	}

	async function visitProfile() {
		alert("Visiting profile...");
	}

	return (
		<div className="user">
			<img
				onClick={visitProfile}
				className="user-avatar"
				src={require("../../images/uploads/" + props.avatar)}
			/>
			<div>
				<p onClick={visitProfile} className="user-name">
					{props.name}
				</p>
				{userType === "stranger" ? (
					<div>
						<button
							onClick={sendRequest}
							className="friend-action-btn profile-action user-add-friend push-effect">
							<img
								src={require("../../images/assets/Add S D.svg")}
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
