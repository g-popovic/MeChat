import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosApp from "../../utils/axiosConfig";

function LoginPage(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [warning, setWarning] = useState("");
	const [loading, setLoading] = useState(false);

	async function login(e) {
		setLoading(true);
		if (username.length && password.length) {
			e.preventDefault();

			try {
				setWarning("");
				await axiosApp.post(
					"/users/login",
					{ username: username, password: password },
					{ withCredentials: true }
				);
				await props.loginAttempt();
			} catch (err) {
				if (err.response !== undefined && err.response.status === 401) {
					setWarning(err.response.data);
				} else {
					alert("Oops! Something went wrong.");
				}
				setPassword("");
			}
		}
		setLoading(false);
	}

	return (
		<div className="login-container center-screen main-container">
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
				</div>

				<p className="login-warning">{warning}</p>

				<button
					className={
						"action-loading" +
						(loading ? " login-loading" : " push-effect")
					}
					type="submit"
					onClick={login}>
					LOG IN
				</button>

				<Link className="login-second-option" to="/register">
					CREATE ACCOUNT
				</Link>
			</form>
		</div>
	);
}

export default LoginPage;
