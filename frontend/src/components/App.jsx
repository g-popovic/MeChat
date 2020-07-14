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

	async function updateLoggedIn() {
		setLoggedIn(await getLoggedIn());
	}

	return (
		<BrowserRouter>
			<Switch>
				<Route
					path="/login"
					component={() => {
						return loggedIn === "loading" ? (
							<img
								className="loading"
								src={require("../images/assets/Loading.svg")}
								alt="loading"
							/>
						) : !loggedIn ? (
							<LoginPage
								ENDPOINT={ENDPOINT}
								loginAttempt={updateLoggedIn}
							/>
						) : (
							<Redirect to="/" />
						);
					}}
				/>

				<Route
					path="/register"
					component={() => <RegisterPage ENDPOINT={ENDPOINT} />}
				/>

				<Route
					component={() =>
						loggedIn === "loading" ? (
							<img
								className="loading"
								src={require("../images/assets/Loading.svg")}
								alt="loading"
							/>
						) : !loggedIn ? (
							<Redirect to="/login" />
						) : (
							<MainPage
								ENDPOINT={ENDPOINT}
								loggedIn={loggedIn}
								myData={myData}
							/>
						)
					}
				/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
