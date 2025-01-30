import { AuthContext } from "@/context/auth-context";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";

export const StudentHomePage = () => {
	const { resetCredentials } = useContext(AuthContext);
	const handleLogout = () => {
		resetCredentials();
		sessionStorage.clear();
	};
	return (
		<div>
			StudentHomePage
			<Button onClick={handleLogout}>Logout</Button>
		</div>
	);
};
