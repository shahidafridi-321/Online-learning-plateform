import React from "react";
import { Link } from "react-router-dom";

export const AdminFooter = () => {
	return (
		<footer className="py-12 px-4 lg:px-12 bg-gray-800 dark:bg-gray-900 text-white">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<h3 className="text-2xl font-bold mb-4">Admin Dashboard</h3>
					<p className="text-gray-400">
						Managing education content and users with ease.
					</p>
				</div>
				<div>
					<h3 className="text-xl font-bold mb-4">Admin Tools</h3>
					<ul className="space-y-2">
						<li>
							<Link
								to="/admin/courses"
								className="hover:text-indigo-400 transition"
							>
								Manage Courses
							</Link>
						</li>
						<li>
							<Link
								to="/admin/users"
								className="hover:text-indigo-400 transition"
							>
								Manage Users
							</Link>
						</li>
						<li>
							<Link
								to="/admin/approve-reject-review"
								className="hover:text-indigo-400 transition"
							>
								Review Approvals
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="text-xl font-bold mb-4">Support</h3>
					<ul className="space-y-2">
						<li>
							<a href="/faq" className="hover:text-indigo-400 transition">
								FAQ
							</a>
						</li>
						<li>
							<a href="/contact" className="hover:text-indigo-400 transition">
								Contact Us
							</a>
						</li>
						<li>
							<a href="/terms" className="hover:text-indigo-400 transition">
								Terms of Service
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="text-xl font-bold mb-4">Connect</h3>
					<ul className="space-y-2">
						<li>
							<a href="#" className="hover:text-indigo-400 transition">
								Facebook
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-indigo-400 transition">
								Twitter
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-indigo-400 transition">
								Instagram
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-indigo-400 transition">
								LinkedIn
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="mt-10 text-center text-gray-400">
				<p>© {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
			</div>
		</footer>
	);
};
