import React from "react";

function User(props) {
	return props.userType === "stranger" ? (
		<div class="user">
			<img
				class="user-avatar"
				src={require("../../images/uploads/default-avatar.svg")}
			/>
			<div>
				<p class="user-name">Michael Jordan</p>
				<button class="friend-action-btn profile-action user-add-friend">
					<img src={require("../../images/assets/Add S D.svg")} />
					<p>ADD</p>
				</button>
			</div>
		</div>
	) : props.userType === "pending" ? (
		<div class="user">
			<img
				class="user-avatar"
				src={require("../../images/uploads/default-avatar.svg")}
			/>
			<div>
				<p class="user-name">Michael Jordan</p>
				<button class="friend-action-btn profile-action user-request-pending">
					<p>PENDING</p>
				</button>
			</div>
		</div>
	) : props.userType === "friend" ? (
		<div class="user">
			<img
				class="user-avatar"
				src={require("../../images/uploads/default-avatar.svg")}
			/>
			<div>
				<p class="user-name">Michael Jordan</p>
				<button class="friend-action-btn profile-action user-send-message">
					<p>FRIENDS</p>
				</button>
			</div>
		</div>
	) : props.userType === "requested" ? (
		<div class="user">
			<img
				class="user-avatar"
				src={require("../../images/uploads/default-avatar.svg")}
			/>
			<div>
				<p class="user-name">Michael Jordan</p>
				<div>
					<button class="friend-action-btn profile-action user-add-friend accept-btn">
						<p>ACCEPT</p>
					</button>
					<button class="friend-action-btn profile-action user-decline-request">
						<p>DECLINE</p>
					</button>
				</div>
			</div>
		</div>
	) : (
		<div class="user">
			<img
				class="user-avatar"
				src={require("../../images/uploads/default-avatar.svg")}
			/>
			<div>
				<p class="user-name">Michael Jordan</p>
			</div>
		</div>
	);
}

export default User;
