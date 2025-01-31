import { createContext } from "react";

export const InstructorContext = createContext(null);

export const InstructorContextProvider = ({ children }) => {
	return <InstructorContext.Provider>{children}</InstructorContext.Provider>;
};
