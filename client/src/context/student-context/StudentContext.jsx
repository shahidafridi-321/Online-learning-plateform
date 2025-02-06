import React, { createContext, useState } from "react";

export const StudentContext = createContext(null);

export const StudentContextProvider = ({ children }) => {
	const [studentViewCourseList, setStudentViewCourseList] = useState([]);
	return (
		<StudentContext.Provider
			value={{
				studentViewCourseList,
				setStudentViewCourseList,
			}}
		>
			{children}
		</StudentContext.Provider>
	);
};
