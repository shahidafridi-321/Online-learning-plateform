import React from "react";
import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

export const RouteGuard = ({ authenticated, user, element, loading }) => {
	const location = useLocation();

	if (loading) {
		return <Skeleton />;
	}
	if (!authenticated && !location.pathname.includes("/auth")) {
		return <Navigate to="/auth" />;
	}
	if (
		authenticated &&
		user?.role !== "instructor" &&
		(location.pathname.includes("instructor") ||
			location.pathname.includes("/auth"))
	) {
		return <Navigate to="/home" />;
	}
	if (
		authenticated &&
		user.role === "instructor" &&
		!location.pathname.includes("instructor")
	) {
		return <Navigate to="/instructor" />;
	}

	return <Fragment>{element}</Fragment>;
};
