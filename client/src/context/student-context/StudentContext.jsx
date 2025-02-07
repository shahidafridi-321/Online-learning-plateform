import React, { createContext, useState } from "react";

export const StudentContext = createContext(null);

export const StudentContextProvider = ({ children }) => {
	const [studentViewCourseList, setStudentViewCourseList] = useState([]);

	const [loading, setLoading] = useState(false);
	return (
		<StudentContext.Provider
			value={{
				studentViewCourseList,
				setStudentViewCourseList,
				loading,
				setLoading,
			}}
		>
			{children}
		</StudentContext.Provider>
	);
};
