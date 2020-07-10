import React from "react";

function LoginPage() {
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
							autocomplete="off"
						/>
					</div>
					<div className="password-input-container">
						<img src={require("../../images/assets/Password.svg")} />
						<input placeholder="Password" required type="password" />
					</div>
					<div className="password-input-container">
						<img src={require("../../images/assets/Password.svg")} />
						<input placeholder="Confirm Password" required type="password" />
					</div>
				</div>

				<button className="push-effect" type="submit">
					REGISTER
				</button>

				<a className="login-second-option" href="/register">
					SIGN IN
				</a>
			</form>
		</div>
	);
}

export default LoginPage;
