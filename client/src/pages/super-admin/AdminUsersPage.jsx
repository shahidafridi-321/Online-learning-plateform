import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle, XCircle, Edit } from "lucide-react";
import { fetchAllUsersService, updateUserService } from "@/services";
import { toast } from "react-sonner";

export const AdminUsersPage = () => {
	const [usersList, setUsersList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState("all");
	const [sortBy, setSortBy] = useState("_id");
	const [sortOrder, setSortOrder] = useState("desc");

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await fetchAllUsersService();
			if (response.success) {
				setUsersList(response.data || []);
			} else {
				setError(response.message || "Failed to fetch users.");
			}
		} catch (err) {
			setError("An error occurred while fetching users.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleToggleVerification = async (userId, currentVerified) => {
		const newVerified = !currentVerified;
		try {
			const response = await updateUserService(userId, {
				isVerified: newVerified,
			});
			if (response.success) {
				setUsersList(
					usersList.map((user) =>
						user._id === userId ? { ...user, isVerified: newVerified } : user
					)
				);
				toast.success("Success", {
					description: `User ${
						newVerified ? "verified" : "unverified"
					} successfully.`,
				});
			} else {
				throw new Error(
					response.message || "Failed to update user verification."
				);
			}
		} catch (err) {
			toast.error("Error", {
				description: err.message || "Failed to update user verification.",
			});
		}
	};

	const handleChangeRole = async (userId, currentRole) => {
		const newRole = currentRole === "user" ? "instructor" : "user";
		try {
			const response = await updateUserService(userId, { role: newRole });
			if (response.success) {
				setUsersList(
					usersList.map((user) =>
						user._id === userId ? { ...user, role: newRole } : user
					)
				);
				toast.success("Success", {
					description: `User role changed to ${newRole}.`,
				});
			} else {
				throw new Error(response.message || "Failed to change user role.");
			}
		} catch (err) {
			toast.error("Error", {
				description: err.message || "Failed to change user role.",
			});
		}
	};

	const filteredUsers = usersList
		.filter((user) => filter === "all" || user.role === filter)
		.sort((a, b) => {
			const key = sortBy === "userName" ? "userName" : "_id";
			const order = sortOrder === "asc" ? 1 : -1;
			return key === "userName"
				? order * a.userName.localeCompare(b.userName)
				: order * a._id.localeCompare(b._id);
		});

	if (loading) {
		return (
			<div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
					<p className="mt-4 text-gray-600 dark:text-gray-400">
						Loading users...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
					<p className="mt-4 text-lg text-gray-800 dark:text-gray-200">
						{error}
					</p>
					<Button
						onClick={fetchUsers}
						className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
					>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
							Admin Users Management
						</h1>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							{filteredUsers.length} User{filteredUsers.length !== 1 ? "s" : ""}
						</p>
					</div>
					<div className="mt-4 sm:mt-0 flex space-x-2">
						<select
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
						>
							<option value="all">All Roles</option>
							<option value="user">Students</option>
							<option value="instructor">Instructors</option>
						</select>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
						>
							<option value="_id">Date Joined</option>
							<option value="userName">Name</option>
						</select>
						<select
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value)}
							className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
						>
							<option value="desc">Descending</option>
							<option value="asc">Ascending</option>
						</select>
					</div>
				</header>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredUsers.map((user, index) => (
						<motion.div
							key={user._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							whileHover={{ scale: 1.03 }}
						>
							<Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
								<div className="p-4 sm:p-6 flex-1 flex flex-col">
									<CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
										{user.userName}
									</CardTitle>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										<span className="font-semibold">Email:</span>{" "}
										{user.userEmail}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										<span className="font-semibold">Role:</span>{" "}
										{user.role || "Not Set"}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										<span className="font-semibold">Verified:</span>{" "}
										<span
											className={
												user.isVerified ? "text-green-500" : "text-red-500"
											}
										>
											{user.isVerified ? "Yes" : "No"}
										</span>
									</p>
								</div>
								<div className="p-4 sm:p-6 pt-0 flex flex-col space-y-2">
									<Button
										variant="outline"
										size="sm"
										className="w-full text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
									>
										<Edit className="h-4 w-4 mr-2" />
										View Details
									</Button>
									<div className="flex space-x-2">
										<Button
											className={`flex-1 ${
												user.isVerified
													? "bg-red-500 hover:bg-red-600"
													: "bg-green-500 hover:bg-green-600"
											} text-white`}
											onClick={() =>
												handleToggleVerification(user._id, user.isVerified)
											}
										>
											{user.isVerified ? (
												<>
													<XCircle className="h-4 w-4 mr-2" /> Unverify
												</>
											) : (
												<>
													<CheckCircle className="h-4 w-4 mr-2" /> Verify
												</>
											)}
										</Button>
										<Button
											className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
											onClick={() => handleChangeRole(user._id, user.role)}
										>
											{user.role === "user"
												? "Make Instructor"
												: "Make Student"}
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};
