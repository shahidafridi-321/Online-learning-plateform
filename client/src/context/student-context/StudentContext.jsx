import React, { createContext, useState } from "react";

export const StudentContext = createContext(null);

export const StudentContextProvider = ({ children }) => {
	const [studentCourseList, setStudentCourseList] = useState([]);
	return (
		<StudentContext.Provider
			value={{
				studentCourseList,
				setStudentCourseList,
			}}
		>
			{children}
		</StudentContext.Provider>
	);
};
