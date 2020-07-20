import React, { useState } from "react";
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import Navbar from "../partials/Navbar";
import FriendsPanel from "../partials/FriendsPanel";
import PostsContainer from "../partials/PostsContainer";
import Profile from "../partials/Profile";
import SearchContainer from "../partials/SearchContainer";

function MainPage(props) {
	const [friendsPanelOpen, setFriendsPanelOpen] = useState(false);

	function togglePanel() {
		setFriendsPanelOpen(prev => !prev);
	}

	function closeFriends() {
		setFriendsPanelOpen(false);
	}

	return (
		<BrowserRouter>
			<Navbar
				myData={props.myData}
				toggleFriendsPanel={togglePanel}
				closeFriendsPanel={closeFriends}
			/>
			<div className="panels-container">
				<FriendsPanel
					myData={props.myData}
					toggleFriendsPanel={togglePanel}
					panelOpen={friendsPanelOpen}
				/>

				<Switch>
					<Route
						path="/"
						exact
						component={() => <PostsContainer myData={props.myData} />}
					/>
					<Route
						path="/profile/:userId"
						component={() => (
							<Profile
								myData={props.myData}
								onLogout={props.onLogout}
							/>
						)}
					/>
					<Route
						path="/search"
						component={() => <SearchContainer myData={props.myData} />}
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
