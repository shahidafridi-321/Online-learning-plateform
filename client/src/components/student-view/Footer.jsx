import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
	return (
		<footer className="py-12 px-4 lg:px-12 bg-gray-800 dark:bg-gray-900 text-white">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<h3 className="text-2xl font-bold mb-4">EduPlatform</h3>
					<p className="text-gray-400">
						Empowering learners worldwide with accessible, high-quality
						education.
					</p>
				</div>
				<div>
					<h3 className="text-xl font-bold mb-4">Explore</h3>
					<ul className="space-y-2">
						<li>
							<Link to={"/courses"}>Courses</Link>
						</li>
						<li>
							<a href="/paths" className="hover:text-indigo-400 transition">
								Learning Paths
							</a>
						</li>
						<li>
							<a href="/about" className="hover:text-indigo-400 transition">
								About Us
							</a>
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
					<div className="flex space-x-4">
						<a href="#" className="hover:text-indigo-400 transition">
							Facebook
						</a>
						<a href="#" className="hover:text-indigo-400 transition">
							Twitter
						</a>
						<a href="#" className="hover:text-indigo-400 transition">
							Instagram
						</a>
						<a href="#" className="hover:text-indigo-400 transition">
							LinkedIn
						</a>
					</div>
				</div>
			</div>
			<div className="mt-10 text-center text-gray-400">
				<p>
					&copy; {new Date().getFullYear()} EduPlatform. All rights reserved.
				</p>
			</div>
		</footer>
	);
};
