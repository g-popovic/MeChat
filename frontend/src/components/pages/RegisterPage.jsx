import React, { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [warning, setWarning] = useState("");

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
					<div className="password-input-container">
						<img src={require("../../images/assets/Password.svg")} />
						<input placeholder="Confirm Password" required type="password" />
					</div>
				</div>

				<p className="login-warning">{warning}</p>

				<button className="push-effect" type="submit">
					REGISTER
				</button>

				<Link className="login-second-option" to="/">
					LOG IN
				</Link>
			</form>
		</div>
	);
}

export default LoginPage;
