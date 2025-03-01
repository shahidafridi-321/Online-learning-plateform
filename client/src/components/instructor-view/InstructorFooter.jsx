export const InstructorFooter = () => {
	return (
		<footer className="bg-white dark:bg-gray-900 py-4 px-6 shadow-inner mt-auto">
			<div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
				<p>
					&copy; {new Date().getFullYear()} Instructor Dashboard. All rights
					reserved.
				</p>
			</div>
		</footer>
	);
};
