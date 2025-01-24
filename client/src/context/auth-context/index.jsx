import { createContext } from "react";

export const AuthContext = createContext({
	signInFormData: {},
	setSignInFormData: () => {},
	signUpFormData: {},
	setSignUpFormData: () => {},
});
