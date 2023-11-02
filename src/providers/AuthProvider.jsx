import { createContext, useEffect, useState } from "react";
import {
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const createUser = (email, password) => {
		setLoading(true);
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const signIn = (email, password) => {
		setLoading(true);
		return signInWithEmailAndPassword(auth, email, password);
	};

	const logOut = () => {
		setLoading(true);
		return signOut(auth);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, currentUser => {
			//get the user info that will send as Payload
			const userEmail = currentUser?.email || user?.email;
			const loggedUser = { email: userEmail };
			setUser(currentUser);
			setLoading(false);

			// If user exist we will issue a token
			if (currentUser) {
				// get user data use axios to post the user payload
				axios
					.post(
						"https://car-doctor-server-adry05l17-imran-it1.vercel.app/jwt",
						loggedUser,
						{
							withCredentials: true,
						}
					)
					.then(res => {
						console.log(res.data);
					});
			} else {
				// get the user info and use axios to to send user data as Payload
				axios
					.post(
						"https://car-doctor-server-adry05l17-imran-it1.vercel.app/logout",
						loggedUser,
						{
							withCredentials: true,
						}
					)
					.then(res => {
						console.log(res.data);
					});
			}
		});
		return () => {
			return unsubscribe();
		};
	}, [user?.email]);

	const authInfo = {
		user,
		loading,
		createUser,
		signIn,
		logOut,
	};

	return (
		<AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
