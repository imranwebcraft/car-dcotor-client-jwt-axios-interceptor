import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
	baseURL: "http://localhost:5000",
	withCredentials: true,
});

const useAxiosSecure = () => {
	// Use contect data
	const { logOut } = useContext(AuthContext);
	// use navigate hook
	const navigate = useNavigate();
	// Return created axios instance
	useEffect(() => {
		axiosSecure.interceptors.request.use(
			response => {
				return response;
			},
			error => {
				console.log("Error from interceptor", error.responese);
				if (error.responese.status === 401 || error.responese.status === 403) {
					logOut()
						.then(() => {
							navigate("/login");
						})
						.catch(eror => {
							console.log(eror);
						});
				}
			}
		);
	}, [logOut, navigate]);
	return axiosSecure;
};

export default useAxiosSecure;
