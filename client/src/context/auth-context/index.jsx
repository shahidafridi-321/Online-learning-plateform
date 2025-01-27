import { createContext, useState, useEffect } from "react";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
	const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
	const [auth, setAuth] = useState({
		authenticate: false,
		user: null,
	});

	const handleRegisterUser = async (e) => {
		e.preventDefault();
		const data = await registerService(signUpFormData);
		return data;
	};

	const handleLoginUser = async (e) => {
		e.preventDefault();
		const data = await loginService(signInFormData);

		if (data.success) {
			sessionStorage.setItem(
				"accessToken",
				JSON.stringify(data.data.accessToken)
			);
			setAuth({
				authenticate: true,
				user: data.data.user,
			});
		} else {
			setAuth({
				authenticate: false,
				user: null,
			});
		}
	};

	const checkAuthUser = async () => {
		try {
			const data = await checkAuthService();
			if (data.success) {
				setAuth({
					authenticate: true,
					user: data.data.user,
				});
			} else {
				setAuth({
					authenticate: false,
					user: null,
				});
			}
		} catch (error) {
			console.error("Error checking authentication:", error);
			setAuth({
				authenticate: false,
				user: null,
			});
		}
	};

	useEffect(() => {
		checkAuthUser();
	}, []);
	console.log(auth);

	return (
		<AuthContext.Provider
			value={{
				signInFormData,
				setSignInFormData,
				signUpFormData,
				setSignUpFormData,
				handleRegisterUser,
				handleLoginUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
