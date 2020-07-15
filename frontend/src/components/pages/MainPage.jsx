import React from "react";
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import Navbar from "../partials/Navbar";
import FriendsPanel from "../partials/FriendsPanel";
import PostsContainer from "../partials/PostsContainer";
import Profile from "../partials/Profile";
import SearchContainer from "../partials/SearchContainer";

function MainPage(props) {
	return (
		<BrowserRouter>
			<Navbar ENDPOINT={props.ENDPOINT} myData={props.myData} />
			<div className="panels-container">
				<FriendsPanel />

				<Switch>
					<Route path="/" exact component={PostsContainer} />
					<Route
						path="/profile/:userId"
						component={() => (
							<Profile
								ENDPOINT={props.ENDPOINT}
								myData={props.myData}
								onLogout={props.onLogout}
							/>
						)}
					/>
					<Route
						path="/search"
						component={() => (
							<SearchContainer
								ENDPOINT={props.ENDPOINT}
								myData={props.myData}
							/>
						)}
					/>
					<Route
						component={() => (
							<h1
								style={{
									fontSize: "5em",
									textAlign: "center"
								}}>
								Error 404
							</h1>
						)}
					/>
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default MainPage;
