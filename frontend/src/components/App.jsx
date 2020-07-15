import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";

const ENDPOINT = "http://localhost:5000";

function App() {
	const [loggedIn, setLoggedIn] = useState("loading");
	const [myData, setMyData] = useState({});

	useEffect(() => {
		updateLoggedIn();
	}, []);

	async function getLoggedIn() {
		try {
			setMyData(
				(
					await Axios.get(ENDPOINT + "/users/status", {
						withCredentials: true
					})
				).data
			);
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	function redirectBasedOnStatus(componentIfLoggedOut, componentIfLoggedIn) {
		return loggedIn === "loading" ? (
			<img
				className="loading"
				src={require("../images/assets/Loading.svg")}
				alt="loading"
			/>
		) : !loggedIn ? (
			componentIfLoggedOut
		) : (
			componentIfLoggedIn
		);
	}

	async function updateLoggedIn() {
		setLoggedIn(await getLoggedIn());
	}

	return (
		<BrowserRouter>
			<Switch>
				<Route
					path="/login"
					component={() => {
						return redirectBasedOnStatus(
							<LoginPage
								ENDPOINT={ENDPOINT}
								loginAttempt={updateLoggedIn}
							/>,
							<Redirect to="/" />
						);
					}}
				/>

				<Route
					path="/register"
					component={() => {
						return redirectBasedOnStatus(
							<RegisterPage
								ENDPOINT={ENDPOINT}
								loginAttempt={updateLoggedIn}
							/>,
							<Redirect to="/" />
						);
					}}
				/>

				<Route
					component={() => {
						return redirectBasedOnStatus(
							<Redirect to="/login" />,
							<MainPage
								ENDPOINT={ENDPOINT}
								loggedIn={loggedIn}
								myData={myData}
								onLogout={updateLoggedIn}
							/>
						);
					}}
				/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
