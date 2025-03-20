import {
	createContext,
	useState,
	useEffect,
	useMemo,
	useCallback,
} from "react";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService } from "@/services";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
	const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
	const [auth, setAuth] = useState({
		authenticate: false,
		user: null,
	});
	const [loading, setLoading] = useState(true);

	const handleLoginUser = useCallback(
		async (e) => {
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
		},
		[signInFormData]
	);

	const checkAuthUser = useCallback(async () => {
		try {
			const data = await checkAuthService();
			setAuth({
				authenticate: data.success,
				user: data.success ? data.data.user : null,
			});
		} catch (error) {
			console.error("Error checking authentication:", error);
			setAuth({
				authenticate: false,
				user: null,
			});
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		checkAuthUser();
	}, [checkAuthUser]);

	const resetCredentials = useCallback(() => {
		setAuth({
			authenticate: false,
			user: null,
		});
	}, []);

	const value = useMemo(() => {
		return {
			signInFormData,
			setSignInFormData,
			signUpFormData,
			setSignUpFormData,
			handleLoginUser,
			auth,
			loading,
			resetCredentials,
		};
	}, [signInFormData, signUpFormData, handleLoginUser, auth, loading]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
