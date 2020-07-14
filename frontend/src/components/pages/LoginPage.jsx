import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";

function LoginPage(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [warning, setWarning] = useState("");

	async function login(e) {
		if (username.length && password.length) {
			e.preventDefault();

			try {
				setWarning("");
				await Axios.post(
					props.ENDPOINT + "/users/login",
					{ username: username, password: password },
					{ withCredentials: true }
				);
				await props.loginAttempt();
			} catch (err) {
				if (err.response !== undefined && err.response.status === 401) {
					setWarning(err.response.data);
				} else {
					alert(err);
				}
				setPassword("");
				return;
			}
		}
	}

	return (
		<div className="login-container main-container">
			<div className="login-logo">
				<img src={require("../../images/assets/Logo.svg")} />
			</div>

			<form className="login-form">
				<div className="login-inputs-container">
					<div className="username-input-container">
						<img src={require("../../images/assets/Profile S.svg")} />
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
						<img src={require("../../images/assets/Password.svg")} />
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

				<button className="push-effect" type="submit" onClick={login}>
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
