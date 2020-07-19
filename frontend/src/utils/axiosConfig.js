import Axios from "axios";

const axiosApp = Axios.create({
	baseURL:
		process.env.NODE_ENV === "production"
			? "https://me-chat.herokuapp.com"
			: "http://localhost:5000"
});

export default axiosApp;
