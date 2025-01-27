import { createContext, useState } from "react";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { registerService } from "@/services";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
	const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

	const handleRegisterUser = async (e) => {
		e.preventDefault();
		const data = await registerService(signUpFormData);
		console.log(data);
	};

	return (
		<AuthContext.Provider
			value={{
				signInFormData,
				setSignInFormData,
				signUpFormData,
				setSignUpFormData,
				handleRegisterUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
