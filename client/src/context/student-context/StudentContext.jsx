import React, { createContext } from "react";

export const StudentContext = createContext(null);

export const StudentContextProvider = ({ children }) => {
	return <StudentContext.Provider>{children}</StudentContext.Provider>;
};
