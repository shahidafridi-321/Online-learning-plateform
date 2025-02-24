import React, { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

export const RouteGuard = ({ authenticated, user, element, loading }) => {
	const location = useLocation();

	if (loading) {
		return <Skeleton />;
	}

	// When not authenticated, allow access only to /auth and /verify-email pages.
	if (!authenticated) {
		if (
			location.pathname !== "/auth" &&
			location.pathname !== "/verify-email"
		) {
			return <Navigate to="/auth" />;
		}
	} else {
		// Authenticated users
		if (user.role !== "instructor") {
			//  if students trying to access /auth, /verify-email, or any instructor routes, redirect to /home.
			if (
				location.pathname === "/auth" ||
				location.pathname === "/verify-email" ||
				location.pathname.includes("instructor")
			) {
				return <Navigate to="/home" />;
			}
		} else {
			// if instructor not on an instructor route, redirect them to /instructor.
			if (!location.pathname.includes("instructor")) {
				return <Navigate to="/instructor" />;
			}
		}
	}

	return <Fragment>{element}</Fragment>;
};
