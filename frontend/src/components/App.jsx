import React, { useState, useEffect } from "react";
import axiosApp from "../utils/axiosConfig";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";

function App() {
	const [loggedIn, setLoggedIn] = useState("loading");
	const [myData, setMyData] = useState({});

	console.log("App Refreshed");

	useEffect(() => {
		updateLoggedIn();
	}, []);

	async function getLoggedIn() {
		try {
			setMyData(
				(
					await axiosApp.get("/users/status", {
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
				className="loading center-screen"
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
							<LoginPage loginAttempt={updateLoggedIn} />,
							<Redirect to="/" />
						);
					}}
				/>

				<Route
					path="/register"
					component={() => {
						return redirectBasedOnStatus(
							<RegisterPage loginAttempt={updateLoggedIn} />,
							<Redirect to="/" />
						);
					}}
				/>

				<Route
					component={() => {
						return redirectBasedOnStatus(
							<Redirect to="/login" />,
							<MainPage
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
