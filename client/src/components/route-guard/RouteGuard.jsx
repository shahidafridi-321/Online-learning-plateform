import React, { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

export const RouteGuard = ({ authenticated, user, element, loading }) => {
	const location = useLocation();

	if (loading) {
		return <Skeleton />;
	}

	if (!authenticated) {
		if (
			location.pathname !== "/auth" &&
			location.pathname !== "/verify-email"
		) {
			return <Navigate to="/auth" />;
		}
	} else {
		if (user.role === "admin") {
			if (!location.pathname.startsWith("/admin")) {
				return <Navigate to="/admin/dashboard" />;
			}
		} else if (user.role === "instructor") {
			if (!location.pathname.startsWith("/instructor")) {
				return <Navigate to="/instructor" />;
			}
		} else {
			// For students
			if (
				location.pathname.startsWith("/admin") ||
				location.pathname.startsWith("/instructor")
			) {
				return <Navigate to="/home" />;
			}
		}

		// Redirect authenticated users away from /auth and /verify-email
		if (
			location.pathname === "/auth" ||
			location.pathname === "/verify-email"
		) {
			if (user.role === "admin") {
				return <Navigate to="/admin" />;
			} else if (user.role === "instructor") {
				return <Navigate to="/instructor" />;
			} else {
				return <Navigate to="/home" />;
			}
		}
	}

	return <Fragment>{element}</Fragment>;
};
