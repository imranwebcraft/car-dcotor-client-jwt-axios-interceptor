import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
	baseURL: "https://car-doctor-server-adry05l17-imran-it1.vercel.app",
	withCredentials: true,
});

const useAxiosSecure = () => {
	// Use contect data
	const { logOut } = useContext(AuthContext);
	// use navigate hook
	const navigate = useNavigate();
	// Return created axios instance
	useEffect(() => {
		axiosSecure.interceptors.response.use(
			res => {
				console.log(res);
			},
			error => {
				if (error.response.status === 401 || error.response.status === 403) {
					console.log("Logout the user");
					logOut().then(() => {
						navigate("/");
					});
				}
			}
		);
	}, [logOut, navigate]);
	return axiosSecure;
};

export default useAxiosSecure;
