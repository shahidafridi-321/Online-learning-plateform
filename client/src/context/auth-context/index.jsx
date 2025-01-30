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
	const [loading, setLoading] = useState(true);

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
			if (!error?.response?.data?.success) {
				setAuth({
					authenticate: false,
					user: null,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuthUser();
	}, []);

	const resetCredentials = () => {
		setAuth({
			authenticate: false,
			user: null,
		});
	};

	return (
		<AuthContext.Provider
			value={{
				signInFormData,
				setSignInFormData,
				signUpFormData,
				setSignUpFormData,
				handleRegisterUser,
				handleLoginUser,
				auth,
				loading,
				resetCredentials,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
