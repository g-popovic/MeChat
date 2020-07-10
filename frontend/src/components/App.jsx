import React, { useState } from "react";
import Axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

//Testing
import ChatBox from "./partials/ChatBox";

function App() {
	// const [status, setStatus] = useState(async () => {
	// 	await Axios.get();
	// });

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={LoginPage} />
				<Route path="/chat" component={ChatBox} />
				<Route component={MainPage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
