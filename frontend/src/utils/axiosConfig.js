import Axios from "axios";

const env = process.env.NODE_ENV;

const axiosApp = Axios.create({
	baseURL:
		env === "production"
			? "https://deployed-app-url.com"
			: "http://localhost:5000"
});

export default axiosApp;
