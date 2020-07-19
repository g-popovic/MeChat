import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosApp from "../../utils/axiosConfig";

function RegisterPage(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [warning, setWarning] = useState("");
	const [loading, setLoading] = useState(false);

	async function register(e) {
		setLoading(true);
		if (username.length && password.length && password === confirm) {
			e.preventDefault();
			const data = {
				username: username,
				password: password
			};

			try {
				await axiosApp.post("/users/register", data, {
					withCredentials: true
				});
				await props.loginAttempt();
			} catch (err) {
				console.log(err);
				alert("Oops! Something went wrong.");
			}
		} else if (username.length && password.length && confirm.length) {
			e.preventDefault();
			setConfirm("");
		}
		setLoading(false);
	}

	function changeConfirm(e) {
		setConfirm(e.target.value);
		if (password !== e.target.value) {
			setWarning("Passwords don't match");
		} else {
			setWarning("");
		}
	}

	return (
		<div className="login-container main-container">
			<div className="login-logo">
				<img src={require("../../images/assets/Logo.svg")} alt="logo" />
			</div>

			<form className="login-form">
				<div className="login-inputs-container">
					<div className="username-input-container">
						<img
							src={require("../../images/assets/Profile S.svg")}
							alt=""
						/>
						<input
							placeholder="Username"
							required
							type="text"
							autoComplete="off"
							value={username}
							onChange={e => setUsername(e.target.value)}
							autoFocus
						/>
					</div>
					<div className="password-input-container">
						<img
							src={require("../../images/assets/Password.svg")}
							alt=""
						/>
						<input
							placeholder="Password"
							required
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<div className="password-input-container">
						<img
							src={require("../../images/assets/Password.svg")}
							alt=""
						/>
						<input
							placeholder="Confirm Password"
							required
							type="password"
							value={confirm}
							onChange={changeConfirm}
						/>
					</div>
				</div>

				<p className="login-warning register-warning">{warning}</p>

				<button
					onClick={register}
					className={
						"action-loading" +
						(loading ? " login-loading" : " push-effect")
					}
					type="submit">
					REGISTER
				</button>

				<Link className="login-second-option" to="/">
					LOG IN
				</Link>
			</form>
		</div>
	);
}

export default RegisterPage;
