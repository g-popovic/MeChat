import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Navbar from "../partials/Navbar";
import FriendsPanel from "../partials/FriendsPanel";
import PostsContainer from "../partials/PostsContainer";
import Profile from "../partials/Profile";
import SearchContainer from "../partials/SearchContainer";

function MainPage() {
	return (
		<>
			<Navbar />
			<div class="panels-container">
				<FriendsPanel />
				<BrowserRouter>
					<Switch>
						<Route path="/explore" component={PostsContainer} />
						<Route path="/profile" component={Profile} />
						<Route path="/profile/:userId" component={Profile} />
						<Route path="/search" component={SearchContainer} />
						<Route
							component={() => (
								<h1 style={{ "font-size": "5em", "text-align": "center" }}>
									Jedi boraniju mmbraleee
								</h1>
							)}
						/>
					</Switch>
				</BrowserRouter>
			</div>
		</>
	);
}

export default MainPage;
