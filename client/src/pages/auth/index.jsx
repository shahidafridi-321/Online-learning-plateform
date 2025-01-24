import React, { useState } from "react";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { AuthPage } from "./AuthPage";

export const AuthPageRoot = () => {
	const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
	const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

	return (
		<AuthContext.Provider
			value={{
				signInFormData,
				setSignInFormData,
				signUpFormData,
				setSignUpFormData,
			}}
		>
			<AuthPage />
		</AuthContext.Provider>
	);
};
